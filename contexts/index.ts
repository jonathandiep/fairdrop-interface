import { createContext } from 'react'

interface AddressesContext {
  addresses: any[]
  setAddresses: (addresses: any[]) => void
}

export const AddressesContext = createContext<AddressesContext>({
  addresses: [],
  setAddresses: () => {},
})
