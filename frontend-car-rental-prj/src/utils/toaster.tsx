import { createToaster } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'


export const toaster = createToaster({
  placement: 'top-end',
})


export const TOAST_DURATIONS = {
  short: 3000,    
  medium: 5000,   
  long: 7000,     
  veryLong: 10000 
}

interface ToastProps {
  id?: string;
  type?: string;
  title?: ReactNode;
  description?: ReactNode;
}

export const renderToast = (toast: ToastProps) => (
  <Box
    key={toast.id}
    px={4}
    py={3}
    bg={
      toast.type === 'success' ? 'green.500' : 
      toast.type === 'error' ? 'red.500' : 
      toast.type === 'warning' ? 'orange.500' : 
      'blue.500'
    }
    color="white"
    borderRadius="md"
    boxShadow="lg"
  >
    {toast.title && <Box fontWeight="bold" mb={1}>{toast.title}</Box>}
    {toast.description && <Box fontSize="sm">{toast.description}</Box>}
  </Box>
)

