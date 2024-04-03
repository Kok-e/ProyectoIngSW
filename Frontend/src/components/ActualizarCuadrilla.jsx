import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useForm } from "../hooks/useForm";
import { useEffect, useState } from "react";
import { Global } from "../helpers/Global";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AlertaError } from "./AlertaError";

export const ActualizarCuadrilla = () => {
  useEffect(() => {
    getCuadrilla(); // Obtenemos los datos de la cuadrilla actual
    fetchBrigadistas(); // Obtenemos la lista de brigadistas disponibles
  }, []);

  const params = useParams();
  const id = params.id; // Obtenemos el parámetro 'id' de la URL
  const { form, changed } = useForm({});
  const [cuadrilla, setCuadrilla] = useState({});
  const [saved, setSaved] = useState("not_saved");
  const [mensaje, setMensaje] = useState("");
  const [brigadistas, setBrigadistas] = useState([]);
  const [brigadistaCuadrilla, setBrigadistaCuadrilla] = useState([]);
  const navigate = useNavigate();

    // Función para obtener los datos de la cuadrilla actual desde la bd

  const getCuadrilla = async () => {
    const request = await fetch(Global.url + "getCuadrillaID/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    console.log(data);
    if (data.status === "success") {
      setCuadrilla(data.cuadrillas);
      setBrigadistaCuadrilla(data.cuadrillas.brigadistas);
      console.log("BRIGADISTAS EN LA CUADRILLA:", brigadistaCuadrilla);
    }
  };

  // Función para enviar el formulario actualizado al servidor
  const sendForm = async (e) => {
    e.preventDefault();
    await removeUncheckedBrigadistas();  // Eliminamos los brigadistas no seleccionados de la cuadrilla actual
    const uncheckedBrigadistas = brigadistas
      .filter((brigadista) => !brigadista.isChecked)
      .map((brigadista) => brigadista._id);
    let updateCuadrilla = {
      ...form,
      brigadistas: brigadistaCuadrilla,
      uncheckedBrigadistas: uncheckedBrigadistas,
    };

    // Enviamos la solicitud PUT para actualizar la cuadrilla en el servidor
    const request = await fetch(Global.url + "updateCuadrilla/" + id, {
      method: "PUT",
      body: JSON.stringify(updateCuadrilla),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    if (data.status === "success") {
      setSaved("saved");
      console.log(data);
      // Aquí redirigimos manualmente a ListarCuadrilla con el navigate
      navigate("/inicio/ListarCuadrilla");
    } else {
      let message = data.message;
      setMensaje(message);
      setSaved("error");
    }
  };

    // Función para obtener la lista de brigadistas disponibles en la bd
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
        const filteredBrigadistas = data.brigadistas.filter(
          (brigadista) => !brigadistaCuadrilla.includes(brigadista._id)
        );
        setBrigadistas(filteredBrigadistas);
        console.log("Brigadistas filtrados:", filteredBrigadistas);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // Función para la seleccion de brigadistas en el checkbox
  const handleBrigadistasSelection = (selectedBrigadistas) => {
    setBrigadistaCuadrilla(selectedBrigadistas);
  };

  // Función para eliminar los brigadistas que no se seleccionan en el checkbox, enviando la id con un put
  const removeUncheckedBrigadistas = async () => {
    for (const brigadista of brigadistas) {
      if (!brigadista.isChecked) {
        await fetch(Global.url + "removeBrigadista/" + id, {
          method: "PUT",
          body: JSON.stringify({ brigadistaId: brigadista._id }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  };
  return (
    <>
      <Heading as={"h1"} fontSize="2em" textAlign="center" pb={"10"}>
        Actualizar Cuadrilla
      </Heading>
      <Container maxW="container.sm">
        <form>
          <FormControl mb="3" isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              defaultValue={cuadrilla.nombre}
              type="text"
              name="nombre"
              onChange={changed}
            />
          </FormControl>

          <FormControl mb="3">
            <FormLabel>Brigadistas</FormLabel>
            <CheckboxGroup
              value={brigadistaCuadrilla}
              onChange={handleBrigadistasSelection}
            >
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
                    <ListItem key={brigadista._id}>
                      <Checkbox
                        value={brigadista._id}
                        isChecked={brigadista.isChecked}
                      >
                        {brigadista.nombre} {brigadista.apellido}
                      </Checkbox>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <FormHelperText>
                Seleccione los brigadistas que participarán en la cuadrilla
              </FormHelperText>
            </CheckboxGroup>
          </FormControl>

          <FormControl mb="3" isRequired>
            <FormLabel>Sector</FormLabel>
            <Input
              defaultValue={cuadrilla.sector}
              type="text"
              name="sector"
              onChange={changed}
            />
          </FormControl>

          <Box marginLeft={"60"} display="flex" justifyContent="flex-end">
            <Button colorScheme="teal" variant="outline">
              <Link to={"/inicio/ListarCuadrilla"}>Cancelar</Link>
            </Button>
            <Button ml="2" colorScheme="teal" type="submit" onClick={sendForm}>
              Enviar
            </Button>
          </Box>
        </form>
        {saved === "error" ? <AlertaError mensaje={mensaje} /> : ""}
      </Container>
    </>
  );
};
