import Head from 'next/head'
import { useEffect, useState } from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Input,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { ContractFactory, utils } from 'ethers'

import { etherscanUrl } from '../../utils'
import ERC20 from '../../data/TestERC20.sol/TestERC20.json'

import Header from '../../components/Header'

export default function Token() {
  const { account, library, chainId } = useWeb3React()

  const [erc20ContractFactory, setERC20ContractFactory] = useState<ContractFactory>()
  const [tokenName, setTokenName] = useState<string>()
  const [tokenSymbol, setTokenSymbol] = useState<string>()
  const [supply, setSupply] = useState<number>()
  const [erc20Address, setERC20Address] = useState<string>()

  useEffect(() => {
    if (account && library) {
      const signer = library.getSigner(account)
      setERC20ContractFactory(new ContractFactory(ERC20.abi, ERC20.bytecode, signer))
    }
  }, [account, library])

  async function createToken(contractFactory: ContractFactory) {
    const erc20 = await contractFactory.deploy(tokenName, tokenSymbol, utils.parseEther(String(supply)))
    await erc20.deployed()

    console.log(`ERC20 token deployed to ${erc20.address}`)
    setERC20Address(erc20.address)
  }

  return (
    <Box>
      <Head>
        <title>Create an ERC-20 Token | Fairdrop</title>
        <meta name="description" content="Create an ERC-20 token on Fairdrop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Container>
        <Heading mb={1}>Create an ERC-20 Token</Heading>
        <Badge colorScheme="yellow" mb={2}>
          Beta
        </Badge>
        <Box>
          <Input onChange={(e) => setTokenName(e.target.value)} placeholder="Token Name" maxW="sm" mb={2} />
          <Input onChange={(e) => setTokenSymbol(e.target.value)} placeholder="Token Symbol" maxW="sm" mb={2} />
          <Input
            type="number"
            onChange={(e) => setSupply(Number(e.target.value))}
            placeholder="Supply"
            maxW="sm"
            mb={2}
          />
        </Box>
        <Button
          colorScheme="green"
          onClick={() =>
            tokenName && tokenSymbol && Number.isFinite(supply) && erc20ContractFactory
              ? createToken(erc20ContractFactory)
              : null
          }
        >
          Create Token
        </Button>

        {erc20Address ? (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>ERC-20 Token successfully deployed!</AlertTitle>
            <AlertDescription>
              <a href={etherscanUrl(chainId, 'token', erc20Address)}>View token on Etherscan</a>
            </AlertDescription>
          </Alert>
        ) : null}
      </Container>
    </Box>
  )
}
