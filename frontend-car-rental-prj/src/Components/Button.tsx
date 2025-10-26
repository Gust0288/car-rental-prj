import { Button as ChakraButton } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CustomButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button = ({ 
  children, 
  variant = "primary", 
  fullWidth = false,
  size = "md",
  onClick,
  disabled,
  type = "button"
}: CustomButtonProps) => {
  
  const getVariantProps = () => {
    switch (variant) {
      case "primary":
        return {
          colorScheme: "blue",
          bg: "blue.500",
          color: "white",
          _hover: { bg: "blue.600" },
          _active: { bg: "blue.700" }
        };
      case "secondary":
        return {
          bg: "gray.500",
          color: "white",
          _hover: { bg: "gray.600" },
          _active: { bg: "gray.700" }
        };
      case "outline":
        return {
          variant: "outline",
          borderColor: "blue.500",
          color: "blue.500",
          _hover: { bg: "blue.50", borderColor: "blue.600" },
          _active: { bg: "blue.100" }
        };
      case "ghost":
        return {
          variant: "ghost",
          color: "gray.600",
          _hover: { bg: "gray.100" },
          _active: { bg: "gray.200" }
        };
      case "danger":
        return {
          bg: "red.500",
          color: "white",
          _hover: { bg: "red.600" },
          _active: { bg: "red.700" }
        };
      default:
        return {};
    }
  };

  return (
    <ChakraButton
      size={size}
      width={fullWidth ? "100%" : "auto"}
      borderRadius="md"
      fontWeight="medium"
      transition="all 0.2s"
      _focus={{ boxShadow: "outline" }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...getVariantProps()}
    >
      {children}
    </ChakraButton>
  );
};