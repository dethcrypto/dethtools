import { ChangeEvent, Fragment, useState } from 'react'

import { convertTokenUnits } from '../lib/convertUnits'

export default function TokenUnitConversion() {
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

    for (const unit of units) {
      out = convertTokenUnits(value, unitType, unit.name)

      if (out) {
        if (unit.name === 'unit') setUnit(out)
        if (unit.name === 'base') setBase(out)
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
  onChange: (value: string, unitType: TokenUnitType) => void
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

type TokenUnitType = 'base' | 'unit'

interface UnitTypeExtended {
  name: TokenUnitType
  value: string
}
