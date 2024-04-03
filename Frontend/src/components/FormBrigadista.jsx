import { Box, Button, CircularProgress, Container, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import { Global } from '../helpers/Global'
import { useForm } from "../hooks/useForm"
import { useState } from "react";
import { AlertaSuccess } from "./AlertaSuccess";
import { AlertaError } from "./AlertaError";
import { Navigate } from "react-router-dom";

export const FormBrigadista = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_saved");
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeSuccess, setMensajeSuccess] = useState('');
  const [loading, setLoading] = useState();
  const [navegar, setNavegar] = useState(false);

  const sendForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newBrigadista = form;

    const request = await fetch(Global.url + 'createBrigadista', {
      method: 'POST',
      body: JSON.stringify(newBrigadista),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await request.json();

    if (data.status == 'success') {
      setSaved("saved");
      setLoading(false);
      console.log(data)
      let message = data.message
      console.log(message);
      setMensajeSuccess(message)
      setTimeout(function(){
        setNavegar(true)
      }, 1000);
    } else {
      let message = data.message
      setMensajeError(message)
      setSaved("error");
      setLoading()
    }
  }

  return (
    <>
      <Heading as={'h1'} fontSize='2em' textAlign='center' pb={'10'}>Registrar Brigadista</Heading>
      <Container maxW='container.sm'>
        <HStack spacing='10px'>

          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input placeholder='Nombre' onChange={changed} name="nombre" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Apellido</FormLabel>
            <Input placeholder='Apellido' name="apellido" onChange={changed} />

          </FormControl>
        </HStack>
        <HStack spacing='10px'>
          <FormControl isRequired>
            <FormLabel>Rut</FormLabel>
            <Input placeholder='Rut' name="rut" onChange={changed} />
            <FormHelperText>ej: 12345678-2</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Edad</FormLabel>
            <NumberInput >
              <NumberInputField name="edad" onChange={changed} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>Debe ser mayor a 18</FormHelperText>

          </FormControl>

        </HStack>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type='email' name="email" onChange={changed} />
          <FormHelperText>email@gmail.com</FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Telefono</FormLabel>
          <NumberInput >
            <NumberInputField name="telefono" onChange={changed} />
          </NumberInput>
          <FormHelperText>Debe comenzar con 9 y seguir de 8 digitos</FormHelperText>
        </FormControl>
        <Box marginLeft={'60'}>
          <Button mt={4} colorScheme='teal' type='submit' onClick={sendForm}>Enviar</Button>
        </Box>
        <br />
        {saved === 'saved' ?
           <AlertaSuccess mensaje={mensajeSuccess}/>
          : ''}
        {saved === 'error' ?
          <AlertaError mensaje={mensajeError} />
          : ''}
        {loading ?
          <Box marginLeft={'60'}>
            <CircularProgress isIndeterminate color='green.300' />
          </Box>
          : ''
        }
        {navegar ?
              <Navigate to={'/inicio'} />
              : ''
            }
      </Container>
    </>


  )
}