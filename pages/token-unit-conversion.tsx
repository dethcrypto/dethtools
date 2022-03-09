import { ChangeEvent, Fragment, useState } from 'react'

import { convertUnit, UnitType } from '../lib/ethUnitConversion'

export default function EthUnitConversion() {
  const [wei, setWei] = useState('0')
  const [gwei, setGwei] = useState('0')
  const [eth, setEth] = useState('0')

  function resetValues() {
    setWei('0')
    setGwei('0')
    setEth('0')
  }

  const units: UnitTypeExtended[] = [
    { name: 'wei', value: wei },
    { name: 'gwei', value: gwei },
    { name: 'eth', value: eth },
  ]

  function handleChangeEvent(value: string, unitType: UnitType) {
    let out

    for (const unit of units) {
      out = convertUnit(value, unitType, unit.name)

      if (out) {
        if (unit.name === 'eth') setEth(out)
        if (unit.name === 'gwei') setGwei(out)
        if (unit.name === 'wei') setWei(out)
      }
    }

    if (!out) {
      resetValues()
    }
  }

  return (
    <div className="flex ml-auto max-w-1/3 w-4/5 pl-24 mt-32">
      <form className="flex flex-col gap-10 mx-auto">
        <h1> Token unit conversion </h1>
        <UnitElements onChange={handleChangeEvent} units={units} />
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
          <div>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 rounded-sm">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    <p className="text-lg"> {name} </p>
                  </th>

                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    <input
                      placeholder={value ? value.toString() : '0'}
                      value={value}
                      type="number"
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

interface UnitTypeExtended {
  name: UnitType
  value: string
}
