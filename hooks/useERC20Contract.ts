import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'

import ERC20 from '../data/ERC20.sol/ERC20.json'

export function useERC20Contract(): [Contract | undefined, Dispatch<SetStateAction<string | undefined>>] {
  const { account, library } = useWeb3React()

  const [contract, setContract] = useState<Contract>()
  const [address, setAddress] = useState<string>()

  useEffect(() => {
    if (account && library && !contract && address) {
      const signer = library.getSigner(account)
      setContract(new Contract(address, ERC20.abi, signer))
    }
  }, [account, library, contract, address])

  return [contract, setAddress]
}
