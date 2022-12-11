import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUpForm from '../../../../../src/components/forms/auth/signUpForm/SignUpForm';
import {
  checkInvalidFormField,
  checkRequiredFormField,
  checkValidFormField,
} from '../../../../support/formUtils';
import testData from '../../../../fixtures/signUpForm.json';

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
  it('renders', () => {
    cy.get('form').should('exist');
  });
  testData?.requiredFields.forEach((requiredField: any) => {
    it(`required${requiredField.testName}`, () => {
      checkRequiredFormField(requiredField?.fieldName);
    });
  });
  testData?.validFields.forEach((validField: any) => {
    it(`valid${validField.testName}`, () => {
      checkValidFormField(validField?.fieldName, validField?.validValue);
    });
  });
  testData?.invalidFields.forEach((invalidField: any) => {
    it(`invalid${invalidField.testName}`, () => {
      checkInvalidFormField(
        invalidField?.fieldName,
        invalidField?.invalidValue,
        invalidField?.errorMessage,
      );
    });
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
