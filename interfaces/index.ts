export interface MerkleProofData {
  merkleRoot: string
  tokenTotal: string
  claims: {
    [key: string]: {
      amount: string
      index: number
      proof: string[]
    }
  }
}
