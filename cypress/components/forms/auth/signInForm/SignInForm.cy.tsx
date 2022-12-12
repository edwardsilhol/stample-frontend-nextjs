import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignInForm from '../../../../../src/components/forms/auth/signInForm/SignInForm';
import {
  checkInvalidFormField,
  checkRequiredFormField,
  checkValidFormField,
} from '../../../../support/formUtils';
import testData from '../../../../fixtures/components/forms/auth/signInForm/signInForm.json';

export {};

const queryClient = new QueryClient();

function mountComponent() {
  cy.mount(
    <QueryClientProvider client={queryClient}>
      <SignInForm />
    </QueryClientProvider>,
  );
}

describe('SignInForm.cy.tsx', () => {
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
