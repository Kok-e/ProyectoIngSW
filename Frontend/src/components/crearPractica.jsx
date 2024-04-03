import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Select,
  Stack,
  Container,
} from "@chakra-ui/react";
import { Global } from '../helpers/Global'
import Swal from 'sweetalert2';

export const CrearPractica = () => {
  const [datos, setDatos] = useState({
    nombre_practica: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    herramientasEquipo: "",
    cuadrilla: ""
  });

  const [cuadrillas, setCuadrillas] = useState([]);
  const [loading, setLoading] = useState();
  const [mensaje, setMensaje] = useState('');
  const [saved, setSaved] = useState("not_saved");

  useEffect(() => {
    getCuadrilla();
  }, [])

  const getCuadrilla = async () => {
    const request = await fetch(Global.url + 'getCuadrilla', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await request.json();

    if (data.status === 'success') {
      setCuadrillas(data.cuadrillas);
    }
  }

  const fieldNames = {
    nombre_practica: "Nombre de la práctica",
    descripcion: "Descripción",
    fecha: "Fecha",
    lugar: "Lugar",
    herramientasEquipo: "Recursos",
    cuadrilla: "Cuadrilla",
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const field in datos) {
      if (datos[field].trim() === '') {
        setMensaje(`El campo ${fieldNames[field]} no puede estar vacío.`);
        setSaved("error");
        return;
      }
    }

    // Validar que no haya caracteres especiales en los campos de texto
    const regex = /^[A-Za-z0-9\s]+$/;
    if (!regex.test(datos.nombre_practica) || !regex.test(datos.descripcion) || !regex.test(datos.lugar)) {
      setMensaje("Los campos nombre de la práctica, descripción y lugar solo pueden contener letras, números y espacios.");
      setSaved("error");
      return;
    }

    setLoading(true);
    let newPractica = datos;

    const request = await fetch(Global.url + 'practica', {
      method: 'POST',
      body: JSON.stringify(newPractica),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await request.json();
    console.log("data", data)

    if (data.status == 'success') {
      
      setSaved("saved");
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Correo enviado exitosamente',
      });
    } else {
      let message = data.message
      setMensaje(message)
      setSaved("error");
      setLoading()
    }
  }

  return (
    <Container maxW='container.sm'>
      <Box p={4}>
        <Heading as="h1" mb={4}>
          Crear práctica
        </Heading>
        <Stack spacing={4}>
          <Heading as="h2" size="md">
            Datos generales
          </Heading>
          <FormControl id="nombre-practica" mb={2}>
            <FormLabel>Nombre de la práctica</FormLabel>
            <Input
              type="text"
              name="nombre_practica"
              value={datos.nombre_practica}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="descripcion" mb={2}>
            <FormLabel>Descripción</FormLabel>
            <Textarea name="descripcion" value={datos.descripcion} onChange={handleChange} />
          </FormControl>
          <FormControl id="fecha" mb={2}>
            <FormLabel>Fecha</FormLabel>
            <Input
              type="date"
              name="fecha"
              value={datos.fecha}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 10)}
              max="2023-12-31"
              style={{ border: "none", background: "transparent" }}
            />
          </FormControl>
          <FormControl id="lugar" mb={2}>
            <FormLabel>Lugar</FormLabel>
            <Input type="text" name="lugar" value={datos.lugar} onChange={handleChange} />
          </FormControl>
          <Heading as="h2" size="md">
            Recursos
          </Heading>
          <FormControl id="recursos" mb={2}>
            <FormLabel>Recursos</FormLabel>
            <Input type="text" name="herramientasEquipo" value={datos.herramientasEquipo} onChange={handleChange} />
          </FormControl>
          <FormControl id="cuadrilla" mb={2}>
            <FormLabel>Cuadrilla</FormLabel>
            <Select name="cuadrilla" value={datos.cuadrilla} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              {cuadrillas.map((cuadrilla) => (
                <option key={cuadrilla._id} value={cuadrilla._id}>
                  {cuadrilla.nombre}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Button type="submit" colorScheme="blue">
            Crear
          </Button>
        </form>

        {mensaje && (
          <Box mt={2} color="red.500">
            {mensaje}
          </Box>
        )}

      </Box>
    </Container>
  );
};