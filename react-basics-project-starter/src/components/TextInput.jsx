import { Input } from "@chakra-ui/react";

export const TextBox = ({ onChange, ...props }) => (
  <Input
    placeholder="Search recipes"
    size="md"
    variant="Outline"
    width="30%"
    onChange={onChange}
    {...props}
  />
);
