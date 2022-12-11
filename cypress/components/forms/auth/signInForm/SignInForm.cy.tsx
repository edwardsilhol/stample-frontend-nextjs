import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignInForm from '../../../../../src/components/forms/auth/signInForm/SignInForm';
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
      <SignInForm />
    </QueryClientProvider>,
  );
}

const requiredFields = [
  {
    testName: 'Email',
    fieldName: 'email',
  },
  {
    testName: 'Password',
    fieldName: 'password',
  },
];

const validFields = [
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
];

const invalidFields = [
  {
    testName: 'Email',
    fieldName: 'email',
    invalidValue: 'test.com',
    errorMessage: 'email must be a valid email',
  },
];

describe('SignInForm.cy.tsx', () => {
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

  it('doSubmit', () => {
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password');
    cy.intercept('PUT', `**/auth/signIn`).as('signIn');
    cy.get('form').submit();
    cy.wait('@signIn').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        email: 'test@test.com',
        password: 'password',
      });
    });
  });

  it('signUpLink', () => {
    cy.get('a[href="/signUp"]').click();
    cy.url().should('include', '/signUp');
  });
});
