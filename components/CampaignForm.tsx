import { useContext } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Textarea } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Formik, Form, Field } from 'formik'
import { ContractFactory } from 'ethers'
import { create } from 'ipfs-http-client'
import dayjs from 'dayjs'

import { validateAddress, validatePositiveNumber, validateString } from '../utils'
import { parseBalanceMap } from '../merkle/parse-balance-map'
import { AddressesContext } from '../contexts'
import MerkleDistributor from '../data/MerkleDistibutor.sol/MerkleDistributor.json'

import DatePicker from './DatePicker'

function CampaignForm() {
  const { library, account } = useWeb3React<Web3Provider>()
  const router = useRouter()

  const initValues = {
    campaignName: '',
    campaignDescription: '',
    claimStartDate: undefined,
    claimEndDate: undefined,
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
        earnings: `${values.airdropAmount}`,
        reasons: '',
      }
    })
    const merkle = parseBalanceMap(addrLeaves)
    console.log(merkle)

    if (library && account) {
      const signer = library.getSigner(account)
      const factory = new ContractFactory(MerkleDistributor.abi, MerkleDistributor.bytecode, signer)
      let ipfsPath

      try {
        const client = create({ url: 'https://ipfs.infura.io:5001' })
        const { path } = await client.add(JSON.stringify(merkle))
        ipfsPath = path
      } catch (err) {
        console.error(err)
      }

      try {
        const contract = await factory.deploy(values.tokenAddress, merkle.merkleRoot)
        await contract.deployTransaction.wait()
        router.push(`/campaigns/${contract.address}`)
      } catch (err) {
        console.error(err)
      }
    }
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
