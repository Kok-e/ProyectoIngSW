import React, { useState, useEffect } from "react";
import { Global } from "../helpers/Global";
import {
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  ModalFooter,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const ListarCuadrilla = () => {
  const [cuadrillas, setCuadrillas] = useState([]);
  const [selectedId, setSelectedId] = React.useState("");
  const [isOpenId, setIsOpenId] = useState(false);

  //AQUI OBTENGO LAS CUADRILLAS
  const obtenerCuadrillas = async () => {
    try {
      const response = await fetch(Global.url + "getCuadrilla", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCuadrillas(data.cuadrillas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerCuadrillas();
  }, []);

  const eliminarCuadrilla = async (id) => {
    try {
      const response = await fetch(Global.url + "deleteCuadrilla/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datadelete = await response.json();
      obtenerCuadrillas(datadelete); // Actualizar la lista de cuadrillas después de eliminar una
    } catch (error) {
      console.log(error);
    }
  };

  //EXPORTAR LISTADO DE CUADRILLAS
  const handleExport = () => {
    let url;
    url = "http://146.83.198.35:1050/api/exportCuadrilla";

    window.location.href = url;
  };

  //EXPORTAR LA CUADRILLA POR NOMBRE
  const handleExportID = () => {
    let url;
    url = `http://146.83.198.35:1050/api/exportCuadrilla/${selectedId}`;

    window.location.href = url;
  };

  const actualizarCuadrilla = (id) => {
    window.location.href = `/inicio/ActualizarCuadrilla/${id}`;
  };

  //ESTADO DE LA SELECCION
  const handleIdChange = (event) => {
    setSelectedId(event.target.value);
  };

  return (
    <>
      <Heading as={"h1"}  fontSize="2em" textAlign="center" pb={"10"}>
        Cuadrillas
      </Heading>
      <Container maxW="container.xl">
        <TableContainer pb={"100"}>
          <Container
            maxW="container.xl"
            display="flex"
            justifyContent="flex-start"
          ></Container>

          {/* BOTONES PARA EXPORTAR */}

          <Container
            maxW="container.xl"
            display="flex"
            justifyContent="flex-end"
          >
            <Button colorScheme="teal">
              <Link to={"/inicio/FormCuadrilla"}>Crear cuadrilla</Link>
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handleExport}
              ml={2}
            >
              Exportar CSV
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={() => setIsOpenId(true)}
              ml={2}
            >
              Exportar CSV por nombre
            </Button>
          </Container>

          {/* LISTADO */}

          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Brigadistas</Th>
                <Th>Sector</Th>
                <Th> </Th> {/* DEJE ESTE ESPACIO PARA EL BOTÓN */}
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {cuadrillas.map((cuadrilla) => {
                return (
                  <Tr key={cuadrilla._id}>
                    <Td>{cuadrilla.nombre}</Td>
                    <Td>
                      {cuadrilla.brigadistas.map((brigadista) => (
                        <li key={brigadista.nombre}>
                          {" "}
                          {brigadista.nombre} {brigadista.apellido}
                        </li>
                      ))}
                    </Td>
                    <Td>{cuadrilla.sector}</Td>
                    <Td>
                      <Button
                        colorScheme="green"
                        onClick={() => actualizarCuadrilla(cuadrilla._id)}
                      >
                        Actualizar
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        colorScheme="red"
                        onClick={() => eliminarCuadrilla(cuadrilla._id)}
                      >
                        Eliminar
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>

      {/* EXPORTAR POR NOMBRE MODAL*/}

      <Modal isOpen={isOpenId} onClose={() => setIsOpenId(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Exportar por nombre</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Selecciona una cuadrilla"
              onChange={handleIdChange}
            >
              {cuadrillas.map((cuadrilla) => (
                <option key={cuadrilla._id} value={cuadrilla._id}>
                  {cuadrilla.nombre}
                </option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsOpenId(false)}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleExportID}>
              Exportar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
