import { ChangeEvent, useState, Fragment } from 'react'

import { convertUnit, UnitType } from '../../lib/ethUnitConversion'

export default function TokenUnitConversion() {
  const [wei, setWei] = useState(0)
  const [gwei, setGwei] = useState(0)
  const [eth, setEth] = useState(0)

  function updateValue(result: any) {
    setWei(result.wei)
    setGwei(result.gwei)
    setEth(result.eth)
  }

  function resetValues() {
    setWei(0)
    setGwei(0)
    setEth(0)
  }

  function handleChangeEvent(value: string, unitType: UnitType) {
    const out = convertUnit(value, unitType)
    if (!out) {
      resetValues()
    } else {
      updateValue(out)
    }
  }

  interface UnitTypeExtended {
    name: UnitType
    value: number
  }

  const units: UnitTypeExtended[] = [
    { name: 'wei', value: wei },
    { name: 'gwei', value: gwei },
    { name: 'eth', value: eth },
  ]

  function UnitElements(): JSX.Element {
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
                  console.log(event.target.value)
                  handleChangeEvent(event.target.value, name)
                }}
                className="p-2 border border-dashed border-black"
              />
            </div>
          )
        })}
      </Fragment>
    )
  }

  return (
    <div className="flex ml-auto max-w-1/3 w-4/5 pl-24 mt-32">
      <form className="flex flex-col gap-10 mx-auto">
        <UnitElements />
      </form>
    </div>
  )
}
