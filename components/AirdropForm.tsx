import { useContext } from 'react'
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import { AddressesContext } from '../contexts'
import { getUniswapV3Pool } from '../data'
import DatePicker from './DatePicker'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

function validateString(str: string, errorName: string) {
  let error

  if (!str || str.length === 0) {
    error = `${errorName} required`
  }

  return error
}

function validateAmountUSD(number: number) {
  let error

  if (!number) {
    error = 'Amount USD required or greater than 0'
  }

  return error
}

async function checkAudience(values: any, actions: any, setAddresses: any) {
  console.log(values)

  if (values.onChainActivity === 'uniswapv3') {
    const addresses = await getUniswapV3Pool(values.amountUSD, values.startDate, values.endDate)
    console.log(addresses)

    const addressesForExample = addresses?.map((address) => address.origin)
    console.log({ addresses: addressesForExample })

    setAddresses(addresses)
  }
}

function AirdropForm() {
  const { addresses, setAddresses } = useContext(AddressesContext)
  const initValues = {
    audienceName: '',
    // token: '',
    onChainActivity: '',
    amountUSD: 0,
    startDate: undefined,
    endDate: undefined,
  }

  return (
    <Formik initialValues={initValues} onSubmit={(c, v) => checkAudience(c, v, setAddresses)}>
      {(props) => (
        <Form>
          <Field name="audienceName" validate={(str: string) => validateString(str, 'Audience Name')}>
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.audienceName && form.touched.audienceName}>
                <FormLabel htmlFor="audienceName">Audience Name</FormLabel>
                <Input {...field} id="audienceName" />
                <FormErrorMessage>{form.errors.audienceName}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="onChainActivity" as="select" validate={(str: string) => validateString(str, 'Activity')}>
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.onChainActivity && form.touched.onChainActivity}>
                <FormLabel htmlFor="onChainActivity">On-Chain Activity</FormLabel>
                <Select
                  placeholder="Select activity"
                  onChange={(event) => form.setFieldValue('onChainActivity', event.target.value)}
                >
                  <option value="uniswapv3">Uniswap v3 LP</option>
                  <option value="uniswapv2">Uniswap v2 LP</option>
                  <option value="sushiSwap">SushiSwap LP</option>
                </Select>
                <FormErrorMessage>{form.errors.onChainActivity}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="amountUSD" validate={validateAmountUSD}>
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.amountUSD && form.touched.amountUSD}>
                <FormLabel htmlFor="amountUSD">Minimum Amount USD</FormLabel>
                <Input type="number" {...field} id="amountUSD" />
                <FormErrorMessage>{form.errors.amountUSD}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="startDate">
            {({ field, form }: any) => (
              <FormControl>
                <FormLabel htmlFor="startDate">Start Date</FormLabel>
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
                <FormLabel htmlFor="endDate">End Date</FormLabel>
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

          <Button colorScheme="purple" type="submit" isLoading={props.isSubmitting} isDisabled={!props.isValid}>
            See Audience
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default AirdropForm
