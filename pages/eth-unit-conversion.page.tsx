import { ChangeEvent, Fragment, useState } from 'react'

import { UnitType } from '../lib/convertProperties'
import { convertEthUnits } from '../lib/convertUnits'
import { decodeHex } from '../lib/decodeHex'
import { unitSchema } from '../misc/unitSchema'

export default function EthUnitConversion() {
  const [error, setError] = useState<string | undefined>()
  const [wei, setWei] = useState('')
  const [gwei, setGwei] = useState('')
  const [eth, setEth] = useState('')

  const unitStates = [
    { name: 'wei', setFn: (out: string) => setWei(out) },
    { name: 'gwei', setFn: (out: string) => setGwei(out) },
    { name: 'eth', setFn: (out: string) => setEth(out) },
  ]

  const units: UnitTypeExtended[] = [
    { name: 'wei', value: wei },
    { name: 'gwei', value: gwei },
    { name: 'eth', value: eth },
  ]

  function handleChangeValue(value: string, unitType: UnitType) {
    value = decodeHex(value)

    const result = unitSchema.safeParse(value)
    if (!result.success) {
      setError(result.error.errors[0].message)
    } else {
      value = result.data
      setError(undefined)
    }

    for (const unit of units) {
      let out = convertEthUnits(value, unitType, unit.name)!

      for (const unitState of unitStates) {
        if (unitType === unitState.name) {
          continue
        } else if (unitState.name === unit.name) {
          if (isNaN(parseInt(out))) {
            out = unit.value
          }
          unitState.setFn(out)
        }
      }
    }

    for (const unit of unitStates) {
      if (unitType === unit.name) {
        unit.setFn(value)
      }
    }
  }

  return (
    <div className="max-w-1/3 ml-auto mt-32 flex w-4/5 pl-24">
      <form className="mx-auto flex flex-col gap-10">
        <h1> Ethereum unit conversion </h1>
        <UnitElements onChange={handleChangeValue} units={units} error={error} />
      </form>
    </div>
  )
}

interface UnitElementsProps {
  units: UnitTypeExtended[]
  error: string | undefined
  onChange: (value: string, unitType: UnitType) => void
}
function UnitElements({ units, error, onChange }: UnitElementsProps): JSX.Element {
  return (
    <Fragment>
      <p data-testid="error" className="absolute mt-12 text-sm text-red-400">
        {error}
      </p>

      {units.map((unit) => {
        const { name, value } = unit
        return (
          <div key={name}>
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="rounded-sm bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    <label htmlFor={name} className="text-lg">
                      {name}
                    </label>
                  </th>

                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    <input
                      id={name}
                      placeholder={value ? value.toString() : '0'}
                      value={value}
                      type="string"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        onChange(event.target.value, name)
                      }}
                      className="w-72 rounded-sm border border-dashed border-black p-3 text-lg"
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

interface UnitTypeExtended {
  name: UnitType
  value: string
}
