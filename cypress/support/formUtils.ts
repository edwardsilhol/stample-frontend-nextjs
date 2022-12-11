export function checkRequiredFormField(fieldName: string) {
  cy.get('form').submit();
  cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
  cy.contains(`${fieldName} is a required field`).should('exist');
}
export function checkValidFormField(fieldName: string, validValue: string) {
  cy.get(`input[name="${fieldName}"]`).type(validValue);
  cy.get('form').submit();
  cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
  cy.contains(`${fieldName} is a required field`).should('not.exist');
}

export function checkInvalidFormField(
  fieldName: string,
  invalidValue: string,
  errorMessage: string,
) {
  cy.get(`input[name="${fieldName}"]`).type(invalidValue);
  cy.get('form').submit();
  cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
  cy.contains(errorMessage).should('exist');
}
