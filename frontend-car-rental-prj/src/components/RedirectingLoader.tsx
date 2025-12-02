import { Container, VStack, Spinner, Text } from '@chakra-ui/react';

interface RedirectingLoaderProps {
  message?: string;
  maxW?: string;
  py?: number | { base?: number; md?: number };
}

export const RedirectingLoader = ({ 
  message = "Redirecting…", 
  maxW = "md", 
  py = 16 
}: RedirectingLoaderProps) => {
  return (
    <Container maxW={maxW} py={py}>
      <VStack gap={4} align="center">
        <Spinner size="lg" color="blue.500" />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Container>
  );
};
