export function checkRequiredFormField(
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
  it(`empty${testName}`, () => {
    cy.get('form').submit();
    cy.get(`input[name="${fieldName}"]`).trigger('mouseover');
    cy.contains(`${fieldName} is a required field`).should('exist');
  });
}
