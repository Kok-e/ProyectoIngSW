import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, CircularProgress } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Cargando = () => {
    const [cargando, setCargando] = useState(true);
    setTimeout(function () {
        setCargando(false)
    }, 1000);

    return (
        <>
            {cargando ?
                <CircularProgress isIndeterminate color='green.300' />
                : <div>
                    <Alert
                        status='success'
                        variant='subtle'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        textAlign='center'
                        height='200px'
                    >
                        <AlertIcon boxSize='40px' mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize='lg'>
                            Actualizado!!!
                        </AlertTitle>
                        <AlertDescription maxWidth='sm'>
                            El brigadista se ha actualizado de forma correcta
                        </AlertDescription>
                    </Alert>
                    <Button ml={630} mt={20} colorScheme='teal' size='lg'>
                        <Link to={'/inicio'}>Volver al inicio</Link>
                    </Button>
                    
                </div>
            }
        </>
    )
}
