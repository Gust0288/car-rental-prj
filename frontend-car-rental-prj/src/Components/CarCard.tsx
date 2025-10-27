import { Box, Image, Text, VStack } from "@chakra-ui/react";

interface CarCardProps {
  id: number;
  make: string;
  model: string;
  imageUrl?: string;
  onClick?: () => void;
}

const capitalizeString = (str: string) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

export const CarCard = ({ 
  make, 
  model, 
  imageUrl = "https://via.placeholder.com/300x200?text=No+Image", 
  onClick 
}: CarCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      cursor={onClick ? "pointer" : "default"}
      _hover={onClick ? { 
        shadow: "lg", 
        transform: "translateY(-2px)" 
      } : {}}
      onClick={onClick}
      position="relative"
    >
      {/* Car Image */}
      <Box position="relative" height="200px">
        <Image
          src={imageUrl}
          alt={`${make} ${model}`}
          width="100%"
          height="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
        />
        
        {/* Car Name Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bg="linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)"
          p={4}
        >
          <VStack align="start" spacing={0}>
            <Text 
              color="white" 
              fontSize="lg" 
              fontWeight="bold"
              textShadow="1px 1px 2px rgba(0,0,0,0.8)"
            >
              {capitalizeString(make)}
            </Text>
            <Text 
              color="white" 
              fontSize="md"
              textShadow="1px 1px 2px rgba(0,0,0,0.8)"
            >
              {capitalizeString(model)}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};