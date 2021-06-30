import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'

import MerkleDistributor from '../data/MerkleDistributor.sol/MerkleDistributor.json'

export function useMerkleDistributorContract(): [Contract | undefined, Dispatch<SetStateAction<string | undefined>>] {
  const { account, library } = useWeb3React()

  const [prevAccount, setPrevAccount] = useState<string>()
  const [contract, setContract] = useState<Contract>()
  const [address, setAddress] = useState<string>()

  useEffect(() => {
    if (account && library && (!contract || account !== prevAccount) && address) {
      const signer = library.getSigner(account)
      setPrevAccount(account)
      setContract(new Contract(address, MerkleDistributor.abi, signer))
    }
  }, [account, library, contract, address, prevAccount])

  return [contract, setAddress]
}
