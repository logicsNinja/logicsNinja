import React, { useState, useEffect } from "react";
import {
  Box,
  Icon,
  Spinner,
  Heading,
  Grid,
  VStack,
  Image,
  Text,
  Button,
  Flex,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "../dateUtils";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });

    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => {
        const categoryMap = data.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCategories(categoryMap);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleAddEvent = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newUser = {
      name: formData.get("creatorName"),
      image: formData.get("creatorImage"),
    };

    try {
      const userResponse = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to create user");
      }
      const userData = await userResponse.json();

      const newEvent = {
        createdBy: userData.id,
        title: formData.get("title"),
        description: formData.get("description"),
        image: formData.get("image"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        categoryIds: [parseInt(formData.get("category"))],
      };

      const eventResponse = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!eventResponse.ok) {
        throw new Error("Failed to create event");
      }
      const eventData = await eventResponse.json();
      setEvents([...events, eventData]);
      onClose();
      toast({
        title: "Event Added",
        description: "The event has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory
      ? event.categoryIds.includes(parseInt(filterCategory))
      : true;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={{ base: 3, md: 5 }} bg="gray.100" minHeight="100vh">
      <Flex
        justifyContent="center"
        alignItems="center"
        mb={4}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Heading
          color="blue.500"
          size={{ base: "lg", md: "xl" }}
          mb={{ base: 4, md: 0 }}
        >
          List of Events
        </Heading>
      </Flex>
      <Flex justifyContent="center" mb={4}>
        <Input
          bgColor="blue.500"
          color="gray.100"
          placeholder="Search events"
          sx={{
            "::placeholder": {
              color: "primary.100",
            },
          }}
          value={searchQuery}
          onChange={handleSearchChange}
          width="300px"
          size={{ base: "sm", md: "md" }}
          mr={2}
        />
        <Select
          bgColor="blue.500"
          color="gray.100"
          size={{ base: "sm", md: "md" }}
          placeholder="Filter on category"
          onChange={handleFilterChange}
          width="300px"
          mr={2}
          sx={{
            option: {
              color: "gray.700",
            },
          }}
        >
          <option value="1">Sports</option>
          <option value="2">Games</option>
          <option value="3">Relaxation</option>
        </Select>
        <Button
          bgColor="blue.500"
          color="white"
          size={{ base: "sm", md: "md" }}
          _hover={{ bgColor: "blue.600" }}
          onClick={onOpen}
        >
          Add event
        </Button>
      </Flex>

      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }}
        gap={6}
      >
        {filteredEvents.map((event) => (
          <Link
            to={`/event/${event.id}`}
            key={event.id}
            style={{ textDecoration: "none" }}
          >
            <VStack
              align="stretch"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              shadow="sm"
              h="auto"
              transition="transform 0.3s, shadow 0.3s"
              _hover={{
                transform: "scale(1.03)",
                shadow: "md",
              }}
            >
              <Image
                src={event.image}
                alt={event.title}
                width="100%"
                height="200px"
                objectFit="cover"
              />
              <Box p={5}>
                <Heading size="sm" mb={2} color="primary.500" isTruncated>
                  {event.title} - {event.description}
                </Heading>
                <Text mb={2} color="gray.500">
                  Category:{" "}
                  {event.categoryIds.map((id) => categories[id]).join(", ")}
                </Text>
                <Box display="flex" alignItems="center" mt={2}>
                  <Icon as={FaCalendarAlt} color="gray.500" />
                  <Text ml={2} fontSize="sm" color="gray.500">
                    Start: {formatDate(event.startTime)}
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Icon as={FaCalendarAlt} color="gray.500" />
                  <Text ml={2} fontSize="sm" color="gray.500" isTruncated>
                    End: {formatDate(event.endTime)}
                  </Text>
                </Box>
              </Box>
            </VStack>
          </Link>
        ))}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader color="blue.500">New Event</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleAddEvent}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel color="gray.500">Title</FormLabel>
                <Input name="title" type="text" required />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel color="gray.500">Description</FormLabel>
                <Input name="description" type="text" required />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel color="gray.500">Starttime</FormLabel>
                <Input name="startTime" type="datetime-local" required />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel color="gray.500">Endtime</FormLabel>
                <Input name="endTime" type="datetime-local" required />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel color="gray.500">Picture-URL</FormLabel>
                <Input name="image" type="url" required />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel color="gray.500">Category</FormLabel>
                <Select name="category" required>
                  <option value="2">Games</option>
                  <option value="3">Relaxation</option>
                  <option value="1">Sporten</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Creator Name</FormLabel>
                <Input name="creatorName" type="text" required />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Image URL Creator</FormLabel>
                <Input name="creatorImage" type="url" required />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button colorScheme="blue" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};
