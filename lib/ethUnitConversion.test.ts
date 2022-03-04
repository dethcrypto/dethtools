import { expect } from 'earljs'

describe('test', () => {
  it('works', () => {
    expect(4).toEqual(2 + 2)
  })
})

// one handler for all values
// it determines which type of value was passed in
// basing on value type it calculates other ones
// and returns them

// export function formatFixed(value: BigNumberish, decimals?: string | BigNumberish): string {
//     if (decimals == null) { decimals = 0; }
//     const multiplier = getMultiplier(decimals);

//     // Make sure wei is a big number (convert as necessary)
//     value = BigNumber.from(value);

//     const negative = value.lt(Zero);
//     if (negative) { value = value.mul(NegativeOne); }

//     let fraction = value.mod(multiplier).toString();
//     while (fraction.length < multiplier.length - 1) { fraction = "0" + fraction; }

//     // Strip training 0
//     fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];

//     const whole = value.div(multiplier).toString();
//     if (multiplier.length === 1) {
//         value = whole;
//     } else {
//         value = whole + "." + fraction;
//     }

//     if (negative) { value = "-" + value; }

//     return value;
// }
