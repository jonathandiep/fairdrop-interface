import { useEffect, useState } from 'react'
import { Code, Flex, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react'
import { Container as PaginatorContainer, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator'

interface AddressListProps {
  addresses: string[]
}

const NUM_OF_ROWS = 25

const paginationNormalStyles = {
  p: 1,
  w: '40px',
}

const paginationActiveStyles = {
  ...paginationNormalStyles,
  colorScheme: 'purple',
}

export default function AddressList({ addresses }: AddressListProps) {
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { pageSize: NUM_OF_ROWS, currentPage: 1 },
  })

  const [pageQuantity, setPageQuantity] = useState(1)

  useEffect(() => {
    if (addresses.length > 0) {
      const pages = Math.ceil(addresses.length / NUM_OF_ROWS)
      setPageQuantity(pages)
    }
  }, [addresses])

  return (
    <>
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
    </>
  )
}
