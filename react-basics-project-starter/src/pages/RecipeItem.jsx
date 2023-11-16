import { InfoItem } from "../components/ui/InfoText";
import { Image, Heading, Box } from "@chakra-ui/react";
import { RecipeSelected } from "./SelectedItem";

export const RecipeItem = ({ recipe, onClick, isSelected }) => {
  const specialDietLabels = recipe.recipe.healthLabels.filter((label) =>
    ["Vegan", "Vegetarian"].includes(label)
  );

  if (isSelected) {
    return <RecipeSelected recipe={recipe} />;
  }

  return (
    <Box
      onClick={() => onClick(recipe)}
      mb={8}
      cursor={"pointer"}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      height="450px"
      overflow="hidden"
      boxShadow="md"
      bg="white"
      width="300"
    >
      <Image
        src={recipe.recipe.image}
        alt={recipe.recipe.label}
        width="100%"
        height="200px"
        mb={4}
      />
      <Heading as="h2" textAlign="center" fontSize="xl" mb={2}>
        {recipe.recipe.label}
      </Heading>
      <InfoItem
        label="Diet label"
        value={recipe.recipe.dietLabels.join(", ")}
      />
      <InfoItem label="Cautions" value={recipe.recipe.cautions.join(", ")} />
      <InfoItem label="Meal type" value={recipe.recipe.mealType.join(", ")} />
      <InfoItem label="Dish type" value={recipe.recipe.dishType.join(", ")} />
      {specialDietLabels.length > 0 && (
        <InfoItem label="Health Label" value={specialDietLabels.join(", ")} />
      )}
    </Box>
  );
};
