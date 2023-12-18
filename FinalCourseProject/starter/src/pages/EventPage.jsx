import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Image,
  Text,
  Flex,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { formatDate } from "../dateUtils";

export const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categories, setCategories] = useState({});
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setEditFormData(data);
        return fetch(`http://localhost:3000/users/${data.createdBy}`);
      })
      .then((response) => response.json())
      .then((userData) => {
        setCreator(userData);
        return fetch(`http://localhost:3000/categories`);
      })
      .then((response) => response.json())
      .then((categoryData) => {
        const categoryMap = categoryData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCategories(categoryMap);
      })
      .catch((error) => console.error("Error:", error));
  }, [eventId]);

  const handleEditOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editFormData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data);
        setEditModalOpen(false);
        toast({
          title: "Event Updated",
          description: "The event has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "Failed to Update Event",
          description: "There was an issue updating the event.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        navigate("/");
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "Failed to Delete Event",
          description: "There was an issue deleting the event.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (!event || !creator) return <Box>Loading...</Box>;

  const categoryNames = event.categoryIds
    .map((id) => categories[id])
    .join(", ");

  return (
    <Flex
      direction="column"
      align="center"
      p={5}
      minHeight="100vh"
      bg="gray.100"
    >
      <Box
        width={{ sm: "full", md: "2xl" }}
        bg="white"
        p={5}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading mb={4} color="blue.500" textAlign="center">
          {event.title}
        </Heading>
        <Image src={event.image} alt={event.title} mb={4} borderRadius="md" />
        <Text mb={2} textAlign="center" color="gray.500">
          Description: {event.description}
        </Text>
        <Text mb={2} textAlign="center" color="gray.500">
          Categories: {categoryNames}
        </Text>

        <Text ml={2} align="center" fontSize="sm" color="gray.500" isTruncated>
          Start: {formatDate(event.startTime)}
        </Text>

        <Text ml={2} align="center" fontSize="sm" color="gray.500" isTruncated>
          End: {formatDate(event.endTime)}
        </Text>

        {creator && (
          <Flex direction="column" align="center" mt={4}>
            <Text fontSize="lg" color="blue.500" fontWeight="bold">
              Created by: {creator.name}
            </Text>
            <Image
              src={creator.image}
              alt={creator.name}
              boxSize="100px"
              borderRadius="full"
              mt={2}
            />
          </Flex>
        )}
        <Flex justifyContent="center" mt={4}>
          <Button colorScheme="blue" mr={3} onClick={handleEditOpen}>
            Edit Event
          </Button>
          <Button colorScheme="red" onClick={() => setDeleteConfirmOpen(true)}>
            Delete Event
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEditSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={editFormData.title || ""}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={editFormData.image || ""}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Start Time</FormLabel>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={editFormData.startTime?.slice(0, 16) || ""}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>End Time</FormLabel>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={editFormData.endTime?.slice(0, 16) || ""}
                  onChange={handleEditChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save Changes
              </Button>
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
