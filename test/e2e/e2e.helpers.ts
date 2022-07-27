export function getInputByLabel(
  label: string,
): Cypress.Chainable<string | undefined> {
  return cy
    .contains('label', label)
    .invoke('attr', 'for')
    .then((id) => {
      cy.get('#' + id);
    });
}
