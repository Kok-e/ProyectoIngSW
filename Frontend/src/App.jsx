import { ChakraProvider } from '@chakra-ui/react'
import { ColorMode } from './components/ColorMode'
import { Routing } from '../router/Routing'

function App() {


  return (
    <ChakraProvider>
      <ColorMode/>
        <Routing/>
    </ChakraProvider>
  )
}

export default App
