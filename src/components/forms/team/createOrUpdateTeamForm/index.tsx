'use client';

import * as Yup from 'yup';
import { Team } from '../../../../stores/types/team.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldArrayWithId, useForm } from 'react-hook-form';
import {
  useCreateTeam,
  useUpdateTeam,
} from '../../../../stores/hooks/team.hooks';
import TextFormField from '../../fields/textFormField';
import {
  useOrganisation,
  useUpdateOrganisation,
} from 'stores/hooks/organisation.hooks';
import { Close, Mail } from '@mui/icons-material';
import {
  IconButton,
  InputBase,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { PopulatedTeam } from 'stores/types/team.types';
import { LocalRole, User, UserForOtherClient } from 'stores/types/user.types';
import { useSession } from 'stores/hooks/user.hooks';
import SelectFieldForm from '../../fields/selectFieldForm';
import { capitalize } from 'lodash';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/navigation';
import { TEAM_ROUTE } from '../../../../constants/routes.constant';
import CircularLoading from '../../../base/circularLoading';

type FormValues = Pick<Team, 'name' | 'users' | 'invitations'>;

interface UpdateTeamMembersProps {
  loggedUser: User;
  team?: PopulatedTeam | null;
  control: Control<FormValues>;
}

function UpdateTeamMembers({
  team,
  control,
  loggedUser,
}: UpdateTeamMembersProps) {
  const usersById: Record<string, UserForOtherClient> = useMemo(() => {
    if (!team) return {};
    return team.users.reduce((accumulator, user) => {
      if (loggedUser?._id === user.user._id) {
        return accumulator;
      }
      return {
        ...accumulator,
        [user.user._id]: user.user,
      };
    }, {});
  }, [team, loggedUser?._id]);

  const { fields: users, remove: removeUser } = useFieldArray({
    control,
    name: 'users',
  });
  const {
    fields: invitations,
    append: appendInvitation,
    remove: removeInvitation,
  } = useFieldArray({
    control,
    name: 'invitations',
  });
  const [invitationEmail, setInvitationEmail] = useState('');
  const onClickAddInvitation = () => {
    appendInvitation({
      email: invitationEmail,
      role: LocalRole.MEMBER,
    });
    setInvitationEmail('');
  };
  return (
    <>
      <TableContainer sx={{ maxHeight: '400px' }}>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              border: 'none',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{
                  fontWeight: 700,
                  paddingLeft: '0px',
                }}
              >
                Members
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ...users,
              ...(!team
                ? ([
                    {
                      user: loggedUser?._id,
                      role: LocalRole.ADMIN,
                      id: loggedUser?._id,
                    },
                  ] as FieldArrayWithId<FormValues, 'users', 'id'>[])
                : []),
            ].map((member, index) => {
              const isAuthenticatedUser = member.user === loggedUser?._id;
              const user: UserForOtherClient | undefined =
                usersById[member.user];
              return (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 0,
                    }}
                  >
                    <Avatar />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {isAuthenticatedUser
                      ? 'You'
                      : `${capitalize(user?.firstName)} ${capitalize(
                          user?.lastName,
                        )}`}
                  </TableCell>
                  <TableCell sx={{ minWidth: '100px' }}>
                    {isAuthenticatedUser ? (
                      member.role === LocalRole.ADMIN ? (
                        'Admin'
                      ) : member.role === LocalRole.MEMBER ? (
                        'Member'
                      ) : (
                        'Owner'
                      )
                    ) : (
                      <SelectFieldForm
                        control={control}
                        name={`users.${index}.role`}
                        fullWidth
                        variant="standard"
                        disabled={member.role === LocalRole.OWNER}
                      >
                        <MenuItem value={LocalRole.ADMIN}>Admin</MenuItem>
                        <MenuItem value={LocalRole.MEMBER}>Member</MenuItem>
                        <MenuItem value={LocalRole.OWNER}>Owner</MenuItem>
                      </SelectFieldForm>
                    )}
                  </TableCell>
                  <TableCell sx={{ paddingRight: 0 }}>
                    <IconButton
                      disabled={
                        member.role === LocalRole.OWNER || isAuthenticatedUser
                      }
                      onClick={() => {
                        removeUser(index);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {invitations.map((invitation, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    paddingLeft: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <Mail />
                  </Box>
                </TableCell>
                <TableCell>{invitation.email}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>
                  <SelectFieldForm
                    control={control}
                    name={`invitations.${index}.role`}
                    fullWidth
                    variant="standard"
                  >
                    <MenuItem value={LocalRole.ADMIN}>Admin</MenuItem>
                    <MenuItem value={LocalRole.MEMBER}>Member</MenuItem>
                  </SelectFieldForm>
                </TableCell>
                <TableCell sx={{ paddingRight: 0 }}>
                  <IconButton
                    onClick={() => {
                      removeInvitation(index);
                    }}
                  >
                    <Close />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box paddingTop={3}>
        <Typography variant="body2" sx={{ fontWeight: 700 }} width="100%">
          Add a team member with an email invitation
        </Typography>
        <Stack direction="row" spacing={1}>
          <InputBase
            sx={{ flex: 1 }}
            placeholder="john.doe@gmail.com"
            value={invitationEmail}
            onChange={(e) => {
              setInvitationEmail(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onClickAddInvitation();
              }
            }}
          />
          <Button
            disabled={!invitationEmail}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: 'additionalColors.primaryLighter',
              color: 'primary.main',
            }}
            onClick={onClickAddInvitation}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </>
  );
}
interface CreateOrUpdateTeamFormProps {
  team?: PopulatedTeam;
  onClose: () => void;
}

function CreateOrUpdateTeamForm({
  team,
  onClose,
}: CreateOrUpdateTeamFormProps) {
  const router = useRouter();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();

  const { data: loggedUser, isLoading: isLoggedUserLoading } = useSession();
  const { data: organisation } = useOrganisation();
  const updateOrganisation = useUpdateOrganisation();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    users: Yup.array().of(
      Yup.object().shape({
        user: Yup.string().required('User is required'),
        role: Yup.string().required('Role is required'),
      }),
    ),
    invitations: Yup.array()
      .of(
        Yup.object().shape({
          email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
          role: Yup.string().required('Role is required'),
        }),
      )
      .test(
        'unique-emails',
        'Emails must be unique',
        (invitations) =>
          invitations?.length ===
          new Set(invitations?.map((invitation) => invitation.email)).size,
      ),
  });

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: team?.name || '',
      ...(team
        ? {
            users:
              team?.users.map((user) => ({
                user: user.user._id,
                role: user.role,
              })) || [],
          }
        : {}),
      invitations: team?.invitations || [],
    },
    resolver: yupResolver(validationSchema) as any,
  });

  const onSubmit = async (values: FormValues) => {
    const { name, users, invitations } = values;
    try {
      if (team) {
        await updateTeam.mutateAsync({
          teamId: team._id,
          updateTeamDto: {
            name,
            users,
            invitations,
          },
        });
        onClose();
      } else {
        const team = await createTeam.mutateAsync({
          name,
          invitations,
        });
        if (organisation) {
          await updateOrganisation.mutateAsync({
            organisationId: organisation._id,
            updateOrganisationDto: {
              add: {
                teams: [team._id],
              },
            },
          });
        }
        onClose();
        router.push(`${TEAM_ROUTE}/${team._id}`);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  return !isLoggedUserLoading && loggedUser ? (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="column"
        spacing={2}
        justifyContent="space-between"
        sx={{ minHeight: { md: '500px' }, minWidth: { md: '400px' } }}
      >
        <Box>
          <Box paddingBottom={3}>
            <Typography variant="body2" fontWeight={700}>
              Name your team
            </Typography>
            <TextFormField
              control={control}
              name="name"
              placeholder="Name"
              variant="standard"
              required
              fullWidth
            />
          </Box>
          <UpdateTeamMembers
            control={control}
            team={team}
            loggedUser={loggedUser}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            alignSelf: 'end',
            marginTop: 4,
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  ) : (
    <CircularLoading />
  );
}

export default CreateOrUpdateTeamForm;
