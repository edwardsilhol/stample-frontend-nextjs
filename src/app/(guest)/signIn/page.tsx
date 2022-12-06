'use client';

import React from 'react';
import { useSignIn } from '../../../stores/hooks/user';

function SignInPage() {
  const signIn = useSignIn();
  return (
    <div>
      <h1>SignIn</h1>
      <button
        onClick={() =>
          signIn.mutate({
            email: 'admin@admin.com',
            password: 'adminadminadmin',
          })
        }
      >
        Sign In
      </button>
    </div>
  );
}

export default SignInPage;
