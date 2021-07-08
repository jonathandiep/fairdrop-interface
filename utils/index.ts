export * from './formValidation'

export function translateChainId(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 3:
      return 'ropsten'
    case 4:
      return 'rinkeby'
    case 42:
      return 'kovan'
    case 420:
      return 'goerli'
    case 1337:
      return 'localhost'
    default:
      return ''
  }
}

export function etherscanUrl(chainId: number = 0, type: 'address' | 'token', path: string): string {
  let domain = 'https://'

  switch (chainId) {
    case 1:
      domain += 'etherscan.io'
      break
    case 3:
      domain += 'ropsten.etherscan.io'
      break
    case 4:
      domain += 'rinkeby.etherscan.io'
      break
    case 42:
      domain += 'kovan.etherscan.io'
      break
    case 420:
      domain += 'goerli.etherscan.io'
      break
    default:
      return ''
  }

  return `${domain}/${type}/${path}`
}
