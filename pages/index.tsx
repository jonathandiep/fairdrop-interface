import Head from 'next/head'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { Alert, AlertIcon, Box, Container, Button, Divider, Heading, Text } from '@chakra-ui/react'

import Header from '../components/Header'

export default function Home() {
  const { chainId } = useWeb3React()

  return (
    <Box>
      <Head>
        <title>Fairdrop</title>
        <meta name="description" content="Create airdrops with distribtion to on-chain activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Container textAlign="center">
        {chainId !== 4 ? (
          <Alert status="error" mb={3}>
            <AlertIcon />
            <Text>
              Please connect Metamask and use the <strong>Rinkeby</strong> network
            </Text>
          </Alert>
        ) : null}
        <Heading as="h1" size="lg">
          Create an Airdrop Campaign
        </Heading>
        <Box mt={3}>
          <Link href="/create">
            <a>
              <Button colorScheme="blue">Create</Button>
            </a>
          </Link>
        </Box>
        <Divider my={5} />
        <Heading as="h1" size="lg">
          Check Your Airdrops
        </Heading>
        <Link href="/campaigns">
          <a>
            <Button colorScheme="green" mt={3}>
              Claim
            </Button>
          </a>
        </Link>
      </Container>
    </Box>
  )
}
