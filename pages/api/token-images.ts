import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface Token {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.get('https://zapper.fi/api/token-list')
    const tokenImages: any = {}
    data.tokens.forEach((token: Token) => {
      tokenImages[token.address] = { logo: token.logoURI }
    })
    res.send(tokenImages)
  } catch (err) {
    res.status(500).json({ success: false, message: `Can't get images` })
  }
}
