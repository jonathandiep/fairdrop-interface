import Head from 'next/head'
import Link from 'next/link'
import { Box, Container, Button, Divider, Heading } from '@chakra-ui/react'

import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Fairdrop</title>
        <meta name="description" content="Create airdrops with distribtion to on-chain activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Container textAlign="center">
        <Heading as="h1" size="lg">
          Create an Airdrop Campaign
        </Heading>
        <Box mt={3}>
          <Link href="/create">
            <a>
              <Button colorScheme="green" mr={3}>
                Create
              </Button>
            </a>
          </Link>
          <Link href="/campaigns">
            <a>
              <Button colorScheme="blue">View</Button>
            </a>
          </Link>
        </Box>
        <Divider my={5} />
        <Heading as="h1" size="lg">
          Check Your Airdrops
        </Heading>
        <Link href="/claim">
          <a>
            <Button colorScheme="green" mt={3}>
              Claim
            </Button>
          </a>
        </Link>
      </Container>
    </div>
  )
}
