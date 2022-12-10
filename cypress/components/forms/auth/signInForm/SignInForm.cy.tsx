import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignInForm from '../../../../../src/components/forms/auth/signInForm/SignInForm';

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
    // check that the component renders
    cy.get('form').should('exist');
  });
  it('invalidEmail', () => {
    cy.get('input[name="email"]').type('test.com');
    cy.get('form').submit();
    cy.get('input[name="email"]').trigger('mouseover');
    cy.contains('email must be a valid email');
  });
  it('validEmail', () => {
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('form').submit();
    cy.get('input[name="email"]').trigger('mouseover');
    cy.contains('email must be a valid email').should('not.exist');
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
    cy.contains('email must be a valid email').should('not.exist');
  });
});
