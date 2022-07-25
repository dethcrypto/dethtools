/// <reference types="cypress" />
import { currentEpochTime } from '../../src/lib/CurrentEpochTime';
import sinon from 'sinon';
import { getInputByLabel } from './e2e.helpers';
import failOnConsoleError, { consoleType } from 'cypress-fail-on-console-error';
import { convertUnixEpochToUtc } from '../../src/lib/convertUnixEpochToUtc';
import { it } from 'mocha';

failOnConsoleError({
  includeConsoleTypes: [consoleType.ERROR, consoleType.WARN, consoleType.INFO],
  cypressLog: true,
});

describe('Calldata Decoder Page', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('no errors written to the console in token-unit-conversion', () => {
    cy.visit('http://localhost:3000/token-unit-conversion');

    getInputByLabel('Decimals').should('have.value', '18').clear();
    cy.get('[role="alert"]').contains(
      'The decimals must be a number greater than 0',
    );
    getInputByLabel('Decimals').type('10');
    getInputByLabel('Units')
      .should('have.value', '')
      .type('1')
      .should('have.value', '1');
    getInputByLabel('Base')
      .should('have.value', '0.0000000001')
      .clear()
      .type('1337.22');
    getInputByLabel('Units').should('have.value', '13372200000000');

    getInputByLabel('Decimals').clear().type('@@%').type('6');
    getInputByLabel('Units').type('@%%');
    cy.get('[role="alert"]').contains(
      "The value mustn't contain letters or any special signs except dot",
    );
    getInputByLabel('Units').clear().type('1000000.000000005');
    getInputByLabel('Base').should('have.value', '1.000000000000005');
  });

  it('no errors written to the console in unix-epoch-utc-conversion', () => {
    cy.visit('http://localhost:3000/unix-epoch-utc-conversion');

    const currentEpoch = Math.floor(new Date().getTime() / 1000);
    sinon.stub(currentEpochTime, 'get').returns(currentEpoch);
    const currentEpochUtc = convertUnixEpochToUtc(String(currentEpoch));

    getInputByLabel('UnixEpoch')
      .should('have.value', '')
      .type(String(currentEpoch));
    cy.get(`[aria-label="convert unix epoch"]`).click();
    cy.get(`[aria-label="utc date"]`).should(
      'contain',
      String(currentEpochUtc?.utcDate),
    );

    getInputByLabel('sec').should('have.value', '').type('10');
    getInputByLabel('min').should('have.value', '').type('10');
    getInputByLabel('hr').should('have.value', '').type('10');
    getInputByLabel('day').should('have.value', '').type('10');
    getInputByLabel('mon').should('have.value', '').type('10');
    getInputByLabel('year').should('have.value', '').type('2021');
    cy.get(`[aria-label="convert utc"]`).click();
    cy.get(`[aria-label="unix epoch"]`).should('contain', '1633860610000');
  });

  it('no errors written to the console in base-conversion', () => {
    cy.visit('http://localhost:3000/base-conversion');

    getInputByLabel('Binary').type('10101000010011110000001010001');
    getInputByLabel('Octal').should('have.value', '02502360121');
    getInputByLabel('Decimal').should('have.value', '352968785');
    getInputByLabel('Hexadecimal').should('have.value', '0x1509e051');

    getInputByLabel('Binary').clear().type('%%');
    cy.get('[role="alert"]').contains(
      'The value must be a valid, binary number',
    );
    getInputByLabel('Octal').clear().type('1234');
    cy.get('[role="alert"]').contains(
      'The value must be a valid, octal number, 0-prefix is required',
    );
  });

  it('no errors written to the console in calldata-decoder', () => {
    cy.visit('http://localhost:3000/calldata-decoder');

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
    cy.get('[aria-label="raw abi error"]').contains(
      'invalid function signature',
    );

    getInputByLabel('Calldata')
      .should('have.value', '0x1234')
      .clear()
      .type(
        '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
      );
    cy.get('[role="tab"]').contains('ABI').click();
    cy.get('[aria-label="text area for abi"]')
      .clear()
      .type(
        '[{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter3","type":"tuple"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter4","type":"tuple"}],"internalType":"struct MyType2","name":"myType","type":"tuple"},{"internalType":"uint256","name":"myUint","type":"uint256"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
        { parseSpecialCharSequences: false, force: true },
      );
    cy.get('button').contains('Decode').click();
    cy.get('[aria-label="signature hash"]').contains('0x6a947f74');
    let correctDecodedValues = ['123', '123', '123', '123', '540'];
    cy.get('[aria-label="decoded value"]').each((item, index) =>
      cy.wrap(item).contains(correctDecodedValues[index]),
    );
  });

  it('no errors written to the console in eth-unit-conversion', () => {
    cy.visit('http://localhost:3000/eth-unit-conversion');

    getInputByLabel('WEI')
      .should('have.value', '')
      .type('1')
      .should('have.value', '1');
    getInputByLabel('GWEI').should('have.value', '0.000000001');
    getInputByLabel('ETH').should('have.value', '0.000000000000000001');
    getInputByLabel('ETH').clear();
    cy.get('[role="alert"]').contains('The value must be longer than 1 digit');
    getInputByLabel('ETH').type('2137.1337.1000');
    getInputByLabel('GWEI').should('have.value', '2137133700000');
    getInputByLabel('WEI').should('have.value', '2137133700000000000000');
  });
});
