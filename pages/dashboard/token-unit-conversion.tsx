import type { NextPage } from 'next'

const TokenUnitConversion: NextPage = () => {
  return (
    <div className="flex ml-auto max-w-1/3 w-4/5 pl-24 mt-32">
      <form className="flex flex-col gap-10 mx-auto">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-xl"> wei </p>
          <input className="p-2 border border-dashed border-black" />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-xl"> gwei </p>
          <input className="p-2 border border-dashed border-black" />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-2xl"> ether </p>
          <input className="p-2 border border-dashed border-black" />
        </div>
      </form>
    </div>
  )
}

export default TokenUnitConversion
