import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { Container } from '@chakra-ui/react'

import Header from '../../components/Header'

interface CampaignProps {
  id: string
}

export default function Campaign(props: CampaignProps) {
  return (
    <>
      <Head>
        <title>Campaign Dashboard | Fairdrop</title>
        <meta name="description" content={`Campaign dashboard of ${props.id}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <h1>View data on campaign: {props.id}</h1>
      </Container>
    </>
  )
}

// export async function getServerSideProps({ params }: Nex) {
// 	return {
// 		props: { id: params.id }
// 	}
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context?.params?.id,
    },
  }
}
