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
  it('passwordDontMatch', () => {
    cy.get('#password').click().type('password1');
    cy.get('#confirmPassword').click().type('password');
    cy.get('form').submit();
    cy.get(`#confirmPassword`).trigger('mouseover');
    cy.contains('Passwords must match');
  });
  // TODO: add tests for dto validation
  it('doSubmit', () => {
    cy.get('#firstName').click().type('firstName');
    cy.get('#lastName').click().type('lastName');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password');
    cy.get('input[name="confirmPassword"]').type('password');
    cy.intercept('POST', `**/auth/signUp`).as('signUp');
    cy.get('form').submit();
    cy.wait('@signUp').then((interception) => {
      console.log(interception.request.body);
      expect(interception.request.body).to.deep.contains({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'test@test.com',
        password: 'password',
      });
    });
  });

  it('signInLink', () => {
    cy.get('a[href="/signIn"]').click();
    cy.url().should('include', '/signIn');
  });
});
