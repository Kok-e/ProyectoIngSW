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
  useToast
} from "@chakra-ui/react";
import { Global } from '../helpers/Global'

export const ActualizarPractica = ({ practica, setIsEditing }) => {
  // Crea un estado para guardar los datos del formulario
  const [datos, setDatos] = useState({
    nombre_practica: practica.nombre_practica,
    descripcion: practica.descripcion,
    fecha: practica.fecha,
    lugar: practica.lugar,
    herramientasEquipo: practica.herramientasEquipo,
    cuadrilla: practica.cuadrilla,
  });

  const [errores, setErrores] = useState({
    nombre_practica: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    herramientasEquipo: "",
    cuadrilla: "",
  });


  const [cuadrillas, setCuadrillas] = useState([]);
  const [loading, setLoading] = useState(false);
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
    });

    const data = await request.json();

    if (data.status === 'success') {
      setCuadrillas(data.cuadrillas);
    }
  }

  

  const validarCampos = () => { 
    let camposValidos = true;
    const nuevosErrores = { ...errores };

    // Verificar si los campos están vacíos
    if (datos.nombre_practica.trim() === "") {
      nuevosErrores.nombre_practica = "El nombre de la práctica es requerido";
      camposValidos = false;
    }

    if (datos.descripcion.trim() === "") {
      nuevosErrores.descripcion = "La descripción es requerida";
      camposValidos = false;
    }

    if (datos.fecha.trim() === "") {
      nuevosErrores.fecha = "La fecha es requerida";
      camposValidos = false;
    }

    if (datos.lugar.trim() === "") {
      nuevosErrores.lugar = "El lugar es requerido";
      camposValidos = false;
    }

    if (datos.herramientasEquipo.trim() === "") {
      nuevosErrores.herramientasEquipo = "Las herramientas y equipo son requeridos";
      camposValidos = false;
    }

    if (datos.cuadrilla.trim() === "") {
      nuevosErrores.cuadrilla = "La cuadrilla es requerida";
      camposValidos = false;
    }

    setErrores(nuevosErrores);
    return camposValidos;
  };

  // Crea una función para actualizar el estado cuando cambien los inputs
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validarCampos()) {
      setLoading(false);
      return;
    }



    const updatedPractica = {
      ...datos,
      _id: practica._id, // Agregar el _id de la práctica para identificarla en el backend

    };

    try {
      console.log(practica._id);
      const request = await fetch(Global.url + 'updatePractica/' + practica._id, {
        method: 'PUT',
        body: JSON.stringify(updatedPractica),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await request.json();

      if (data.status === 'success') {
        setIsEditing(false);
        setSaved("saved");
        window.location.reload();
        return alert("Practica actualizada correctamente");
      }
      else {
        setSaved("error");
        setMensaje(data.message);
      }

      setLoading(false);
    } catch (error) {
      setSaved("error");
      setMensaje('Ocurrió un error al actualizar la práctica.');
      setLoading(false);
    }
  }

  return (
    <Container maxW='container.sm'>
      <Box p={4}>
        <Heading as="h1" mb={4}>
          Actualizar práctica
        </Heading>
        <Stack spacing={4}>
          {/* ... Tu código JSX existente ... */}
          {/* Mostrar mensajes de error debajo de los campos */}
          {errores.nombre_practica && <div style={{ color: "red" }}>{errores.nombre_practica}</div>}
          {errores.descripcion && <div style={{ color: "red" }}>{errores.descripcion}</div>}
          {errores.fecha && <div style={{ color: "red" }}>{errores.fecha}</div>}
          {errores.lugar && <div style={{ color: "red" }}>{errores.lugar}</div>}
          {errores.herramientasEquipo && <div style={{ color: "red" }}>{errores.herramientasEquipo}</div>}
          {errores.cuadrilla && <div style={{ color: "red" }}>{errores.cuadrilla}</div>}
          {/* ... Tu código JSX existente ... */}
        </Stack>
        <Stack spacing={4}>
          <Heading as="h2" size="md">
            Datos generales
          </Heading>
          <FormControl id="nombre-practica" mb={2}>
            <FormLabel>Nombre de la práctica</FormLabel>
            {/* Usa el atributo value para vincular el input al estado y el atributo onChange para actualizar el estado cuando cambie el valor */}
            <Input
              type="text"
              name="nombre_practica"
              value={datos.nombre_practica}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="descripcion" mb={2}>
            <FormLabel>Descripción</FormLabel>
            {/* Usa el atributo value para vincular el textarea al estado y el atributo onChange para actualizar el estado cuando cambie el valor */}
            <Textarea name="descripcion" value={datos.descripcion} onChange={handleChange} />
          </FormControl>
          {/* Usar el componente Input con tipo date para elegir la fecha */}
          <FormControl id="fecha" mb={2}>
            <FormLabel>Fecha</FormLabel>
            {/* Usa el atributo value para vincular el input al estado y el atributo onChange para actualizar el estado cuando cambie el valor */}
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
            {/* Usa el atributo value para vincular el input al estado y el atributo onChange para actualizar el estado cuando cambie el valor */}
            <Input type="text" name="lugar" value={datos.lugar} onChange={handleChange} />
          </FormControl>
          <Heading as="h2" size="md">
            Recursos
          </Heading>
          <FormControl id="recursos" mb={2}>
            <FormLabel>Recursos</FormLabel>
            {/* Usa el atributo value para vincular el input al estado y el atributo onChange para actualizar el estado cuando cambie el valor */}
            <Input type="text" name="herramientasEquipo" value={datos.herramientasEquipo} onChange={handleChange} />
          </FormControl>
          <FormControl id="cuadrilla" mb={2}>
            <FormLabel>Cuadrilla</FormLabel>
            {/* Usa el atributo value para vincular el select al estado y el atributo onChange para actualizar el estado cuando cambie el valor */}
            <Select name="cuadrilla" value={datos.cuadrilla} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              {/* Usar map para generar los options a partir de las cuadrillas */}
              {cuadrillas.map((cuadrilla) => (
                //  Agregaruna prop key con el id de cada cuadrilla
                <option key={cuadrilla._id} value={cuadrilla._id}>
                  {cuadrilla.nombre}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Usa el evento onSubmit del formulario para llamar a la función handleSubmit */}
        <form onSubmit={handleSubmit}>
          <Button type="submit" colorScheme="blue">
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ActualizarPractica;