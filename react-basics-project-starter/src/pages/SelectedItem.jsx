import { InfoItem } from "../components/ui/InfoText";
import {
  Center,
  Image,
  Heading,
  Box,
  Flex,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";

export const RecipeSelected = ({ recipe, onBackClick }) => {
  const boxWidth = useBreakpointValue({
    base: "100%",
    md: "600px",
    lg: "800px",
  });
  const imageHeight = useBreakpointValue({
    base: "200px",
    md: "250px",
    lg: "300px",
  });
  const flexDirection = useBreakpointValue({ base: "column", lg: "row" });

  const formatNutrientValue = (nutrient) => {
    return nutrient
      ? `${nutrient.quantity.toFixed(2)} ${nutrient.unit}`
      : "N/A";
  };

  // Haal de relevante voedingsinformatie op
  const { ENERC_KCAL, PROCNT, FAT, CHOCDF, CHOLE, NA } =
    recipe.recipe.totalNutrients;

  return (
    <Center>
      <Box
        mb={8}
        p={4}
        borderWidth="1px"
        borderRadius="md"
        width={boxWidth}
        height="auto"
        overflow="hidden"
        boxShadow="md"
        bg="white"
        maxH="95vh"
        overflowY="auto"
      >
        <Button mb={4} colorScheme="blue" onClick={onBackClick}>
          Back to recipes
        </Button>
        <Image
          src={recipe.recipe.image}
          alt={recipe.recipe.label}
          width="100%"
          height={imageHeight}
          mb={4}
        />

        <Center>
          <Heading as="h2" fontSize="xl" mb={4}>
            {recipe.recipe.label}
          </Heading>
        </Center>
        <Flex direction={flexDirection} wrap="wrap" justifyContent="center">
          <Box mb={4} flex="1" minWidth="280px">
            <InfoItem
              label="Total cooking time"
              value={
                recipe.recipe.totalTime
                  ? `${recipe.recipe.totalTime} minutes`
                  : "No time provided"
              }
            />
            <InfoItem label="Servings" value={recipe.recipe.yield} />
            <InfoItem
              label="Ingredients"
              value={recipe.recipe.ingredientLines.join(", ")}
            />
            <Heading as="h2" size="sm" my={4}>
              Total nutrients:
            </Heading>
            <InfoItem label="Energy" value={formatNutrientValue(ENERC_KCAL)} />
            <InfoItem label="Protein" value={formatNutrientValue(PROCNT)} />
            <InfoItem label="Fat" value={formatNutrientValue(FAT)} />
            <InfoItem label="Carbs" value={formatNutrientValue(CHOCDF)} />
            <InfoItem label="Cholesterol" value={formatNutrientValue(CHOLE)} />
            <InfoItem label="Sodium" value={formatNutrientValue(NA)} />
          </Box>
          <Box flex="1" minWidth="280px">
            <InfoItem
              label="Diet label"
              value={recipe.recipe.dietLabels.join(", ")}
            />
            <InfoItem
              label="Cautions"
              value={recipe.recipe.cautions.join(", ")}
            />
            <InfoItem
              label="Meal type"
              value={recipe.recipe.mealType.join(", ")}
            />
            <InfoItem
              label="Dish type"
              value={recipe.recipe.dishType.join(", ")}
            />
            <InfoItem
              label="Health label"
              value={recipe.recipe.healthLabels.join(", ")}
            />
          </Box>
        </Flex>
      </Box>
    </Center>
  );
};
