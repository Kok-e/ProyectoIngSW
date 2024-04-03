import { Box, Button, CircularProgress, Container, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import { useForm } from "../hooks/useForm";
import { useEffect, useState } from "react";
import { Global } from '../helpers/Global'
import { Link, useParams } from "react-router-dom";
import { AlertaSuccess } from "./AlertaSuccess";
import { AlertaError } from "./AlertaError";

export const ActualizarBrigadista = () => {
    useEffect(() => {
        getBrigadista()
    }, [])

    const params = useParams();
    const id = params.id;
    const { form, changed } = useForm({});
    const [brigadista, setBrigadista] = useState([]);
    const [saved, setSaved] = useState("not_saved");
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState();

    const getBrigadista = async () => {
        const request = await fetch(Global.url + 'getSpecificBrigadista/' + id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await request.json();
        console.log(data)
        if (data.status === 'success') {
            setBrigadista(data.brigadistas);
            console.log('succes', brigadista)
        }
    }

    const sendForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        let updateBrigadista = form;

        const request = await fetch(Global.url + 'updateBrigadista/' + id, {
            method: 'PUT',
            body: JSON.stringify(updateBrigadista),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await request.json();
        console.log('data', data);
        console.log('nueva data', data)
        if (data.status == 'success') {
            setSaved("saved");
            setLoading(false);
        } else {
            let message = data.message
            setMensaje(message)
            setSaved("error");
            setLoading()
        }
    }
    return (
        <>
            <Heading as={'h1'} fontSize='2em' textAlign='center' pb={'10'}>Actualizar Brigadista</Heading>
            <Container maxW='container.sm'>
                <HStack spacing='10px'>

                    <FormControl >
                        <FormLabel>Nombre</FormLabel>
                        <Input placeholder='Nombre' onChange={changed} name="nombre" defaultValue={brigadista.nombre} />
                    </FormControl>

                    <FormControl >
                        <FormLabel>Apellido</FormLabel>
                        <Input placeholder='Apellido' name="apellido" onChange={changed} defaultValue={brigadista.apellido} />

                    </FormControl>
                </HStack>
                <HStack spacing='10px'>
                    <FormControl >
                        <FormLabel>Rut</FormLabel>
                        <Input placeholder='Rut' name="rut" onChange={changed} defaultValue={brigadista.rut} />
                        <FormHelperText>ej: 12345678-2</FormHelperText>
                    </FormControl>

                    <FormControl >
                        <FormLabel>Edad</FormLabel>
                        <Input placeholder='edad' name="edad" onChange={changed} defaultValue={brigadista.edad} />
                        <FormHelperText>Debe ser mayor a 18</FormHelperText>

                    </FormControl>

                </HStack>
                <FormControl >
                    <FormLabel>Email</FormLabel>
                    <Input type='email' name="email" onChange={changed} defaultValue={brigadista.email} />
                    <FormHelperText>email@gmail.com</FormHelperText>
                </FormControl>

                <FormControl >
                    <FormLabel>Teléfono</FormLabel>
                    <Input type='telefono' name="telefono" onChange={changed} defaultValue={brigadista.telefono} />
                    <FormHelperText>Debe comenzar con 9 y seguir de 8 digitos</FormHelperText>
                </FormControl>
                <Box marginLeft={'60'}>
                    <Button mt={4} colorScheme='teal' type='submit' onClick={sendForm}>Enviar</Button>
                    <Button mt={4} ml={'2'} colorScheme='teal' type='submit'><Link to={'/inicio/listarBrigadista'} >Volver</Link></Button>
                </Box>
                <br />

                {saved === 'saved' ?
                    <AlertaSuccess />
                    : ''}
                {saved === 'error' ?
                    <AlertaError mensaje={mensaje} />
                    : ''}
                {loading ?
                    <Box marginLeft={'60'}>
                        <CircularProgress isIndeterminate color='green.300' />
                    </Box>
                    : ''
                }
            </Container>
        </>

    )
}
