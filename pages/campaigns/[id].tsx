import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Code, Container, Flex, Heading, Text, Spacer } from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import { BigNumber, Contract, utils } from 'ethers'

import { useFairdropContract } from '../../hooks/useFairdropContract'
import { useMerkleDistributorContract } from '../../hooks/useMerkleDistributorContract'
import { useERC20Contract } from '../../hooks/useERC20Contract'
import { etherscanUrl } from '../../utils'
import { getMerkleData } from '../../utils/ipfs'
import { MerkleProofData } from '../../interfaces'

import Header from '../../components/Header'
import AddressList from '../../components/AddressList'

interface CampaignProps {
  id: string
}

export default function Campaign({ id }: CampaignProps) {
  const fairdropContract = useFairdropContract()
  const [merkleDistributorContract, setMerkleDistributorContract] = useMerkleDistributorContract()
  const [erc20Contract, setERC20Contract] = useERC20Contract()
  const { account, chainId } = useWeb3React()

  const [merkleAddress, setMerkleAddress] = useState<string>()
  const [merkleData, setMerkleData] = useState<MerkleProofData>()
  const [merkleAddressBalance, setMerkleAddressBalance] = useState<string>()
  const [airdropTokenAddress, setAirdropTokenAddress] = useState<string>()
  const [airdropTokenInfo, setAirdropTokenInfo] = useState<{ name: string; symbol: string }>()
  const [proofData, setProofData] = useState<any>()
  const [claimAmount, setClaimAmount] = useState<string>()
  const [isClaimed, setIsClaimed] = useState<boolean>()
  const [addresses, setAddresses] = useState<string[]>([])

  // Get data from Fairdrop contract
  useEffect(() => {
    async function getMerkleContractDetails(contract: Contract, id: string) {
      try {
        const address = await contract.getAirdropAddress(id)
        const cid = await contract.getAirdropCID(id)

        setMerkleAddress(address)
        setMerkleDistributorContract(address)

        const data = await getMerkleData(cid)
        setMerkleData(data)
      } catch (err) {
        console.error(err)
      }
    }

    if (fairdropContract) {
      getMerkleContractDetails(fairdropContract, id)
    }
  }, [fairdropContract, id, setMerkleDistributorContract])

  // Get token address that will be airdropped
  useEffect(() => {
    async function getAirdropToken(contract: Contract) {
      try {
        const token = await contract.token()
        setAirdropTokenAddress(token)
        setERC20Contract(token)
      } catch (err) {
        console.error(err)
      }
    }

    if (merkleAddress && merkleDistributorContract) {
      getAirdropToken(merkleDistributorContract)
    }
  }, [merkleAddress, merkleDistributorContract, setERC20Contract])

  // Get the rest of token info
  useEffect(() => {
    async function getInfo(contract: Contract, address: string) {
      setMerkleAddressBalance((await contract.balanceOf(address)).toString())
      const name = await contract.name()
      const symbol = await contract.symbol()

      setAirdropTokenInfo({ name, symbol })
    }

    if (merkleAddress && erc20Contract) {
      getInfo(erc20Contract, merkleAddress)
    }
  }, [merkleAddress, erc20Contract])

  // Check if user qualifies for airdrop
  useEffect(() => {
    async function checkClaimed(contract: Contract, index: number) {
      const claimed = await contract.isClaimed(index)
      setIsClaimed(claimed)
    }

    if (account && merkleData && merkleDistributorContract) {
      const claim = merkleData.claims[account]
      if (claim) {
        checkClaimed(merkleDistributorContract, claim.index)
        setProofData(claim)
        setClaimAmount(BigNumber.from(claim.amount).toString())
      } else {
        console.log(`you don't qualify :(`)
        setClaimAmount(undefined)
      }
    }
  }, [account, merkleData, merkleDistributorContract])

  // Extract addresses from merkle data
  useEffect(() => {
    if (merkleData) {
      const airdroppedAddresses = Object.keys(merkleData.claims)
      setAddresses(airdroppedAddresses)
    }
  }, [merkleData])

  const ClaimInfo = () => (
    <Flex
      mb={10}
      mx={30}
      px={10}
      py={10}
      backgroundColor={isClaimed ? 'orange.100' : 'green.100'}
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
    >
      {isClaimed ? (
        <Text>You&apos;ve already claimed your tokens</Text>
      ) : (
        <>
          <Box>
            <Text>
              Congrats! You can claim <strong>{utils.formatEther(claimAmount as string)}</strong>{' '}
              {airdropTokenInfo?.symbol || 'tokens'} 🎉
            </Text>
            <Flex>
              <Spacer />
              <Button
                colorScheme="green"
                mt={3}
                onClick={async () => {
                  if (merkleDistributorContract && proofData) {
                    await merkleDistributorContract.claim(proofData.index, account, proofData.amount, proofData.proof)
                  }
                }}
              >
                Claim
              </Button>
              <Spacer />
            </Flex>
          </Box>
        </>
      )}
    </Flex>
  )

  return (
    <>
      <Head>
        <title>Campaign Dashboard | Fairdrop</title>
        <meta name="description" content="Campaign Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container maxW="container.xl">
        <Heading as="h1" size="lg">
          Campaign #{id}
        </Heading>
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Box mt={3}>
            {merkleAddress ? (
              <Text>
                Merkle Contract: <Code>{merkleAddress}</Code>{' '}
                <a href={etherscanUrl(chainId, 'address', merkleAddress)}>
                  <LinkIcon mb={1} color="blue.500" />
                </a>
              </Text>
            ) : null}
            {addresses ? <Text># of Addresses in Airdrop: {addresses.length}</Text> : null}
            <Box mt={3} mb={10}>
              <Heading as="h2" size="md">
                Airdropped Token Details
              </Heading>
              {airdropTokenAddress ? (
                <>
                  <Text>
                    Address: <Code>{airdropTokenAddress}</Code>{' '}
                    <a href={etherscanUrl(chainId, 'address', airdropTokenAddress)}>
                      <LinkIcon mb={1} color="blue.500" />
                    </a>
                  </Text>
                  {airdropTokenInfo ? (
                    <Text>
                      Token : {airdropTokenInfo.name} ({airdropTokenInfo.symbol})
                    </Text>
                  ) : null}
                  {merkleAddressBalance ? (
                    <Text>
                      Balance in Merkle Contract: {utils.formatEther(merkleAddressBalance)} {airdropTokenInfo?.symbol}
                    </Text>
                  ) : null}
                </>
              ) : null}
            </Box>
            {claimAmount ? <ClaimInfo /> : null}
          </Box>

          {addresses.length > 0 ? (
            <Box>
              <AddressList
                headers={['#', 'Address', 'Claimed']}
                addresses={addresses}
                merkleData={merkleData}
                merkleDistributorContract={merkleDistributorContract}
              />
            </Box>
          ) : null}
        </Flex>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context?.params?.id,
    },
  }
}
