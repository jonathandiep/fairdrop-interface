import { useEffect, useState } from 'react'
import { Button, Divider, Flex, Heading, IconButton, Input, Spacer, useColorMode } from '@chakra-ui/react'
import { providers } from 'ethers'

function Header() {
  // const { colorMode, toggleColorMode } = useColorMode()
  const [network, setNetwork] = useState('')

  useEffect(() => {
    try {
      const provider = new providers.Web3Provider((window as any).ethereum)
      provider.on('network', (_network) => {
        if (_network.name === 'unknown') {
          setNetwork('local')
        } else if (_network.name === 'homestead') {
          setNetwork('mainnet')
        } else {
          setNetwork(_network.name)
        }
      })
    } catch (err) {
      console.error(err)
    }
  })

  return (
    <header>
      <Flex m={5} flexWrap="wrap">
        <Heading as="h1" size="lg">
          Fairdrop
        </Heading>
        <Spacer />
        {network ? (
          <Button colorScheme="blue" variant="outline">
            {network}
          </Button>
        ) : null}
      </Flex>
      <Divider mb={5} />
    </header>
  )
}

export default Header
