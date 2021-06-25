import type { MouseEvent } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Container, Button, Divider, Heading, Text } from '@chakra-ui/react'

import Header from '../components/Header'

export default function Home() {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, route: string) => {
    e.preventDefault()
    router.push(route)
  }

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
        <Text>TODO: Add info & graphics on this page</Text>
        <Box mt={3}>
          <Button colorScheme="green" mr={3} onClick={(e) => handleClick(e, '/create')}>
            Create
          </Button>
          <Button colorScheme="blue" onClick={(e) => handleClick(e, '/view')}>
            View
          </Button>
        </Box>
        <Divider my={5} />
        <Heading as="h1" size="lg">
          Check Your Airdrops
        </Heading>
        <Button colorScheme="green" mt={3} onClick={(e) => handleClick(e, '/claim')}>
          Claim
        </Button>
      </Container>
    </div>
  )
}
