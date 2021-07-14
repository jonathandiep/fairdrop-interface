import Head from 'next/head'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { Alert, AlertIcon, Box, Container, Button, Divider, Flex, Text } from '@chakra-ui/react'

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
      <Container>
        {chainId !== 4 && process.env.NODE_ENV !== 'development' ? (
          <Alert status="error" mb={3}>
            <AlertIcon />
            <Text>
              Please connect Metamask and use the <strong>Rinkeby</strong> network
            </Text>
          </Alert>
        ) : null}
        <Text fontSize="6xl">
          <strong>Airdrops for All</strong>
        </Text>
        <Text fontSize="3xl" as="i">
          Create free and fair airdrops which can be distributed based on on-chain activity 🚀
        </Text>

        <Divider my={10} />

        <Text fontSize="2xl" mb={2}>
          <strong>Want to get started? It&apos;s as simple as:</strong>
        </Text>
        <Text fontSize="xl" mb={2}>
          <strong>1.</strong> Querying addresses using predefined strategies 🔍
        </Text>
        <Text fontSize="xl" mb={2}>
          <strong>2.</strong> Sending any ERC-20 token to the merkle (airdrop) contract ⬆️
        </Text>
        <Text fontSize="xl">
          <strong>3.</strong> Qualified particiants can claim their airdropped tokens 🤑
        </Text>

        <Divider my={10} />

        <Text fontSize="lg" as="i">
          Our interface makes it easy to deploy airdrops on Ethereum without having to deal with the complexities of
          prepping for an airdrop
        </Text>

        <Flex justifyContent="space-between" alignItems="center" mt={5} mx={8}>
          <Link href="/create">
            <a>
              <Button colorScheme="blue">Create an Airdrop</Button>
            </a>
          </Link>
          <Link href="/campaigns">
            <a>
              <Button colorScheme="green">Check Qualifying Airdrops</Button>
            </a>
          </Link>
        </Flex>
      </Container>
    </Box>
  )
}
