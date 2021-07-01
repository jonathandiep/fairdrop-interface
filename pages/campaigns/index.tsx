import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Heading, Table, Thead, Tbody, Th, Tr } from '@chakra-ui/react'
import { Contract } from 'ethers'

import { useFairdropContract } from '../../hooks/useFairdropContract'
import AirdropRow from '../../components/AirdropRow'
import Header from '../../components/Header'

interface CampaignsProps {
  images: {
    [key: string]: {
      logo: string
    }
  }
}

export default function Campaigns({ images }: CampaignsProps) {
  const fairdropContract = useFairdropContract()

  const [airdrops, setAirdrops] = useState<{ address: string; cid: string }[]>()

  useEffect(() => {
    async function getAmountOfAirdrops(contract: Contract) {
      const amount = (await contract.count()).toNumber()
      const arr = await Promise.all(
        new Array(amount).fill('').map(async (_, idx) => {
          return {
            address: await contract.getAirdropAddress(idx),
            cid: await contract.getAirdropCID(idx),
          }
        })
      )

      setAirdrops(arr)
    }

    if (fairdropContract) {
      getAmountOfAirdrops(fairdropContract)
    }
  }, [images, fairdropContract])

  return (
    <>
      <Head>
        <title>View Airdrop Campaigns | Fairdrop</title>
        <meta name="description" content="Overview of Fairdrop campaigns" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        {airdrops === undefined ? null : airdrops.length === 0 ? (
          <Heading as="h1" size="lg">
            No airdrops listed
          </Heading>
        ) : (
          <>
            <Heading as="h1" size="lg">
              List of Airdrops:
            </Heading>
            <Table>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Status</Th>
                  <Th>Token</Th>
                </Tr>
              </Thead>
              <Tbody>
                {airdrops.map((props, idx) => (
                  <AirdropRow key={idx} id={idx} images={images} {...props} />
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/token-images`)
  return {
    props: {
      images: data,
    },
  }
}
