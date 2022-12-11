import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUpForm from '../../../../../src/components/forms/auth/signUpForm/SignUpForm';
import {
  checkInvalidFormField,
  checkRequiredFormField,
  checkValidFormField,
} from '../../utils/utils';

export {};

const queryClient = new QueryClient();

function mountComponent() {
  cy.mount(
    <QueryClientProvider client={queryClient}>
      <SignUpForm />
    </QueryClientProvider>,
  );
}

const requiredFields = [
  {
    testName: 'FirstName',
    fieldName: 'firstName',
  },
  {
    testName: 'LastName',
    fieldName: 'lastName',
  },
  {
    testName: 'Email',
    fieldName: 'email',
  },
  {
    testName: 'Password',
    fieldName: 'password',
  },
  {
    testName: 'ConfirmPassword',
    fieldName: 'confirmPassword',
  },
];

const validFields = [
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
];

const invalidFields = [
  {
    testName: 'Email',
    fieldName: 'email',
    invalidValue: 'test.com',
    errorMessage: 'email must be a valid email',
  },
];

describe('SignUpForm.cy.tsx', () => {
  beforeEach(() => {
    mountComponent();
  });
  it('renders', () => {
    cy.get('form').should('exist');
  });
  requiredFields.map((test) => {
    checkRequiredFormField(test.testName, test.fieldName);
  });
  validFields.map((test) => {
    checkValidFormField(test.testName, test.fieldName, test.validValue);
  });
  invalidFields.map((test) => {
    checkInvalidFormField(
      test.testName,
      test.fieldName,
      test.invalidValue,
      test.errorMessage,
    );
  });
  // TODO: add tests for both passwords matching
  // TODO: add tests for email being valid
});
