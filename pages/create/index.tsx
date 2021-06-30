import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import {
  Button,
  Box,
  Code,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  Table,
  Tbody,
  Thead,
  Td,
  Th,
  Tr,
} from '@chakra-ui/react'
import { Container as PaginatorContainer, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator'
import { utils } from 'ethers'

import { AddressesContext } from '../../contexts'

import CampaignForm from '../../components/CampaignForm'
import Header from '../../components/Header'

const NUM_OF_ROWS = 25
const PreviewAudienceForm = dynamic(() => import('../../components/AirdropForm'), { ssr: false })

const paginationNormalStyles = {
  p: 1,
  w: '40px',
}

const paginationActiveStyles = {
  ...paginationNormalStyles,
  colorScheme: 'purple',
}

function Create() {
  const [addresses, setAddresses] = useState<string[]>([])
  const [pageQuantity, setPageQuantity] = useState(1)
  const [injectAddr, setInjectAddr] = useState<string>() // used for dev envs
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { pageSize: NUM_OF_ROWS, currentPage: 1 },
  })

  useEffect(() => {
    if (addresses.length > 0) {
      const pages = Math.ceil(addresses.length / NUM_OF_ROWS)
      setPageQuantity(pages)
    }
  }, [addresses])

  const providerAddresses = useMemo(() => ({ addresses, setAddresses }), [addresses, setAddresses])

  const AudienceTable = () => (
    <Box>
      <Heading as="h1" size="lg" my={2}>
        Audience
      </Heading>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {addresses.slice((currentPage - 1) * NUM_OF_ROWS, currentPage * NUM_OF_ROWS).map((addr, idx) => (
            <Tr key={idx}>
              <Td>{(currentPage - 1) * NUM_OF_ROWS + idx + 1}</Td>
              <Td>
                <Code>{addr}</Code>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="center" my={3}>
        <Paginator
          pagesQuantity={pageQuantity}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          outerLimit={2}
          innerLimit={2}
          normalStyles={paginationNormalStyles}
          activeStyles={paginationActiveStyles}
        >
          <PaginatorContainer align="center" justify="space-between" w="full" p={4}>
            <Previous>◀️</Previous>
            <PageGroup isInline align="center" />
            <Next>▶️</Next>
          </PaginatorContainer>
        </Paginator>
      </Flex>
      {process.env.NODE_ENV === 'development' ? (
        <Box mx={10} mb={10} p={10} w="60%" border="1px" borderColor="red.100" color="red">
          <Heading size="md">Developer&apos;s Backdoor</Heading>
          <Text fontSize="sm">Inject address into Audience. Allows address to be a part of the merkle tree</Text>
          <Text fontSize="sm">This tool is only used in dev environments</Text>
          <Input placeholder="0x..." size="sm" onChange={(e) => setInjectAddr(e.target.value)} />
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => {
              console.log(injectAddr)
              if (injectAddr && utils.isAddress(injectAddr)) {
                const newAddresses = addresses.concat(injectAddr)
                setAddresses(newAddresses)
              }
            }}
          >
            Inject
          </Button>
        </Box>
      ) : null}
    </Box>
  )

  return (
    <>
      <Head>
        <title>Create an Airdrop | Fairdrop</title>
        <meta name="description" content="Create airdrops with distribtion to on-chain activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container maxW={addresses.length === 0 ? 'container.sm' : 'container.xl'}>
        {addresses.length > 0 ? (
          <Button colorScheme="purple" variant="outline" size="sm" mb={3} onClick={() => setAddresses([])}>
            Back
          </Button>
        ) : (
          <Heading as="h1" size="lg" mb={3}>
            Select your audience
          </Heading>
        )}
        <AddressesContext.Provider value={providerAddresses}>
          {addresses.length === 0 ? (
            <PreviewAudienceForm />
          ) : (
            <Flex justifyContent="space-between" flexWrap="wrap">
              <AudienceTable />
              <CampaignForm />
            </Flex>
          )}
        </AddressesContext.Provider>
      </Container>
    </>
  )
}

export default Create
