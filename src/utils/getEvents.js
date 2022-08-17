import Web3 from "web3"
import { timeConverter } from "./timeConverter"

export async function getEvents(contractInterface, contractAddress, address) {
  const provider = `https://kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(contractInterface, contractAddress)
  let myEvents = []

  try {
    const events = await contract.getPastEvents("Mint", {
      fromBlock: 33000000,
      toBrom: "latest",
    })

    events.map(async (event) => {
      if (event.returnValues[0] === address) {
        const time = await web3.eth.getBlock(event.blockNumber)
        const formattedTime = timeConverter(time.timestamp)
        myEvents.push({
          id: event.id,
          returnValues: event.returnValues,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          timestamp: formattedTime,
        })
      }
    })
  } catch (error) {
    console.log(error)
  }

  myEvents = myEvents.reverse()
  return { myEvents }
}
