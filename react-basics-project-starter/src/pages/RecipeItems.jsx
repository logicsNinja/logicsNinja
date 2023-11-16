import { Center, SimpleGrid, Box } from "@chakra-ui/react";
import { RecipeItem } from "./RecipeItem";

export const RecipeItems = ({ recipe, onClick }) => {
  return (
    <Center>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="20px">
        {recipe.map((item) => (
          <Box
            key={item.recipe.label}
            width="350px" // Of een andere waarde die je wilt
            height="450px" // Of een andere waarde die je wilt
            mb={4}
            bg="white"
            overflow="hidden"
            borderRadius="lg"
            boxShadow="md" // Voeg hier de schaduw toe
            _hover={{ boxShadow: "lg" }} // Optionele hover-effect voor een grotere schaduw
          >
            <RecipeItem recipe={item} onClick={onClick} />
          </Box>
        ))}
      </SimpleGrid>
    </Center>
  );
};
