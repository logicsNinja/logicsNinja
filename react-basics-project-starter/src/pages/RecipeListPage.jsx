import { Box, Heading, VStack } from "@chakra-ui/react";
import { data } from "../utils/data";
import { TextBox } from "../components/TextInput";
import { useState } from "react";
import { RecipeItems } from "./RecipeItems";

export const RecipeListPage = ({ onClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const matchedRecipes = data.hits.filter((recipe) => {
    if (!searchTerm) return true;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const recipeName = recipe.recipe.label.toLowerCase();
    const healthLabels = recipe.recipe.healthLabels.map((label) =>
      label.toLowerCase()
    );

    return (
      recipeName.includes(lowerCaseSearchTerm) ||
      healthLabels.some((label) => label.includes(lowerCaseSearchTerm))
    );
  });

  console.log("Matched recipes:", matchedRecipes);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <VStack spacing={4} align="center" h="100vh" p={4}>
      <Box>
        <Heading color="white" mb={6}>
          Winc Recipe Checker
        </Heading>
      </Box>
      <Box>
        <TextBox
          mb={6}
          onChange={handleChange}
          w={{ base: "85%", md: "500px" }}
        />
      </Box>
      <RecipeItems recipe={matchedRecipes} onClick={onClick} />
    </VStack>
  );
};
