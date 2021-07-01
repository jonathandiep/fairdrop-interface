import { useEffect, useState } from 'react'
import { CheckIcon, MinusIcon } from '@chakra-ui/icons'
import { Contract } from 'ethers'

import { MerkleProofData } from '../interfaces'

interface ClaimedIconProps {
  address: string
  merkleData?: MerkleProofData
  merkleDistributorContract?: Contract
}

export default function ClaimedIcon({ address, merkleData, merkleDistributorContract }: ClaimedIconProps) {
  const [icon, setIcon] = useState<'check' | 'minus'>()

  useEffect(() => {
    async function checkClaim(contract: Contract, merkleData: MerkleProofData) {
      const claim = merkleData.claims[address]
      const claimed = await contract.isClaimed(claim.index)
      setIcon(claimed ? 'check' : 'minus')
    }

    if (address && merkleData && merkleDistributorContract) {
      checkClaim(merkleDistributorContract, merkleData)
    }
  }, [address, merkleData, merkleDistributorContract])

  if (icon === undefined) {
    return null
  }

  return icon === 'check' ? <CheckIcon color="green" ml={1} /> : <MinusIcon ml={1} />
}
