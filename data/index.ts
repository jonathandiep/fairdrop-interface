import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client'
import dayjs from 'dayjs'

import { uniswapV3Client } from '../apollo/client'

const UNISWAP_V3_LP = gql`
  query UniswapV3LP($amountUSD: BigDecimal!, $startDate: BigInt!, $endDate: BigInt!, $lastId: ID!) {
    mints(
      first: 1000
      orderBy: id
      orderDirection: asc
      where: { amountUSD_gte: $amountUSD, timestamp_gte: $startDate, timestamp_lte: $endDate, id_gt: $lastId }
    ) {
      id
      origin
    }
  }
`

const UNISWAP_V2_LP = gql`
  query UniswapV2LP($amountUSD: BigDecimal!, $startDate: BigInt!, $endDate: BigInt!, $lastId: ID!) {
    mints(
      first: 1000
      orderBy: id
      orderDirection: asc
      where: { amountUSD_gte: $amountUSD, timestamp_gte: $startDate, timestamp_lte: $endDate, id_gt: $lastId }
    ) {
      id
      to
    }
  }
`

export async function getUniswapV3Pool(amountUSD: number = 0, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
  const startDateTimestamp = startDate.unix() || 1620181620
  const endDateTimestamp = endDate.unix() || dayjs().unix()
  return await splitQuery(UNISWAP_V3_LP, uniswapV3Client, {
    amountUSD,
    startDate: startDateTimestamp,
    endDate: endDateTimestamp,
  })
}

async function splitQuery(query: any, client: ApolloClient<NormalizedCacheObject>, variables: any, skipCount = 1000) {
  let addresses = []
  let lastId = '0x000000000000000000000000000000000'
  let allFound = false
  try {
    while (!allFound) {
      variables.lastId = lastId
      const result = await client.query({
        query,
        variables,
        fetchPolicy: 'network-only',
      })

      let addressesToConcat = result.data.mints
      addresses.push(...addressesToConcat)

      if (addressesToConcat.length < skipCount) {
        allFound = true
      } else {
        lastId = addressesToConcat[addressesToConcat.length - 1].id
      }
    }

    return addresses
  } catch (e) {
    console.error(e)
    return undefined
  }
}
