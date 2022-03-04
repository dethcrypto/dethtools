import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import { handleValueChange, UnitType } from '../../lib/ethUnitConversion'

const EthUnitConversion: NextPage = () => {
  const [wei, setWei] = useState<string>()
  const [gwei, setGwei] = useState<string>()
  const [eth, setEth] = useState<string>()

  const handleChangeGwei = (event: ChangeEvent<HTMLInputElement>) => setGwei(event.target.value)
  const handleChangeEth = (event: ChangeEvent<HTMLInputElement>) => setEth(event.target.value)

  return (
    <div className="flex ml-auto max-w-1/3 w-4/5 pl-24 mt-32">
      <form className="flex flex-col gap-10 mx-auto">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-xl"> wei </p>
          <input
            placeholder={wei}
            type="number"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleValueChange({ value: event.target.value, type: UnitType.WEI })
            }
            className="p-2 border border-dashed border-black"
          />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-xl"> gwei </p>
          <input
            placeholder={wei}
            type="number"
            onChange={(v: ChangeEvent<HTMLInputElement>) => handleChangeGwei(v)}
            className="p-2 border border-dashed border-black"
          />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-2xl"> ether </p>
          <input
            placeholder={wei}
            type="number"
            onChange={(v: ChangeEvent<HTMLInputElement>) => handleChangeEth(v)}
            className="p-2 border border-dashed border-black"
          />
        </div>
      </form>
    </div>
  )
}

export default EthUnitConversion
