import { useContext } from 'react'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import { AddressesContext } from '../contexts'
import { getUniswapV3Pool } from '../data'
import { validateString, validatePositiveNumber } from '../utils'
import DatePicker from './DatePicker'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

async function checkAudience(values: any, actions: any, setAddresses: any) {
  console.log(values)

  if (values.onChainActivity === 'uniswapv3') {
    // TODO: display error if no addresses
    const data = await getUniswapV3Pool(values.amountUSD, values.startDate, values.endDate)
    console.log(data)

    // get unique addresses
    const set = new Set()
    data?.forEach((mint) => set.add(mint.origin))
    setAddresses([...set])
  }
}

function AirdropForm() {
  const { setAddresses } = useContext(AddressesContext)
  const initValues = {
    onChainActivity: '',
    amountUSD: '',
    startDate: undefined,
    endDate: undefined,
  }

  return (
    <Formik initialValues={initValues} onSubmit={(c, v) => checkAudience(c, v, setAddresses)}>
      {(props) => (
        <Form>
          <Field name="onChainActivity" as="select" validate={(str: string) => validateString(str, 'Activity')}>
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.onChainActivity && form.touched.onChainActivity}>
                <FormLabel htmlFor="onChainActivity">On-Chain Activity</FormLabel>
                <Select
                  placeholder="Select activity"
                  onChange={(event) => form.setFieldValue('onChainActivity', event.target.value)}
                  maxWidth="xs"
                >
                  <option value="uniswapv3">Uniswap v3 LP</option>
                  <option value="uniswapv2" disabled>
                    Uniswap v2 LP
                  </option>
                  <option value="sushiSwap" disabled>
                    SushiSwap LP
                  </option>
                </Select>
                <FormErrorMessage>{form.errors.onChainActivity}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="amountUSD" validate={(num: number) => validatePositiveNumber(num, 'USD')}>
            {({ field, form }: any) => {
              return (
                <FormControl isInvalid={form.errors.amountUSD && form.touched.amountUSD} mt={3}>
                  <FormLabel htmlFor="amountUSD">Minimum Amount USD</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>$</InputLeftAddon>
                    <Input {...field} id="amountUSD" maxWidth="xs" placeholder="1000" />
                  </InputGroup>
                  <FormErrorMessage>{form.errors.amountUSD}</FormErrorMessage>
                </FormControl>
              )
            }}
          </Field>

          <Flex mt={2}>
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
          </Flex>

          <Button colorScheme="purple" type="submit" mt={4} isLoading={props.isSubmitting} isDisabled={!props.isValid}>
            See Audience
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default AirdropForm
