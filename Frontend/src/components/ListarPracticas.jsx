import { Container, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Button, Textarea, Modal, ModalBody, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link, Navigate } from "react-router-dom";
import { Global } from '../helpers/Global';
import { CrearPractica } from '../components/crearPractica'
import { useEffect, useState } from "react";
import axios from "axios";
import { ActualizarPractica } from '../components/actualizarPractica'
import Swal from 'sweetalert2';

export const ListarPractica = () => {
  const [practicas, setPracticas] = useState([]);
  const [comentarios, setComentarios] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenComentarios, setIsOpenComentarios] = useState(false);
  const [comentarioIndex, setComentarioIndex] = useState(0);
  const [selectedPracticaIndex, setSelectedPracticaIndex] = useState(null);
  const [siguiente, setSiguiente] = useState(true);
  const [largoComentarios, setLargoComentarios] = useState(null);
  const [existeComentario, setExisteComentario] = useState(false);
  const [actualizar, setActualizar] = useState(false);
  const [newPractica, setNewPractica] = useState([]);
  const [isOpenEditar, setIsOpenEditar] = useState(false);
  const [comentarioEditado, setComentarioEditado] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    getPracticas();
  }, []);

  const getPracticas = async () => {
    const request = await fetch(Global.url + 'getPractica', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();

    console.log("aqui vamos 1", practicas);

    if (data.status === 'success') {
      setPracticas(data.practica);
    }
  }


  const handleComentar = (index) => {
    setSelectedPracticaIndex(index);


    setIsOpen(true);
  };

  const handleSubmitComentario = () => {



    //validaciones
    if (comentarios.trim() === '') {

      return alert("El comentario no puede estar vacío. ");
    }

    if (comentarios.length < 50) {

      return alert("El comentario es demasiado corto, minimo 50 caracteres");
    }


    const comentarioData = {
      contenido: comentarios,
      practica: practicas[selectedPracticaIndex]._id
    };


    axios.post(Global.url + 'feedback', comentarioData)
      .then((response) => {
        console.log('Comentario guardado:', response.data);
        setComentarios('');
        setIsOpen(false);
        axios.get(Global.url + 'addComentario/' + practicas[selectedPracticaIndex]._id);
        getPracticas();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error al guardar el comentario en el backend:', error);
      });
    return alert("Comentario registrado con éxito");

  };



  const CantidadComentarios = (index) => {

    setLargoComentarios(practicas[index].comentarios.reduce(
      (total, comentario) => total + comentario.length, 0

    ));


  }


  const handleVerComentarios = (index, practica) => {
    setSelectedPracticaIndex(index);
    setIsOpenComentarios(true);
    setComentarioIndex(0);


    if (practica.comentarios[0].length === 0) {

      setExisteComentario(false);
    } else {
      setExisteComentario(true);
    }


  };


  const handleNextComentario = () => {




    if (largoComentarios > 0) {

      if (comentarioIndex === largoComentarios - 1) {
        setSiguiente(false);
      } else {
        setComentarioIndex(comentarioIndex + 1);
        setSiguiente(true);
      }
    } else {
      setSiguiente(false);
    }


  };


  const handlePrevComentario = () => {


    if (comentarioIndex === 0) {
      return;
    }
    setComentarioIndex(comentarioIndex - 1);
    if (comentarioIndex !== largoComentarios)
      setSiguiente(true);

  };

  const handleExport = () => {
    let url;
    url = "http://146.83.198.35:1050/api/exportPracticas";

    window.location.href = url;
  };

  const handleDeleteComentario = () => {

    const comentarioDelete = practicas[selectedPracticaIndex].comentarios[0][comentarioIndex]._id;

    console.log("linea 153: ", comentarioDelete);


    if (window.confirm("¿Está seguro de esta acción? ")) {

      axios.delete(Global.url + 'deleteFeedback/' + comentarioDelete)
        .then((response) => {
          console.log('Comentario eliminado:', response.data);
          setComentarios('');
          setIsOpen(false);
          axios.get(Global.url + 'addComentario/' + practicas[selectedPracticaIndex]._id);
          getPracticas();
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error al guardar el comentario en el backend:', error);
        });
      return alert("Comentario eliminado con exito");

    }

  }

  const handleComentarioEditado = () => {

    if (comentarioEditado.trim() === '') {

      return alert("El comentario no puede estar vacío. ");
    }

    if (comentarioEditado.length < 50) {

      return alert("El comentario es demasiado corto, minimo 50 caracteres");
    }

    const newComentario = {
      contenido: comentarioEditado
    }

    axios.put(Global.url + 'updateFeedback/' + practicas[selectedPracticaIndex].comentarios[0][comentarioIndex]._id, newComentario)
      .then((response) => {
        console.log('Comentario actualizado: ', response.data);
        setComentarioEditado('');
        setIsOpenEditar(false);
        axios.get(Global.url + 'addComentario/' + practicas[selectedPracticaIndex]._id);
        getPracticas();
        setIsOpenEditar(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error al guardar el comentario en el backend:', error);
      });
    return alert("Comentario editado con exito");

  }


  const enviarCorreoACuadrilla = async (practica) => {
    try {
      const request = await fetch(Global.url + `enviar-correo-cuadrilla-practica/${practica._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await request.json();
      console.log(data); // Puedes mostrar una alerta o mensaje para indicar que se enviaron los correos
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Correo enviado exitosamente',
      });
    } catch (error) {
      console.error('Error al enviar correos:', error);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Correo enviado exitosamente',
      });
    }
  };

  const handleEditarPractica = (practica) => {
    setNewPractica(practica);
    setIsEditing(true);
    console.log(isEditing)

  };

  if (isEditing) {
    console.log(isEditing)
    return <ActualizarPractica practica={newPractica} setIsEditing={setIsEditing} />;
  }

  const handleEliminarPractica = async (practicaId) => {
    try {
      // Puedes mostrar una confirmación al usuario antes de eliminar la práctica
      if (window.confirm("¿Está seguro de eliminar esta práctica?")) {
        await axios.delete(Global.url + `deletePractica/${practicaId}`);
        // Realiza una nueva solicitud para actualizar la lista de prácticas después de eliminar
        getPracticas();
        // Muestra una notificación de éxito (puedes usar react-toastify como lo mencioné antes)
        toast.success("Práctica eliminada exitosamente");
      }
    } catch (error) {
      // Muestra una notificación de error si algo sale mal (puedes usar react-toastify como lo mencioné antes)
      toast.error("Error al eliminar la práctica");
    }
  };


  return (
    <>
      <Heading as={'h1'}  fontSize='2em' textAlign='center' pb={'10'}>Practicas realizadas</Heading>
      <Container maxW='container.2xl'>

      <Container maxW='container.xl' display='flex' justifyContent='flex-end'>
      <Button colorScheme="teal">
              <Link to={"/inicio/crearPractica"}>Crear practica</Link>
            </Button>
           <Button colorScheme="teal" variant="outline" onClick={handleExport} ml={2}>Exportar CSV</Button>
          </Container>

        <TableContainer pb={'100'}>
          <Table variant='striped' colorScheme='teal'>
            <Thead>
              <Tr>
                <Th>Nombre práctica</Th>
                <Th>Fecha</Th>
                <Th>Descripcion</Th>
                <Th>Lugar</Th>
                <Th> </Th>
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {practicas.map((practica, index) => {
                return (
                  <Tr key={practica._id}>
                    <Td>{practica.nombre_practica}</Td>
                    <Td>{practica.fecha}</Td>
                    <Td>{practica.descripcion}</Td>
                    <Td>{practica.lugar}</Td>
                    <Td>
                      <Button colorScheme="blue" onClick={() => { handleVerComentarios(index, practica), CantidadComentarios(index) }}>Ver comentarios</Button>
                    </Td>
                    <Td>
                      <Button colorScheme='blue' onClick={() => { handleComentar(index) }}>Comentar</Button>
                    </Td>
                    <Td>
                      <Button colorScheme='yellow' onClick={() => handleEditarPractica(practica)}>Modificar</Button>
                    </Td>
                    <Td>
                      <Button colorScheme="purple" onClick={() => enviarCorreoACuadrilla(practica)}>Enviar correo a la cuadrilla</Button>
                    </Td>
                    <Td>
                      <Button colorScheme="red" onClick={() => handleEliminarPractica(practica._id)}>Eliminar</Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comentar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} placeholder="Escribe tu comentario aquí..." />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button colorScheme="green" onClick={handleSubmitComentario}>Enviar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenComentarios} onClose={() => { setIsOpenComentarios(false), setSiguiente(true), setLargoComentarios(null), setExisteComentario(false) }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Comentarios </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant='striped' colorScheme='teal'>
              <Thead>
                <Tr>
                  <Th>Comentarios</Th>
                </Tr>
              </Thead>
              <Tbody>

                {selectedPracticaIndex !== null &&
                  practicas[selectedPracticaIndex].comentarios.map((comentario, index) => (
                    <Tr key={index}>
                      {console.log("index practicaA: " + selectedPracticaIndex)}




                      {

                        existeComentario ? <Td> {comentario[comentarioIndex].contenido}</Td> : <Td> No hay comentarios existentes </Td>
                      }






                    </Tr>
                  ))}

              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" mr={3} leftIcon={<EditIcon />}
              onClick={() => { setComentarioEditado(practicas[selectedPracticaIndex].comentarios[0][comentarioIndex].contenido), setIsOpenComentarios(false), setIsOpenEditar(true) }}>
            </Button>
            <Button colorScheme="red" mr={3} leftIcon={<DeleteIcon />} onClick={handleDeleteComentario} isDisabled={!existeComentario}>


            </Button>
            <Button colorScheme="blue" mr={3} onClick={handlePrevComentario} isDisabled={comentarioIndex === 0}>
              <ChevronLeftIcon />
            </Button>
            {
              siguiente ? <Button colorScheme="blue" mr={3} onClick={handleNextComentario}  >
                <ChevronRightIcon />
              </Button> :
                <Button colorScheme="blue" mr={3} onClick={handleNextComentario} isDisabled>
                  <ChevronRightIcon />
                </Button>

            }

            <Button colorScheme="blue" mr={3} onClick={() => { setIsOpenComentarios(false), setSiguiente(true), setLargoComentarios(null), setExisteComentario(false) }}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEditar} onClose={() => setIsOpenEditar(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar comentario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>


            <Textarea value={comentarioEditado} onChange={(e) => setComentarioEditado(e.target.value)} placeholder={comentarioEditado ? '' : "Escribe tu comentario aquí..."} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { setIsOpenEditar(false), setIsOpenComentarios(true) }}>Cancelar</Button>

            <Button colorScheme="green" onClick={handleComentarioEditado}>Enviar</Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  )
}

