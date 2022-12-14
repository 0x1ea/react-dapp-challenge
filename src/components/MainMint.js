import { ethers } from "ethers"
import { useState, useMemo, useEffect } from "react"
import { useAccount, useNetwork, useContractRead } from "wagmi"
import { getEvents } from "../utils/getEvents"
import contracts from "../constants/contracts.json"
import MintButton from "../components/MintButton"

const MainMint = () => {
  const [showButton, setShowButton] = useState(false)
  const [mintAmount, setMintAmount] = useState()
  const [txExecuted, setTxExecuted] = useState(false)
  const [events, setEvents] = useState()
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()

  const cDAI = useContractRead({
    addressOrName: contracts.cDAI.address,
    contractInterface: contracts.cDAI.abi,
    functionName: "balanceOf",
    args: address,
  })

  const DAI = useContractRead({
    addressOrName: contracts.DAI.address,
    contractInterface: contracts.DAI.abi,
    functionName: "balanceOf",
    args: address,
  })

  const memoizedValue = useMemo(
    () => getEvents(contracts.cDAI.abi, contracts.cDAI.address, address),
    [address]
  )

  useEffect(() => {
    if (chain?.id === 42 && isConnected) {
      setShowButton(true)
    }
    memoizedValue.then((res) => {
      setEvents(res.myEvents)
    })

    cDAI.refetch()
    DAI.refetch()
  }, [chain, isConnected, events, mintAmount, txExecuted])

  return (
    <div className="bg-zinc-900  max-w-screen-sm mx-auto rounded-xl">
      <div className="px-4 h-auto">
        <h1 className="font-sans font-semibold text-3xl mt-32 text-start pb-2 py-2">
          Compound&apos;s cDAI
        </h1>
      </div>
      <div className="p-4">
        {showButton ? (
          <div className="">
            <h2 className="text-xl font-light">
              cDAI balance: <span> {ethers.utils.formatEther(cDAI.data || 0)}</span>
            </h2>

            <div className="flex flex-row">
              <h1 className="text-xl my-auto font-light">
                DAI balance: {ethers.utils.formatEther(DAI.data || 0)}
              </h1>
              <div className="ml-auto"></div>
            </div>
            <p className="mt-4">Amount to deposit:</p>
            <input
              className="text-white bg-slate-800 w-48 text-2xl my-1 rounded-md text-right py-1 px-2"
              placeholder="0.0"
              value={mintAmount}
              onChange={(event) => {
                setMintAmount(event.target.value)
              }}
            />
            {mintAmount > 0 ? (
              <MintButton
                mintAmount={ethers.utils.parseEther(mintAmount.toString())}
                setTxExecuted={setTxExecuted}
              />
            ) : (
              <button className="bg-[#ff494a] flex z-10 rounded-lg cursor-pointer font-sans text-lg justify-center place-items-center shadow-md hover:scale-x-105 font-bold h-16 mt-6 px-4 md:my-full">
                Type some DAI to Deposit
              </button>
            )}
          </div>
        ) : (
          <button className="bg-[#ff494a] flex z-10 rounded-lg cursor-pointer font-sans text-lg justify-center place-items-center shadow-md hover:scale-x-105 font-bold h-16 mt-6 px-4 md:my-full">
            Connect to Kovan network
          </button>
        )}
      </div>
      <p className="font-sans text-base pb-4 md:col-start-2 p-4 my-auto">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia erat tortor, eget
        auctor libero bibendum sit amet. Mauris ut eleifend sapien.
      </p>
      <div className="text-white p-4 font-sans border-t-2 border-neutral-800 md:col-start-2 pb-4">
        <div className="p-4  mx-auto">
          <h1 className="text-lg mb-3 font-semibold">Transaction History:</h1>

          {!!events
            ? events?.map((event) => (
                <div key={event.id} className="text-white text-sm my-4">
                  <h1 className="text-base">Deposit:</h1>
                  <p>
                    Hash:{" "}
                    <a
                      href={`https://kovan.etherscan.io/tx/${event.transactionHash}`}
                      rel="noreferrer"
                      target="_blank"
                      className="font-semibold inline"
                    >
                      {` ${event.transactionHash.slice(0, 6)}...${event.transactionHash.slice(
                        -4
                      )}`}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mx-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </p>
                  <p>Date: {event.timestamp}</p>
                  <p>DAI deposited: {ethers.utils.formatEther(event.returnValues[1])}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  )
}

export default MainMint
