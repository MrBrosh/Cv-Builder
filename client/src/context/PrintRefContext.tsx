import {
  createContext,
  useContext,
  type RefObject,
} from 'react'

const PrintRefContext = createContext<RefObject<HTMLElement | null> | null>(
  null
)

export function usePrintRef() {
  const ctx = useContext(PrintRefContext)
  if (!ctx) throw new Error('usePrintRef must be used within Layout')
  return ctx
}

export { PrintRefContext }
