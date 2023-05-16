'use client';

import React from 'react';
import { Invitation } from '../../../../components/team/Invitation';
interface Props {
  params: {
    id: string;
  };
}
const InvitationPage: React.FC<Props> = ({ params: { id } }) => {
  return <Invitation teamId={id} />;
};

export default InvitationPage;
