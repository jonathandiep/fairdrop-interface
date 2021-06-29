import axios from 'axios'

export async function getMerkleData(path: string): Promise<any> {
  try {
    const { data } = await axios.get(`https://ipfs.infura.io/ipfs/${path}`)
    return data
  } catch (err) {
    console.error(err)
  }
}
