import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Badge, Tr, Td, Box, Flex } from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons'
import { Contract } from 'ethers'

import { useERC20Contract } from '../hooks/useERC20Contract'
import { useMerkleDistributorContract } from '../hooks/useMerkleDistributorContract'
import { getMerkleData } from '../utils/ipfs'
import { MerkleProofData } from '../interfaces'

interface AirdropRowProps {
  id: number
  address: string
  cid: string
  // logo: string
  images: {
    [key: string]: {
      logo: string
    }
  }
}

export default function AirdropRow({ address, cid, id, images }: AirdropRowProps) {
  const router = useRouter()
  const { account } = useWeb3React()
  const [erc20Contract, setERC20Contract] = useERC20Contract()
  const [merkleDistributorContract, setMerkleDistributorContract] = useMerkleDistributorContract()

  const [merkleData, setMerkleData] = useState<MerkleProofData>()
  const [status, setStatus] = useState<'Qualified' | 'Not Qualified' | 'Claimed'>()
  const [tokenSymbol, setTokenSymbol] = useState<string>()
  const [tokenAddress, setTokenAddress] = useState<string>()
  const [tokenImage, setTokenImage] = useState<string>()

  // TODO: common hooks can be exported up /fairdrop-interface/pages/campaigns/[id].tsx

  useEffect(() => {
    if ((id || id === 0) && address && setMerkleDistributorContract) {
      setMerkleDistributorContract(address)
    }
  }, [id, address, setMerkleDistributorContract])

  useEffect(() => {
    async function getMerkle() {
      try {
        const { claims } = await getMerkleData(cid)
        if (claims[account as string]) {
          const claimed = await (merkleDistributorContract as Contract).isClaimed(claims[account as string].index)
          claimed ? setStatus('Claimed') : setStatus('Qualified')
        } else {
          setStatus('Not Qualified')
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (cid && account && merkleDistributorContract) {
      getMerkle()
    }
  }, [cid, account, merkleDistributorContract])

  useEffect(() => {
    async function getToken(contract: Contract) {
      const tokenAddress = await contract.token()
      setTokenAddress(tokenAddress)
      setERC20Contract(tokenAddress)

      if (images[tokenAddress.toLowerCase()]) {
        setTokenImage(images[tokenAddress.toLowerCase()].logo)
      }
    }

    if (merkleDistributorContract) {
      // console.log(merkleDistributorContract)
      getToken(merkleDistributorContract)
    }
  }, [images, merkleDistributorContract, setERC20Contract])

  useEffect(() => {
    async function getTokenSymbol(contract: Contract) {
      const symbol = await contract.symbol()
      setTokenSymbol(symbol)
    }

    if (erc20Contract) {
      getTokenSymbol(erc20Contract)
    }
  }, [erc20Contract])

  return (
    <Tr onClick={() => router.push(`/campaigns/${id}`)} _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}>
      <Td>{id}</Td>
      <Td>
        <Badge colorScheme={status === 'Not Qualified' ? 'gray' : status === 'Claimed' ? 'purple' : 'green'}>
          {status}
        </Badge>
      </Td>
      <Td>
        <Flex alignItems="center">
          {tokenImage ? (
            <Image src={tokenImage} alt="logo" height={25} width={25} />
          ) : (
            <QuestionIcon color="gray" mr={1} />
          )}{' '}
          {tokenSymbol}
        </Flex>
      </Td>
    </Tr>
  )
}
