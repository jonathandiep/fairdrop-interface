import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'

import Fairdrop from '../data/Fairdrop.sol/Fairdrop.json'

export function useFairdropContract() {
  const { account, library } = useWeb3React()

  const [contract, setContract] = useState<Contract>()

  useEffect(() => {
    if (account && library && !contract) {
      const signer = library.getSigner(account)
      setContract(new Contract(process.env.NEXT_PUBLIC_FAIRDROP_ADDRESS as string, Fairdrop.abi, signer))
    }
  }, [account, library, contract])

  return contract
}
