import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Button, Box, Container, Flex, Heading, Spacer, Table, Tbody, Thead, Td, Th, Tr } from '@chakra-ui/react'
import { Container as PaginatorContainer, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator'

import { AddressesContext } from '../../contexts'
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
  const [addresses, setAddresses] = useState<any[]>([])
  // const [page, setPage] = useState(1)
  const [pageQuantity, setPageQuantity] = useState(1)
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { pageSize: NUM_OF_ROWS, currentPage: 1 },
  })

  useEffect(() => {
    const pages = Math.ceil(addresses.length / NUM_OF_ROWS)
    setPageQuantity(pages)
  }, [addresses])

  const providerAddresses = useMemo(() => ({ addresses, setAddresses }), [addresses, setAddresses])

  return (
    <>
      <Head>
        <title>Create an Airdrop | Fairdrop</title>
        <meta name="description" content="Create airdrops with distribtion to on-chain activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <Heading as="h1" size="lg">
          {addresses.length === 0 ? 'Create an Airdrop' : 'Audience'}
        </Heading>
        <AddressesContext.Provider value={providerAddresses}>
          {addresses.length === 0 ? (
            <PreviewAudienceForm />
          ) : (
            <Box>
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
                      <Td>{addr.origin}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex justifyContent="center" my={5}>
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
              <Flex>
                <Button colorScheme="purple" variant="outline" onClick={() => setAddresses([])}>
                  Back
                </Button>
                <Spacer />
                <Button colorScheme="purple">Confirm</Button>
              </Flex>
            </Box>
          )}
        </AddressesContext.Provider>
      </Container>
    </>
  )
}

export default Create
