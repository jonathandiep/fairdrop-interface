import { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Formik, Form, Field } from 'formik'
import { Contract, utils } from 'ethers'
import { create } from 'ipfs-http-client'
import dayjs from 'dayjs'

import { validateAddress, validatePositiveNumber, validateString } from '../utils'
import { parseBalanceMap } from '../merkle/parse-balance-map'
import { AddressesContext } from '../contexts'
import Fairdrop from '../data/Fairdrop.sol/Fairdrop.json'

// import DatePicker from './DatePicker'

function CampaignForm() {
  const { library, account } = useWeb3React<Web3Provider>()
  const router = useRouter()

  const initValues = {
    // campaignName: '',
    // campaignDescription: '',
    // claimStartDate: undefined,
    // claimEndDate: undefined,
    tokenAddress: '',
    airdropAmount: 0,
  }

  const { addresses } = useContext(AddressesContext)

  const createCampaign = async (values: any, actions: any) => {
    console.log(values)

    // generate merkle root
    const addrLeaves = addresses.map((address) => {
      return {
        address,
        earnings: `${utils.parseEther(String(values.airdropAmount)).toString()}`,
        reasons: '',
      }
    })
    const merkle = parseBalanceMap(addrLeaves)
    console.log(merkle)

    if (library && account) {
      const signer = library.getSigner(account)
      const contract = new Contract(process.env.NEXT_PUBLIC_FAIRDROP_ADDRESS as string, Fairdrop.abi, signer)

      try {
        const client = create({ url: 'https://ipfs.infura.io:5001' })
        const { path } = await client.add(JSON.stringify(merkle))

        await contract.addAirdrop(values.tokenAddress, merkle.merkleRoot, path)
        const count = (await contract.count()).toString()

        // timeout required cause data might not be available
        setTimeout(() => {
          router.push(`/campaigns/${count}`)
        }, 10000)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <Box w="40%">
      <Heading as="h1" size="lg" mb={2}>
        Airdrop Details
      </Heading>
      <Formik initialValues={initValues} onSubmit={createCampaign}>
        {(props) => (
          <Form>
            {/* <Field name="campaignName" validate={(str: string) => validateString(str, 'Campaign Name')}>
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
            </Field> */}
            <Field name="tokenAddress" validate={validateAddress}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.tokenAddress && form.touched.tokenAddress}>
                  <FormLabel htmlFor="tokenAddress">
                    <Flex justifyContent="space-between">
                      <Box>
                        Token Address{' '}
                        <Tooltip hasArrow label="Use the ERC-20 address that you want to airdrop">
                          <InfoIcon mb={1} color="blue.400" />
                        </Tooltip>
                      </Box>
                      {/* <Text>asdf</Text> */}
                      <Link href="/token">
                        <a target="_blank">
                          <Text as="i" fontSize="sm" _hover={{ textDecoration: 'underline' }} color="blue.400">
                            Need to create a token?
                          </Text>
                        </a>
                      </Link>
                    </Flex>
                  </FormLabel>
                  <Input {...field} id="tokenAddress" placeholder="0x..." />
                  <FormErrorMessage>{form.errors.tokenAddress}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="airdropAmount" validate={(num: number) => validatePositiveNumber(num, 'Amount')}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.airdropAmount && form.touched.airdropAmount}>
                  <FormLabel htmlFor="airdropAmount">
                    Airdrop Amount{' '}
                    <Tooltip hasArrow label="The amount of tokens that each user can claim">
                      <InfoIcon mb={1} color="blue.400" />
                    </Tooltip>
                  </FormLabel>
                  <Input {...field} type="number" id="airdropAmount" />
                  <FormErrorMessage>{form.errors.airdropAmount}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            {/* <Field name="startDate">
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
            </Field> */}
            <Button
              colorScheme="purple"
              type="submit"
              isLoading={props.isSubmitting}
              isDisabled={!props.isValid}
              mt={3}
            >
              Create Airdrop Contract
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default CampaignForm
