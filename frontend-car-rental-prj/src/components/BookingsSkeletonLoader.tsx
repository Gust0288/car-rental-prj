import { Box, Container, SimpleGrid, VStack, Skeleton } from "@chakra-ui/react";

interface BookingsSkeletonLoaderProps {
  count?: number;
  columns?: { base: number; md?: number; lg?: number };
}

export const BookingsSkeletonLoader = ({ 
  count = 3, 
  columns = { base: 1, md: 2, lg: 3 } 
}: BookingsSkeletonLoaderProps) => {
  return (
    <Container maxW="6xl" py={12}>
      <Skeleton height="40px" width="240px" mb={6} />
      <SimpleGrid columns={columns} gap={6}>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} p={6} borderRadius="lg" bg="white" shadow="sm">
            <Skeleton height="180px" borderRadius="md" mb={4} />
            <VStack align="stretch" gap={3}>
              <Skeleton height="14px" width="70%" />
              <Skeleton height="14px" width="50%" />
              <Skeleton height="14px" width="60%" />
              <Skeleton height="14px" width="40%" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};
