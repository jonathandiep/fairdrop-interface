import { useMemo, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Button, Box, Container, Flex, Heading, Input, Text } from '@chakra-ui/react'
import { utils } from 'ethers'

import { AddressesContext } from '../../contexts'

import AddressList from '../../components/AddressList'
import CampaignForm from '../../components/CampaignForm'
import Header from '../../components/Header'

const PreviewAudienceForm = dynamic(() => import('../../components/AirdropForm'), { ssr: false })

function Create() {
  const [addresses, setAddresses] = useState<string[]>([])
  const [injectAddr, setInjectAddr] = useState<string>() // used for dev envs
  const providerAddresses = useMemo(() => ({ addresses, setAddresses }), [addresses, setAddresses])

  const AudienceTable = () => (
    <Box>
      <Heading as="h1" size="lg" my={2}>
        Audience
      </Heading>
      <Text mb={2}>
        <strong>Unique Addresses:</strong> {addresses.length}
      </Text>
      <AddressList headers={['#', 'Address']} addresses={addresses} />
      {process.env.NODE_ENV === 'development' ? (
        <Box mx={10} mb={10} p={10} w="60%" border="1px" borderColor="red.100" color="red">
          <Heading size="md">Developer&apos;s Backdoor</Heading>
          <Text fontSize="sm">Inject address into Audience. Allows address to be a part of the merkle tree</Text>
          <Text fontSize="sm">This tool is only used in dev environments</Text>
          <Input placeholder="0x..." size="sm" onChange={(e) => setInjectAddr(e.target.value)} />
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => {
              console.log(injectAddr)
              if (injectAddr && utils.isAddress(injectAddr) && !addresses.includes(injectAddr)) {
                const newAddresses = addresses.concat(injectAddr)
                setAddresses(newAddresses)
              }
            }}
          >
            Inject
          </Button>
        </Box>
      ) : null}
    </Box>
  )

  return (
    <>
      <Head>
        <title>Create an Airdrop | Fairdrop</title>
        <meta name="description" content="Create airdrops with distribtion to on-chain activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container maxW={addresses.length === 0 ? 'container.sm' : 'container.xl'}>
        {addresses.length > 0 ? (
          <Button colorScheme="purple" variant="outline" size="sm" mb={3} onClick={() => setAddresses([])}>
            Back
          </Button>
        ) : (
          <Heading as="h1" size="lg" mb={3}>
            Select your audience
          </Heading>
        )}
        <AddressesContext.Provider value={providerAddresses}>
          {addresses.length === 0 ? (
            <PreviewAudienceForm />
          ) : (
            <Flex justifyContent="space-between" flexWrap="wrap">
              <AudienceTable />
              <CampaignForm />
            </Flex>
          )}
        </AddressesContext.Provider>
      </Container>
    </>
  )
}

export default Create
