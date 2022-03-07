import { ChangeEvent, useState, Fragment } from 'react'

import { convertUnit, UnitType } from '../../lib/ethUnitConversion'

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
          <div className="flex flex-col gap-4 items-center">
            <p className="text-lg"> {name} </p>
            <input
              placeholder={value ? value.toString() : '0'}
              value={value}
              type="number"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.value, name)
              }}
              className="p-2 border border-dashed border-black"
            />
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
