import { useState } from "react";
import { Center } from "@chakra-ui/react";
import { RecipeListPage } from "./pages/RecipeListPage";
import { RecipeSelected } from "./pages/SelectedItem";

export const App = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackClick = () => {
    setSelectedRecipe(null);
  };

  return (
    <Center h="100vh" flexDir="column">
      {selectedRecipe ? (
        <RecipeSelected recipe={selectedRecipe} onBackClick={handleBackClick} />
      ) : (
        <RecipeListPage onClick={handleRecipeClick} />
      )}
    </Center>
  );
};
