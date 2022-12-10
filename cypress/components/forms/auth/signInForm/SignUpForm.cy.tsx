import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUpForm from '../../../../../src/components/forms/auth/signUpForm/SignUpForm';
import { checkRequiredFormField } from '../../utils/utils';

export {};

const queryClient = new QueryClient();

function mountComponent() {
  cy.mount(
    <QueryClientProvider client={queryClient}>
      <SignUpForm />
    </QueryClientProvider>,
  );
}

describe('SignUpForm.cy.tsx', () => {
  beforeEach(() => {
    mountComponent();
  });
  [
    {
      testName: 'FirstName',
      fieldName: 'firstName',
      validValue: 'firstName',
    },
    {
      testName: 'LastName',
      fieldName: 'lastName',
      validValue: 'lastName',
    },
    {
      testName: 'Email',
      fieldName: 'email',
      validValue: 'test@test.com',
    },
    {
      testName: 'Password',
      fieldName: 'password',
      validValue: 'password',
    },
    {
      testName: 'ConfirmPassword',
      fieldName: 'confirmPassword',
      validValue: 'password',
    },
  ].map((test) => {
    checkRequiredFormField(test.testName, test.fieldName, test.validValue);
  });
});
