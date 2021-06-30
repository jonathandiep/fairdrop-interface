import { utils } from 'ethers'

export function validateString(str: string, errorName: string) {
  let error

  if (!str || str.length === 0) {
    error = `${errorName} required`
  }

  return error
}

export function validateAddress(address: string) {
  let error

  if (address === '') {
    error = 'Address required'
  } else if (!utils.isAddress(address)) {
    error = 'Invalid address'
  }

  return error
}

export function validatePositiveNumber(number: number, errorName: string) {
  let error

  if (!Number.isFinite(Number(number))) {
    error = `Valid ${errorName} required`
  } else if (number < 0) {
    error = `${errorName} must be greater than 0`
  }

  return error
}
