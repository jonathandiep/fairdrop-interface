import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { BigNumber, Contract } from 'ethers'

import { useFairdropContract } from '../../hooks/useFairdropContract'
import { useMerkleDistributorContract } from '../../hooks/useMerkleDistributorContract'
import { getMerkleData } from '../../utils/ipfs'
import { MerkleProofData } from '../../interfaces'

import Header from '../../components/Header'
interface CampaignProps {
  id: string
}

export default function Campaign({ id }: CampaignProps) {
  const fairdropContract = useFairdropContract()
  const [merkleDistributorContract, setMerkleDistributorContract] = useMerkleDistributorContract()
  const { account } = useWeb3React()

  const [merkleAddress, setMerkleAddress] = useState<string>()
  const [merkleData, setMerkleData] = useState<MerkleProofData>()
  const [airdroppedToken, setAirdroppedToken] = useState<string>()
  const [proofData, setProofData] = useState<any>()
  const [claimAmount, setClaimAmount] = useState<string>()
  const [isClaimed, setIsClaimed] = useState<boolean>()

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

  // Get token info that will be airdropped
  useEffect(() => {
    async function getAirdropToken(contract: Contract) {
      try {
        const token = await contract.token()
        setAirdroppedToken(token)
      } catch (err) {
        console.error(err)
      }
    }

    // TODO: display balance of airdropped token inside merkle contract

    if (merkleAddress && merkleDistributorContract) {
      getAirdropToken(merkleDistributorContract)
    }
  }, [merkleAddress, merkleDistributorContract])

  // Check if user qualifies for airdrop
  useEffect(() => {
    async function checkClaimed(contract: Contract, index: number) {
      const claimed = await contract.isClaimed(index)
      console.log(`claimed: ${claimed}`)
      setIsClaimed(claimed)
    }

    if (account && merkleData && merkleDistributorContract) {
      // Testing
      // const claim = merkleData.claims['0x0B1FDB90501286ebe6087b6660C3a48db9898FAD']
      const claim = merkleData.claims[account]
      if (claim) {
        checkClaimed(merkleDistributorContract, claim.index)
        setProofData(claim)
        setClaimAmount(BigNumber.from(claim.amount).toString())
      } else {
        console.log(`you don't qualify :(`)
      }
    }
  }, [account, merkleData, merkleDistributorContract])

  const ClaimInfo = () => (
    <Flex
      mt={10}
      mx={20}
      px={10}
      py={10}
      backgroundColor={isClaimed ? 'orange.100' : 'green.100'}
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      flexWrap="wrap"
    >
      {isClaimed ? (
        <Text>You&apos;ve already claimed your tokens</Text>
      ) : (
        <>
          <Box>
            <Text>Congrats! You can claim {claimAmount} tokens 🎉</Text>
          </Box>
          <br />
          <Box>
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
          </Box>
        </>
      )}
    </Flex>
  )

  return (
    <>
      <Head>
        <title>Campaign Dashboard | Fairdrop</title>
        <meta name="description" content={`Campaign Dashboard`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <Heading as="h1" size="lg">
          Campaign #{id}
        </Heading>
        <Text>merkle address: {merkleAddress}</Text>
        <Text>airdropped token: {airdroppedToken}</Text>
        {claimAmount ? <ClaimInfo /> : null}
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
