import { ChangeEvent, Fragment, useState } from 'react'

import { UnitType } from '../lib/convertProperties'
import { convertEthUnits } from '../lib/convertUnits'
import { decodeHex } from '../lib/decodeHex'

export default function EthUnitConversion() {
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
    <div className="flex ml-auto max-w-1/3 w-4/5 pl-24 mt-32">
      <form className="flex flex-col gap-10 mx-auto">
        <h1> Ethereum unit conversion </h1>
        <UnitElements onChange={handleChangeValue} units={units} />
      </form>
    </div>
  )
}

interface UnitElementsProps {
  units: UnitTypeExtended[]
  onChange: (value: string, unitType: UnitType) => void
}
function UnitElements({ units, onChange }: UnitElementsProps): JSX.Element {
  return (
    <Fragment>
      {units.map((unit) => {
        const { name, value } = unit
        return (
          <div key={name}>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 rounded-sm">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    <label htmlFor={name} className="text-lg">
                      {name}
                    </label>
                  </th>

                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    <input
                      id={name}
                      placeholder={value ? value.toString() : '0'}
                      value={value}
                      type="string"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        onChange(event.target.value, name)
                      }}
                      className="text-lg p-3 w-72 border border-dashed border-black rounded-sm"
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
