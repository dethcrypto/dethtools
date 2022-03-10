import { ChangeEvent, Fragment, useEffect, useState } from 'react'

import { tokenPrecision } from '../lib/convertProperties'
import { convertTokenUnits } from '../lib/convertUnits'

export default function TokenUnitConversion() {
  const [lastType, setLastType] = useState<TokenUnitType>('base')
  const [lastValue, setLastValue] = useState('')

  const [decimal, setDecimal] = useState('')
  const [unit, setUnit] = useState('')
  const [base, setBase] = useState('')

  function resetValues() {
    setUnit('')
    setBase('')
  }

  const units: UnitTypeExtended[] = [
    { name: 'unit', value: unit },
    { name: 'base', value: base },
  ]

  function handleChangeEvent(value: string, unitType: TokenUnitType) {
    let out

    // 'On paste' conversion from hexadecimal to decimal values
    if (value.split('')[1] === 'x') {
      value = parseInt(value, 16).toString()
    }

    tokenPrecision.base = parseInt(decimal || '18')

    for (const unit of units) {
      out = convertTokenUnits(value, unitType, unit.name)

      if (out) {
        if (isNaN(parseInt(out))) out = ''

        if (unit.name === 'unit') setUnit(out)
        if (unit.name === 'base') setBase(out)
      }
    }

    setLastType(unitType)
    setLastValue(value)

    if (!out) {
      resetValues()
    }
  }

  return (
    <div className="flex ml-auto max-w-1/3 w-4/5 pl-24 mt-32">
      <form className="flex flex-col gap-10 mx-auto">
        <h1> Token unit conversion </h1>
        <UnitElements
          onChange={handleChangeEvent}
          units={units}
          setDecimal={setDecimal}
          lastValue={lastValue}
          lastType={lastType}
        />
      </form>
    </div>
  )
}

interface UnitElementsProps {
  units: UnitTypeExtended[]
  onChange: (value: string, unitType: TokenUnitType) => void
  setDecimal: (value: string) => void
  lastType: TokenUnitType
  lastValue: string
}

function UnitElements({ units, onChange, setDecimal, lastValue, lastType }: UnitElementsProps): JSX.Element {
  useEffect(() => onChange(lastValue, lastType), [units, setDecimal])

  return (
    <Fragment>
      <section className="mb-6">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 rounded-sm">
            <tr>
              <th
                scope="col"
                className="py-1 px-6 text-xs font-medium tracking-wider text-left
                text-gray-700 uppercase dark:text-gray-400"
              >
                <p className="text-lg"> Decimals </p>
              </th>

              <th
                scope="col"
                className="py-3 px-6 text-xs font-medium tracking-wider text-left
                text-gray-700 uppercase dark:text-gray-400"
              >
                <input
                  type="number"
                  placeholder={tokenPrecision.base.toString()}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setDecimal(event.target.value)
                  }}
                  className="p-3 w-36 border border-dashed border-black rounded-sm"
                />
              </th>
            </tr>
          </thead>
        </table>
      </section>

      {units.map((unit) => {
        const { name, value } = unit
        return (
          <div>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 rounded-sm">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 text-xs font-medium tracking-wider text-left
                    text-gray-700 uppercase dark:text-gray-400"
                  >
                    <p className="text-lg"> {name} </p>
                  </th>

                  <th
                    scope="col"
                    className="py-3 px-6 text-md font-medium tracking-wider text-left
                    text-gray-700 uppercase dark:text-gray-400"
                  >
                    <input
                      placeholder={value ? value.toString() : '0'}
                      value={value}
                      type="string"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        onChange(event.target.value, name)
                      }}
                      className="p-3 w-72 border border-dashed border-black rounded-sm"
                    />
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        )
      })}
    </Fragment>
  )
}

type TokenUnitType = 'base' | 'unit'

interface UnitTypeExtended {
  name: TokenUnitType
  value: string
}
