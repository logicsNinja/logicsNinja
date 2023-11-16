import { Text } from "@chakra-ui/react";

export const InfoItem = ({ label, value }) => {
  return (
    <Text fontSize="md" mb={2}>
      <strong>{label}:</strong> {value}
    </Text>
  );
};
