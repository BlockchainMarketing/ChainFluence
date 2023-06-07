import moment from 'moment'
import { BigNumber } from 'ethers'

/**
 * Constants & Helpers
 */
export const isEmpty = (value: string): string => {
  let error: string
  if (!value) {
    error = 'is required'
  }
  return error
}

export const isNumber = (value: string) => {
  let error: string
  if (!value) {
    error = 'is required'
  } else if (!value || !/^[0-9]*$/.test(value)) {
    error = 'must be a positive number'
  }
  return error
}

export const isPositiveNumber = (value: string) => {
  let error: string = isNumber(value)
  if (!error && Number(value) <= 0) {
    error = 'must be greater then zero'
  }
  return error
}

export const isFractionalNumber = (value: string) => {
  let error: string
  if (!value) {
    error = 'is required'
  } else if (!value || !/^(0|([1-9][0-9]*))(\.[0-9]{0,18})?$/.test(value)) {
    error = 'must be positive fractional number'
  }
  return error
}

/**
 * Constants & Helpers
 */
export const formatTime = (timestamp: BigNumber) =>
  moment.unix(timestamp.toNumber()).fromNow()
