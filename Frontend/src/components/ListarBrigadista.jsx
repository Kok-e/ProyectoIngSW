import { Button, Container, Heading, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react"
import { Global } from '../helpers/Global'
import { useEffect, useState } from "react"
import { ActualizarBrigadista } from "./ActualizarBrigadista";
import { Link, Navigate } from "react-router-dom";
import { AlertaSuccess } from "./AlertaSuccess";

export const ListarBrigadista = () => {
    const [brigadistas, setBrigadistas] = useState([]);
    const [newBrigadista, setNewBrigadista] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const [actualizar, setActualizar] = useState(false);
    const [cargando, setCargando] = useState(false);
    useEffect(() => {
        getBrigadistas();
    }, [])
    useEffect(() => {
        conseguirArray(emailInput)
        
    }, [emailInput])
    const conseguirArray = async (emailInput) => {
        let emailsArray = await (brigadistas.filter(brigadista => brigadista.email.startsWith(emailInput)));

        const setear = async (emailsArray) => {
            await setBrigadistas(emailsArray);
        }

        setear(emailsArray);


    }
    const limpiar = () => {
        location.reload();
    }
    // useEffect(() => {
    //     getBrigadistas(emailInput);

    // }, [emailInput])

    const getBrigadistas = async () => {
        const request = await fetch(Global.url + 'getBrigadistas/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await request.json();

        if (data.status === 'success') {
            setBrigadistas(data.brigadistas);
        }
    }
    const changed = (e) => {
        setEmailInput(e.target.value);
        // let brigadistasEmail = brigadistas.map(brigadista => brigadista.email);
        // setBrigadistas();
        // console.log('emails',brigadistasEmail);
        // brigadistasEmail.forEach((brigadista)=>{
        //     if (brigadista.startsWith(e.target.value)) {
        //         console.log(brigadistas)
        //     }
        // })
    }

    // const searchEmail = (email) => {
    //     console.log(email);
    //     const emailsArray = brigadistas.filter(brigadista => brigadista.email.startsWith(email));
    //     setBrigadistas(emailsArray);
    // }
    const eliminarBrigadista = async (brigadista) => {
        setCargando(true);
        const request = await fetch(Global.url + 'deleteBrigadista/' + brigadista, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'aplication/json'
            }
        });
        setTimeout(() => {
            setCargando(false);
            location.reload();
        }, 1000);
        const data = await request.json();

    }

    const handleExport = () => {
        let url;
        url = "http://146.83.198.35:1050/api/exportBrigadistas";
    
        window.location.href = url;
      };
    const actualizarBrigadista = async (brigadista) => {
        setNewBrigadista(brigadista)
        setActualizar(true);

        //     const request = await fetch(Global.url+'updateBrigadista/'+brigadista,{
        //         method: 'PUT',
        //         body: 
        //         headers: {
        //             'Content-Type': 'aplication/json'
        //         }
        //     })
    }

    return (
        <>
            <Heading as={'h1'} fontSize='2em' textAlign='center' pb={'10'}>Brigadistas registrados</Heading>
            <Container maxW='container.xl'>
            <Container maxW='container.xl' display='flex' justifyContent='flex-end'>
            <Button colorScheme="teal">
              <Link to={"/inicio/registrarBrigadista"}>Crear brigadista</Link>
            </Button>
           <Button colorScheme="teal" variant="outline" onClick={handleExport} ml={2}>Exportar CSV</Button>
          </Container>
                <Input
                    width={'30%'}
                    my={'10'}
                    color='teal'
                    placeholder='Buscar por email...'
                    _placeholder={{ color: 'inherit' }} onChange={changed}
                />
                <Button onClick={limpiar} m={3} >Limpiar</Button>
                <TableContainer >
                    <Table variant='striped' colorScheme='teal'>
                        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                        <Thead>
                            <Tr>
                                <Th>Nombres</Th>
                                <Th>Rut</Th>
                                <Th>Teléfono</Th>
                                <Th>Email</Th>
                                <Th></Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {brigadistas.map(brigadista => {
                                return (
                                    <Tr key={brigadista._id}>
                                        <Td>{brigadista.nombre + ' ' + ' ' + brigadista.apellido}</Td>
                                        <Td>{brigadista.rut}</Td>
                                        <Td>{brigadista.telefono}</Td>
                                        <Td>{brigadista.email}</Td>
                                        <Td><Button colorScheme='green' onClick={() => actualizarBrigadista(brigadista)}><Link to={'/inicio/actualizarBrigadista/' + brigadista._id} >Actualizar</Link></Button></Td>
                                        <Td><Button colorScheme='red' onClick={() => eliminarBrigadista(brigadista._id)}>Eliminar</Button></Td>

                                    </Tr>
                                )
                            })}

                        </Tbody>

                    </Table>
                </TableContainer>
                {cargando ? <AlertaSuccess /> : ''}
            </Container>
            {actualizar ? <ActualizarBrigadista newBrigadista={newBrigadista} /> : ''}
        </>
    )

}
