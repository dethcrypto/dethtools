/// <reference types="cypress" />

import { getInputByLabel } from './e2e.helpers';

describe('Calldata Decoder Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/calldata-decoder');
  });

  it('uses calldata decoder incorrectly (no-abi)', () => {
    getInputByLabel('Calldata').should('have.value', '').type('10');
    cy.get('[role="alert"]').contains(
      'The value must be a hexadecimal number, 0x-prefix is required',
    );
    getInputByLabel('Calldata').clear().type('0x1234');
    cy.get('button').contains('Decode').click();
    cy.get('[aria-label="no results found"]');
  });

  it('uses calldata decoder incorrectly', () => {
    getInputByLabel('Calldata').should('have.value', '').type('10');
    cy.get('[role="alert"]').contains(
      'The value must be a hexadecimal number, 0x-prefix is required',
    );
    getInputByLabel('Calldata').clear().type('0x1234');
    cy.get('[role="tab"]').contains('ABI').click();
    cy.get('[aria-label="text area for abi"]').type('function', {
      parseSpecialCharSequences: false,
      force: true,
    });
    cy.get('[role="alert"]').contains('invalid function signature');
  });

  it.only('uses calldata decoder correctly', () => {
    getInputByLabel('Calldata')
      .should('have.value', '')
      .type(
        '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
      );
    cy.get('[role="tab"]').contains('ABI').click();
    cy.get('[aria-label="text area for abi"]').type(
      '[{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter3","type":"tuple"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter4","type":"tuple"}],"internalType":"struct MyType2","name":"myType","type":"tuple"},{"internalType":"uint256","name":"myUint","type":"uint256"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
      { parseSpecialCharSequences: false, force: true },
    );
    cy.get('button').contains('Decode').click();
    cy.get('[aria-label="signature hash"]').contains('0x6a947f74');
    const correctDecodedValues = ['123', '123', '123', '123', '540'];
    cy.get('[aria-label="decoded value"]').each((item, index) =>
      cy.wrap(item).contains(correctDecodedValues[index]),
    );
    cy.get('[aria-label="hex part of the toggle button"]').each((_, __, list) =>
      list[0].click(),
    );
    cy.get('[aria-label="decoded value"]').each((_, __, list) =>
      list[0].innerText.includes('0x7b'),
    );
  });

  it('uses calldata decoder correctly (no-abi)', () => {
    getInputByLabel('Calldata')
      .clear()
      .type(
        '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      );
    cy.get('button').contains('Decode').click();
    cy.get('[aria-label="signature hash"]').contains('0x23b872dd');
    const correctDecodedValues = [
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
      '1000000000000000000',
    ];
    cy.get('[aria-label="decoded value"]').each((item, index) =>
      cy.wrap(item).contains(correctDecodedValues[index]),
    );
    cy.get('[aria-label="dec part of the toggle button"]').each((_, __, list) =>
      list[0].click(),
    );
    cy.get('[aria-label="decoded value"]').each((_, __, list) =>
      list[0].innerText.includes(
        '797161134358056856230896843146392277790002887282',
      ),
    );
  });
});
