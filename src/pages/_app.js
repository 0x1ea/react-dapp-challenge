import "../styles/App.css"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { WagmiConfig, chain, createClient, configureChains, defaultChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { infuraProvider } from "wagmi/providers/infura"

const { chains, provider } = configureChains(
  [chain.kovan],
  [infuraProvider({ infuraId: process.env.INFURA_KEY }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: "React Challenge",
  chains,
})

const client = createClient({
  provider,
  connectors,
  autoConnect: true,
})
function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
