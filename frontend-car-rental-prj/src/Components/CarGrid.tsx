import { SimpleGrid, Text } from "@chakra-ui/react";
import { CarCard } from "./CarCard";

interface Car {
  id: number;
  make: string;
  model: string;
  img_path?: string;
}

interface CarGridProps {
  cars: Car[];
}

export const CarGrid = ({ cars }: CarGridProps) => {
  if (!cars || !Array.isArray(cars)) {
    return <Text>...Loading</Text>;
  }
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} w="100%">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          id={car.id}
          make={car.make}
          model={car.model}
          imageUrl={car.img_path}
        />
      ))}
    </SimpleGrid>
  );
};
