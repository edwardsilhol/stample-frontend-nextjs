import React from 'react';
import * as Yup from 'yup';
import { Team } from '../../../stores/types/team.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldArrayWithId, useForm } from 'react-hook-form';
import { useCreateTeam, useUpdateTeam } from '../../../stores/hooks/team.hooks';
import Box from '../../muiOverrides/Box';
import { TextFieldForm } from '../fields/TextFieldForm';
import { Avatar, Button } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import { useSelectedOrganisationId } from 'stores/data/organisation.data';
import {
  useOrganisation,
  useUpdateOrganisation,
} from 'stores/hooks/organisation.hooks';
import { useSelectedTeamId } from 'stores/data/team.data';
import { Add, Delete, Mail } from '@mui/icons-material';
import {
  IconButton,
  InputBase,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMemo } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { PopulatedTeam } from 'stores/types/team.types';
import { LocalRole, UserForOtherClient } from 'stores/types/user.types';
import { useSession } from 'stores/hooks/user.hooks';
import { SelectFieldForm } from '../fields/SelectFieldForm';
const useStyles = () => ({
  container: {
    margin: '16px',
  },
  editorContainer: {
    height: '300px',
  },
});

type FormValues = Pick<Team, 'name' | 'users' | 'invitations'>;

interface UpdateTeamMembersProps {
  team?: PopulatedTeam;
  control: Control<FormValues>;
}

export const UpdateTeamMembers: React.FC<UpdateTeamMembersProps> = ({
  team,
  control,
}) => {
  const { data: authenticatedUser } = useSession();
  const usersById: Record<string, UserForOtherClient> = useMemo(() => {
    if (!team) return {};
    return team.users.reduce((accumulator, user) => {
      if (authenticatedUser?._id === user.user._id) {
        return accumulator;
      }
      return {
        ...accumulator,
        [user.user._id]: user.user,
      };
    }, {});
  }, [team, authenticatedUser?._id]);
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
  const [invitationEmail, setInvitationEmail] = React.useState('');
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>Members</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            ...users,
            ...(!team
              ? ([
                  {
                    user: authenticatedUser?._id,
                    role: LocalRole.ADMIN,
                    id: authenticatedUser?._id,
                  },
                ] as FieldArrayWithId<FormValues, 'users', 'id'>[])
              : []),
          ].map((member, index) => {
            const isAuthenticatedUser = member.user === authenticatedUser?._id;
            const user: UserForOtherClient | undefined = usersById[member.user];
            return (
              <TableRow key={index}>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar />
                </TableCell>
                <TableCell>
                  {isAuthenticatedUser
                    ? 'You'
                    : `${user?.firstName} ${user?.lastName}`}
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
                <TableCell>
                  <IconButton
                    disabled={member.role === LocalRole.OWNER}
                    onClick={() => {
                      removeUser(index);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {invitations.map((invitation, index) => (
            <TableRow key={index}>
              <TableCell>
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
              <TableCell>
                <IconButton
                  onClick={() => {
                    removeInvitation(index);
                  }}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
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
            <TableCell colSpan={2}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Invite user by email"
                value={invitationEmail}
                onChange={(e) => {
                  setInvitationEmail(e.target.value);
                }}
              />
            </TableCell>
            <TableCell>
              <IconButton
                disabled={!invitationEmail}
                type="button"
                sx={{ p: '10px' }}
                onClick={() => {
                  appendInvitation({
                    email: invitationEmail,
                    role: LocalRole.MEMBER,
                  });
                  setInvitationEmail('');
                }}
              >
                <Add />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
interface Props {
  team?: PopulatedTeam;
  onClose: () => void;
}

export const CreateOrUpdateTeamForm: React.FC<Props> = ({ team, onClose }) => {
  const styles = useStyles();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();

  const [selectedOrganisationId] = useSelectedOrganisationId();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedTeamId] = useSelectedTeamId();
  const { data: organisation } = useOrganisation(selectedOrganisationId);
  const { mutateAsync: updateOrganisation } = useUpdateOrganisation();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    users: Yup.array().of(
      Yup.object().shape({
        user: Yup.string().required('User is required'),
        role: Yup.string().required('Role is required'),
      }),
    ),
    invitations: Yup.array().of(
      Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
        role: Yup.string().required('Role is required'),
      }),
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
    resolver: yupResolver(validationSchema),
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
        await createTeam
          .mutateAsync({
            name,
            invitations,
          })
          .then((team) => {
            if (organisation) {
              updateOrganisation({
                organisationId: organisation._id,
                updateOrganisationDto: {
                  add: {
                    teams: [team._id],
                  },
                },
              }).then(() => {
                setSelectedTeamId(team._id);
                onClose();
              });
            } else {
              setSelectedTeamId(team._id);
              onClose();
            }
          });
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={2} sx={styles.container}>
        <TextFieldForm
          control={control}
          name="name"
          label="Name"
          fullWidth
          required
        />
        <UpdateTeamMembers control={control} team={team} />
        <Button type="submit">Submit</Button>
      </Stack>
    </Box>
  );
};
