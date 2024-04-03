import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, useDisclosure } from "@chakra-ui/react"

export const AlertaSuccess = ({mensaje}) => {
    console.log(mensaje)
    const {
        isOpen: isVisible,
        onClose,
    } = useDisclosure({ defaultIsOpen: true })
    return isVisible ? (
        <Alert status='success'>
            <AlertIcon />
            <Box>
                <AlertTitle>Éxito!</AlertTitle>
                <AlertDescription>
                    {mensaje}
                </AlertDescription>
            </Box>
            <CloseButton
                alignSelf='flex-start'
                position='relative'
                right={-1}
                top={-1}
                onClick={onClose}
            />
        </Alert>
    ) : ''
}
