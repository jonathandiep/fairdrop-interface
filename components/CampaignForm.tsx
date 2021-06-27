import { useContext } from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Textarea } from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import { ContractFactory } from 'ethers'
import dayjs from 'dayjs'

import { validateAddress, validatePositiveNumber, validateString } from '../utils'
import { parseBalanceMap } from '../merkle/parse-balance-map'
import { AddressesContext } from '../contexts'

import DatePicker from './DatePicker'

function CampaignForm() {
  const initValues = {
    campaignName: '',
    campaignDescription: '',
    claimStartDate: undefined,
    claimEndDate: undefined,
    tokenAddress: '',
    airdropAmount: 0,
  }

  const { addresses } = useContext(AddressesContext)

  const createCampaign = (values: any, actions: any) => {
    console.log(values)

    // generate merkle root
    const addrLeaves = addresses.map((address) => {
      return {
        address,
        earnings: `${values.airdropAmount}`,
        reasons: '',
      }
    })
    const merkle = parseBalanceMap(addrLeaves)
    console.log(merkle)
  }

  return (
    <Box w="40%">
      <Heading as="h1" size="lg">
        Campaign Details
      </Heading>
      <Formik initialValues={initValues} onSubmit={createCampaign}>
        {(props) => (
          <Form>
            <Field name="campaignName" validate={(str: string) => validateString(str, 'Campaign Name')}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.campaignName && form.touched.campaignName}>
                  <FormLabel htmlFor="campaignName">Campaign Name</FormLabel>
                  <Input {...field} id="campaignName" />
                  <FormErrorMessage>{form.errors.campaignName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="campaignDescription">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.campaignDescription && form.touched.campaignDescription}>
                  <FormLabel htmlFor="campaignDescription">Campaign Description</FormLabel>
                  <Textarea {...field} id="campaignDescription" />
                  <FormErrorMessage>{form.errors.campaignDescription}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="tokenAddress" validate={validateAddress}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.tokenAddress && form.touched.tokenAddress}>
                  <FormLabel htmlFor="tokenAddress">Token Address</FormLabel>
                  <Input {...field} id="tokenAddress" placeholder="0x..." />
                  <FormErrorMessage>{form.errors.tokenAddress}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="airdropAmount" validate={(num: number) => validatePositiveNumber(num, 'Amount')}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.airdropAmount && form.touched.airdropAmount}>
                  <FormLabel htmlFor="airdropAmount">Airdrop Amount</FormLabel>
                  <Input {...field} type="number" id="airdropAmount" />
                  <FormErrorMessage>{form.errors.airdropAmount}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="startDate">
              {({ field, form }: any) => (
                <FormControl>
                  <FormLabel htmlFor="startDate">Claim Start Date</FormLabel>
                  <DatePicker
                    onChange={(date) =>
                      form.setFieldValue(
                        'startDate',
                        date
                          ? dayjs(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 'YYYY-M-D')
                          : undefined
                      )
                    }
                    selectedDate={field.value ? dayjs(field.value).toDate() : undefined}
                    isClearable
                    showPopperArrow
                  />
                </FormControl>
              )}
            </Field>
            <Field name="endDate">
              {({ field, form }: any) => (
                <FormControl>
                  <FormLabel htmlFor="endDate">Claim End Date</FormLabel>
                  <DatePicker
                    onChange={(date) => {
                      form.setFieldValue(
                        'endDate',
                        date
                          ? dayjs(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 'YYYY-M-D')
                          : undefined
                      )
                    }}
                    selectedDate={field.value ? dayjs(field.value).toDate() : undefined}
                    isClearable
                    showPopperArrow
                  />
                </FormControl>
              )}
            </Field>
            <Button colorScheme="purple" type="submit" isDisabled={!props.isValid} mt={3}>
              Create Airdrop Contract
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default CampaignForm
