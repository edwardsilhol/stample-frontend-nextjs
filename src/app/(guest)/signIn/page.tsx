'use client';

import React from 'react';
import { useSession, useSignIn } from '../../../stores/hooks/user';
import { useRouter } from 'next/navigation';

function SignInPage() {
  const signIn = useSignIn();
  const router = useRouter();
  return (
    <div>
      <h1>SignIn</h1>
      <button
        onClick={async () => {
          // TODO : handle using form
          const user = await signIn.mutateAsync({
            email: 'admin@admin.com',
            password: 'adminadminadmin',
          });
          if (user) {
            router.back();
          }
        }}
      >
        Sign In
      </button>
    </div>
  );
}

export default SignInPage;
