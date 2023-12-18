import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, List, ListItem, Link } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box bg="gray.100" as="nav" p={4}>
      <List
        styleType="none"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <ListItem mr={6}>
          <Link
            as={RouterLink}
            to="/"
            color="blue.500"
            _hover={{ color: "blue.700", textDecoration: "none" }}
          >
            Events
          </Link>
        </ListItem>
        <ListItem>
          <Link
            as={RouterLink}
            to="/event/1"
            color="blue.500"
            _hover={{ color: "blue.700", textDecoration: "none" }}
          >
            Event
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};
