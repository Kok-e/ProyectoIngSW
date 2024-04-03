import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  CheckboxGroup,
  Checkbox,
  Button,
  List,
  ListItem,
  Container,
  Heading,
  Box,
  Flex,
  CircularProgress,
  FormHelperText,
} from "@chakra-ui/react";
import { Global } from "../helpers/Global";
import { AlertaSuccess } from "./AlertaSuccess";
import { AlertaError } from "./AlertaError";
import { Link } from "react-router-dom";

export const FormCuadrilla = () => {
  const [nombre, setNombre] = useState("");
  const [brigadistas, setBrigadistas] = useState([]);
  const [sector, setSector] = useState("");
  const [seleccion, setSeleccion] = useState([]);
  const [loading, setLoading] = useState();
  const [mensaje, setMensaje] = useState("");
  const [saved, setSaved] = useState("not_saved");
  const [errorSeleccion, setErrorSeleccion] = useState(false); // Nuevo estado para el error de selección

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (e) => {
    e.preventDefault();
    // Validar que se haya seleccionado al menos un brigadista
    if (seleccion.length === 0) {
      setErrorSeleccion(true);
      return;
    }
    setLoading(true);

    // Datos a enviar en la solicitud 
    const data2 = {
      nombre: nombre,
      brigadistas: seleccion,
      sector: sector,
    };

      // Se realiza el request
    const request = await fetch(Global.url + "cuadrilla", {
      method: "POST",
      body: JSON.stringify(data2),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();
    if (data.status === "success") {
      setSaved("saved"); // Se establece  'saved' si la creación fue exitosa
      setLoading(false);
      setTimeout(() => {
        window.location.reload(false); // Recargar la página después de 1.252 segundos para que le de tiempo de leer al usuario y vaciar el formulario
      }, 1252);
    } else {
      let message = data.message;
      setMensaje(message); // Se establece el mensaje de error recibido desde el servidor
      setSaved("error");
      setLoading(false);
    }
  };

    // Función para obtener la lista de brigadistas desde el servidor
  const fetchBrigadistas = async () => {
    try {
      const response = await fetch(Global.url + "getBrigadistas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.brigadistas) {
        setBrigadistas(data.brigadistas); // Actualizar el estado 'brigadistas' con los datos obtenidos
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //El useEffect para cargar los brigadistas al cargar el component
  useEffect(() => {
    fetchBrigadistas();
  }, []);

  // Efecto para limpiar el error de selección cuando cambia la selección de brigadistas
  useEffect(() => {
    setErrorSeleccion(false);
  }, [seleccion]);

  return (
    <>
      <Heading as={"h1"} fontSize="2em" textAlign="center" pb={"10"}>
        Crear Cuadrilla
      </Heading>
      <Container maxW="container.sm">
        <form onSubmit={onSubmit}>
          <FormControl mb="3" isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              type="text"
              placeholder="Ingrese nombre de la cuadrilla"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </FormControl>

          <FormControl mb="3" isInvalid={errorSeleccion}>
            <FormLabel>Brigadistas</FormLabel>
            <CheckboxGroup value={seleccion} onChange={setSeleccion}>
              <Box
                width="100%"
                height="300px"
                maxHeight="300px"
                overflowY="auto"
                borderWidth="2px"
                borderStyle="solid"
                borderColor="rgba(128, 128, 128, 0.2)"
                borderRadius="8px"
                padding="8px"
              >
                <List>
                  {brigadistas.map((brigadista) => (
                    <ListItem key={brigadista.rut}>
                      <Checkbox value={brigadista.rut}>
                        {brigadista.nombre} {brigadista.apellido}
                      </Checkbox>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <FormHelperText>Seleccione al menos un brigadista</FormHelperText>
            </CheckboxGroup>
            {errorSeleccion && (
              <FormHelperText color="red.500">
                Debe seleccionar al menos un brigadista.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl mb="3" isRequired>
            <FormLabel>Sector</FormLabel>
            <Input
              placeholder="Ingrese sector de la cuadrilla"
              type="text"
              value={sector}
              onChange={(event) => setSector(event.target.value)}
            />
            <FormHelperText>Por ejemplo: Chiguayante</FormHelperText>
          </FormControl>
          <Flex justifyContent="flex-end">
            <Button colorScheme="blue" variant="outline">
              <Link to={"/inicio/ListarCuadrilla"}>Volver</Link>
            </Button>
            <Button colorScheme="blue" ml={2} type="submit">
              Crear
            </Button>
          </Flex>
        </form>
        <br />
        {saved === "saved" ? (
          <AlertaSuccess mensaje={"Cuadrilla creada con éxito."} />
        ) : (
          ""
        )}
        {saved === "error" ? <AlertaError mensaje={mensaje} /> : ""}
        {loading ? (
          <Box marginLeft={"60"}>
            <CircularProgress isIndeterminate color="green.300" />
          </Box>
        ) : (
          ""
        )}
      </Container>
    </>
  );
};
