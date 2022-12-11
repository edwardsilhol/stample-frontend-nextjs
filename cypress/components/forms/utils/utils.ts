export function checkRequiredFormField(testName: string, fieldName: string) {
  it(`empty${testName}`, () => {
    cy.get('form').submit();
    cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
    cy.contains(`${fieldName} is a required field`).should('exist');
  });
}
export function checkValidFormField(
  testName: string,
  fieldName: string,
  validValue: string,
) {
  it(`valid${testName}`, () => {
    cy.get(`input[name="${fieldName}"]`).type(validValue);
    cy.get('form').submit();
    cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
    cy.contains(`${fieldName} is a required field`).should('not.exist');
  });
}

export function checkInvalidFormField(
  testName: string,
  fieldName: string,
  invalidValue: string,
  errorMessage: string,
) {
  it(`invalid${testName}`, () => {
    cy.get(`input[name="${fieldName}"]`).type(invalidValue);
    cy.get('form').submit();
    cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
    cy.contains(errorMessage).should('exist');
  });
}
