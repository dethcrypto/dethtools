import { ChangeEvent, Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { tokenPrecision } from '../lib/convertProperties'
import { convertTokenUnits } from '../lib/convertUnits'
import { decodeHex } from '../lib/decodeHex'
import { decimalSchema } from '../misc/decimalSchema'
import { unitSchema } from '../misc/unitSchema'

const DEFAULT_DECIMAL = '18'
type State = { base: string; unit: string }

const entries = Object.entries as <T>(obj: T) => [keyof T, T[keyof T]][]

export default function TokenUnitConversion() {
  const [error, setError] = useState<string>()

  const lastUpdate = useRef<UnitTypeExtended>()

  const [decimal, setDecimal] = useState('')
  const [state, setState] = useState<State>({ base: '', unit: '' })

  const handleChangeValue = useMemo(() => {
    return (value: string, currentType: TokenUnitType) => {
      value = decodeHex(value)

      setError(undefined)
      try {
        unitSchema.parse(value)
        decimalSchema.parse(decimal || DEFAULT_DECIMAL)
      } catch (e) {
        setError(JSON.parse(e as string)[0].message)
      }

      setState((oldState) => {
        const newState: State = { ...oldState, [currentType]: value }

        for (const [name, unitValue] of entries(newState)) {
          tokenPrecision.base = parseInt(decimal || DEFAULT_DECIMAL)
          if (name === currentType) continue

          let out: string = ''
          if (!error) {
            out = convertTokenUnits(value, currentType, name)!
          }
          if (isNaN(parseInt(out))) out = unitValue
          newState[name] = out
        }
        lastUpdate.current = { name: currentType, value }
        return newState
      })
    }
  }, [decimal, error])

  useEffect(() => {
    if (lastUpdate.current) {
      handleChangeValue(lastUpdate.current.value, lastUpdate.current.name)
    }
  }, [handleChangeValue])

  const units: UnitTypeExtended[] = [
    { name: 'unit', value: state.unit },
    { name: 'base', value: state.base },
  ]

  return (
    <div className="max-w-1/3 ml-auto mt-32 flex w-4/5 pl-24">
      <form className="mx-auto flex flex-col gap-10">
        <h1> Token unit conversion </h1>
        <UnitElements units={units} error={error} onChange={handleChangeValue} setDecimal={setDecimal} />
      </form>
    </div>
  )
}

interface UnitElementsProps {
  units: UnitTypeExtended[]
  error: string | undefined
  onChange: (value: string, unitType: TokenUnitType) => void
  setDecimal: (value: string) => void
}

function UnitElements({ units, error, onChange, setDecimal }: UnitElementsProps): JSX.Element {
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
                  min={0}
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
