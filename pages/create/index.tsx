import { useMemo, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Container, Heading } from '@chakra-ui/react'

import { AddressesContext } from '../../contexts'
import Header from '../../components/Header'

const PreviewAudienceForm = dynamic(() => import('../../components/AirdropForm'), { ssr: false })

function Create() {
  const [addresses, setAddresses] = useState<any[]>([])

  const providerAddresses = useMemo(() => ({ addresses, setAddresses }), [addresses, setAddresses])

  return (
    <>
      <Head>
        <title>Create an Airdrop | Fairdrop</title>
        <meta name="description" content="Create airdrops with distribtion to on-chain activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <Heading as="h1" size="lg">
          Create an Airdrop
        </Heading>
        <AddressesContext.Provider value={providerAddresses}>
          {addresses.length === 0 ? <PreviewAudienceForm /> : <p>list addresses here</p>}
        </AddressesContext.Provider>
      </Container>
    </>
  )
}

export default Create
