import React from "react"
import Header from "../components/Header"
import MainMint from "../components/MainMint"
import Head from "next/head"

const Mint = () => {
  return (
    <div>
      <Head>
        <title>React dApp Dev Challenge</title>
        <meta name="React dApp Dev Challenge for Exactly Protocol" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <MainMint />
    </div>
  )
}

export default Mint
