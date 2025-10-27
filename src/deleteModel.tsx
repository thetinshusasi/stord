import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sentDropdownResponse } from "./redux/actionCreators";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Input,
  FormControl,
  FormLabel,
  Select
} from "@chakra-ui/react";
import { productdataSelector } from "./redux/selector";
export const AddProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = useCallback(() => {}, []);

  return (
    <>
      <Button
        style={{ color: "white", backgroundColor: "blue" }}
        onClick={onOpen}
      >
        Create Product
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ paddingTop: "10px", fontWeight: "bold" }}>
            Delete Product
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              SKU
            </Text>
            <Text mb="8px">{}</Text>
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              Name
            </Text>
            <Text mb="8px">{}</Text>
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              Description
            </Text>
            <Text mb="8px">{}</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: "red", color: "white" }}
              variant="ghost"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
