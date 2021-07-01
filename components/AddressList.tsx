import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Code, Flex, Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import { Container as PaginatorContainer, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator'
import { Contract } from 'ethers'

import { etherscanUrl } from '../utils'
import { MerkleProofData } from '../interfaces'

import ClaimedIcon from './ClaimedIcon'

interface AddressListProps {
  headers: string[]
  addresses: string[]
  merkleData?: MerkleProofData
  merkleDistributorContract?: Contract
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

export default function AddressList({ headers, addresses, merkleData, merkleDistributorContract }: AddressListProps) {
  const { chainId } = useWeb3React()
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
            {headers.map((title) => (
              <Th key={title}>{title}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {addresses.slice((currentPage - 1) * NUM_OF_ROWS, currentPage * NUM_OF_ROWS).map((addr, idx) => (
            <Tr key={idx}>
              <Td>{(currentPage - 1) * NUM_OF_ROWS + idx + 1}</Td>
              <Td>
                <Code>{addr}</Code>
                <Link href={etherscanUrl(chainId, 'address', addr)}>
                  <a>
                    <LinkIcon mb={1} ml={1} color="blue.400" />
                  </a>
                </Link>
              </Td>
              {merkleData && merkleDistributorContract ? (
                <Td>
                  <ClaimedIcon
                    address={addr}
                    merkleData={merkleData}
                    merkleDistributorContract={merkleDistributorContract}
                  />
                </Td>
              ) : null}
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
