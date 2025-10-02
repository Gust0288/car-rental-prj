import { HStack, Image } from "@chakra-ui/react";
import logo from "../assets/logo.webp";


export const NavBar = () => {
  return (
    <HStack justifyContent={"space-between"} padding={4}>
      <Image src={logo} boxSize="60px" />
    </HStack>
  );
};
