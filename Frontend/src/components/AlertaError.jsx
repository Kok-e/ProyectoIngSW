import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"

export const AlertaError = ({mensaje}) => {

    const {
        isOpen: isVisible,
        onClose,
    } = useDisclosure({ defaultIsOpen: true })
    return isVisible ? (
        <Alert status='error'>
            <AlertIcon />
            <Box>
                <AlertTitle>Error!</AlertTitle>
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
