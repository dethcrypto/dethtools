import { ChangeEvent, Fragment, useEffect, useState } from 'react'

import { tokenPrecision } from '../lib/convertProperties'
import { convertTokenUnits } from '../lib/convertUnits'
import { decodeHex } from '../lib/decodeHex'
import { unitSchema } from '../misc/unitSchema'

const DEFAULT_DECIMAL = '18'

export default function TokenUnitConversion() {
  const [error, setError] = useState<string | undefined>()
  const [lastType, setLastType] = useState<TokenUnitType>('base')
  const [lastValue, setLastValue] = useState('')

  const [decimal, setDecimal] = useState('')
  const [unit, setUnit] = useState('')
  const [base, setBase] = useState('')

  const unitStates = [
    { name: 'unit', set: (out: string) => setUnit(out) },
    { name: 'base', set: (out: string) => setBase(out) },
  ]

  const units: UnitTypeExtended[] = [
    { name: 'unit', value: unit },
    { name: 'base', value: base },
  ]

  function handleChangeValue(value: string, unitType: TokenUnitType) {
    value = decodeHex(value)

    const result = unitSchema.safeParse(value)
    if (!result.success) {
      setError(result.error.errors[0].message)
    } else {
      value = result.data
      setError(undefined)
    }

    for (const unit of units) {
      tokenPrecision.base = parseInt(decimal || DEFAULT_DECIMAL)

      let out = convertTokenUnits(value, unitType, unit.name)!

      for (const unitState of unitStates) {
        if (unitType === unitState.name) {
          continue
        } else if (unitState.name === unit.name) {
          if (isNaN(parseInt(out))) {
            out = unit.value
          }
          unitState.set(out)
        }
      }
    }

    setLastType(unitType)
    setLastValue(value)

    for (const unit of unitStates) {
      if (unitType === unit.name) {
        unit.set(value)
      }
    }
  }

  return (
    <div className="max-w-1/3 ml-auto mt-32 flex w-4/5 pl-24">
      <form className="mx-auto flex flex-col gap-10">
        <h1> Token unit conversion </h1>
        <UnitElements
          units={units}
          error={error}
          onChange={handleChangeValue}
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
  error: string | undefined
  onChange: (value: string, unitType: TokenUnitType) => void
  setDecimal: (value: string) => void
  lastType: TokenUnitType
  lastValue: string
}

function UnitElements({ units, error, onChange, setDecimal, lastValue, lastType }: UnitElementsProps): JSX.Element {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange(lastValue, lastType), [units, setDecimal, lastValue, lastType])

  return (
    <Fragment>
      <p data-testid="error" className="absolute mt-12 text-sm text-red-400">
        {error}
      </p>

      <section className="mb-6">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="rounded-sm bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-1 px-6 text-left text-xs font-medium uppercase
                tracking-wider text-gray-700 dark:text-gray-400"
              >
                <label htmlFor="decimals" className="text-lg">
                  Decimals
                </label>
              </th>

              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium uppercase
                tracking-wider text-gray-700 dark:text-gray-400"
              >
                <input
                  id="decimals"
                  type="number"
                  placeholder={tokenPrecision.base.toString()}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setDecimal(event.target.value)
                  }}
                  className="w-36 rounded-sm border border-dashed border-black p-3"
                />
              </th>
            </tr>
          </thead>
        </table>
      </section>

      {units.map((unit) => {
        const { name, value } = unit

        return (
          <div key={name}>
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="rounded-sm bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 text-left text-xs font-medium uppercase
                    tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    <label htmlFor={name} className="text-lg">
                      {name}
                    </label>
                  </th>

                  <th
                    scope="col"
                    className="text-md py-3 px-6 text-left font-medium uppercase
                    tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    <input
                      id={name}
                      placeholder={value ? value.toString() : '0'}
                      value={value}
                      type="string"
                      onChange={(event) => {
                        onChange(event.target.value, name)
                      }}
                      className="w-72 rounded-sm border border-dashed border-black p-3"
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
