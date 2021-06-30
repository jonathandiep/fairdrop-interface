import axios from 'axios'

import { MerkleProofData } from '../interfaces'

export async function getMerkleData(path: string): Promise<MerkleProofData> {
  const { data } = await axios.get(`https://ipfs.infura.io/ipfs/${path}`)
  return data
}
