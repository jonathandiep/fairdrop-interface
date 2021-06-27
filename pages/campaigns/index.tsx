import Head from 'next/head'
import { Container } from '@chakra-ui/react'

import Header from '../../components/Header'

function Campaigns() {
  return (
    <>
      <Head>
        <title>View Airdrop Campaigns | Fairdrop</title>
        <meta name="description" content="Overview of Fairdrop campaigns" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <h1>view all campaigns here</h1>
      </Container>
    </>
  )
}

export default Campaigns
