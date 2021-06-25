import { ApolloClient, InMemoryCache } from '@apollo/client'

export const uniswapV3Client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-prod',
  cache: new InMemoryCache(),
})

export const uniswapV2Client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  cache: new InMemoryCache(),
})
