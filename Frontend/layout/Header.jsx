import { Tab, TabList, Tabs } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export const Header = () => {
    return (
        <Tabs p={'10'} ml={'200'} variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab><Link to={'/inicio/listarBrigadista'}>Inicio</Link></Tab>
                <Tab><Link to={'/inicio/listarBrigadista'}>Brigadistas</Link></Tab>
                <Tab><Link to={'/inicio/ListarPracticas'}>Practicas</Link></Tab>
                <Tab><Link to={'/inicio/ListarCuadrilla'}>Cuadrillas</Link></Tab>
                <Tab><Link to={'/inicio/Exportar'}>Exportar CSV</Link></Tab>
            </TabList>
        </Tabs>
    )
}
