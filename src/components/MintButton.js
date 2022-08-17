import { useEffect } from "react"
import contracts from "../constants/contracts.json"
import { useContractWrite } from "wagmi"
import { useWaitForTransaction } from "wagmi"
import { useAccount } from "wagmi"
import { useContractRead } from "wagmi"

const MintButton = ({ mintAmount }) => {
  const { address } = useAccount()

  const cDAI = useContractWrite({
    addressOrName: contracts.cDAI.address,
    contractInterface: contracts.cDAI.abi,
    functionName: "mint",
    args: [mintAmount],
  })

  const DAI = useContractWrite({
    addressOrName: contracts.DAI.address,
    contractInterface: contracts.DAI.abi,
    functionName: "approve",
    args: [contracts.cDAI.address, mintAmount],
  })

  const waitDAI = useWaitForTransaction({
    hash: DAI.data?.hash,
  })

  const waitCDAI = useWaitForTransaction({
    hash: cDAI.data?.hash,
  })

  const allowance = useContractRead({
    addressOrName: contracts.DAI.address,
    contractInterface: contracts.DAI.abi,
    functionName: "allowance",
    args: [address, contracts.cDAI.address],
  })

  useEffect(() => {
    allowance.refetch()
  }, [allowance])

  console.log("algo2")
  return (
    <>
      <div
        className="flex z-10 rounded-lg bg-blue-500 cursor-pointer font-sans text-lg justify-center place-items-center shadow-md hover:scale-x-105 font-bold mx-auto h-16 mt-6"
        id="mint_button"
        onClick={() => {
          try {
            if (allowance.data.gte(mintAmount)) {
              cDAI.writeAsync()
            } else {
              DAI.writeAsync()
            }
          } catch (e) {
            console.log(e)
          }
        }}
      >
        {DAI.status === "idle" && allowance?.data?.lt(mintAmount) && "Approve DAI"}

        {DAI.status === "loading" && allowance?.data?.lt(mintAmount) && "Wating approval..."}
        {DAI.status === "error" && allowance?.data?.lt(mintAmount) && "Something went wrong..."}
        {waitDAI.status === "loading" &&
          allowance?.data?.lt(mintAmount) &&
          "Waiting confirmation..."}
        {waitDAI.status === "success" && allowance?.data?.lt(mintAmount) && "Successful deposit!"}

        {cDAI.status === "idle" && allowance?.data?.gte(mintAmount) && "Deposit DAI"}
        {cDAI.status === "loading" && allowance?.data?.gte(mintAmount) && "Wating approval..."}
        {cDAI.status === "error" && allowance?.data?.gte(mintAmount) && "Something went wrong..."}
        {waitCDAI.status === "loading" &&
          allowance?.data?.gte(mintAmount) &&
          "Waiting confirmation..."}
        {waitCDAI.status === "success" &&
          allowance?.data?.gte(mintAmount) &&
          "Successful deposit!"}
      </div>
    </>
  )
}

export default MintButton
