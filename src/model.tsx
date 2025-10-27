import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProductAction, getProductListV2 } from "./redux/actionCreators";
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
  Select,
  Alert,
  AlertIcon,
  AlertDescription
} from "@chakra-ui/react";
import { productdropdowndataSelector } from "./redux/selector";
export const AddProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [primaryUnit, setPrimary_unit] = useState("");
  const [description, setDescription] = useState("");
  const [upc, setUpc] = useState("");

  const dropdownTableData = useSelector(productdropdowndataSelector);
  const tableData = dropdownTableData?.data?.data;
  const createLoading = dropdownTableData?.createLoading;
  const createError = dropdownTableData?.createError;
  const createSuccess = dropdownTableData?.createSuccess;

  console.log("tableData", tableData);
  const unique: string[] = Array.from(new Set(tableData?.map((data: any) => data.primaryUnit) || []));
  console.log("unique", unique);

  const handleSkuChange = (e: any) => {
    setSku(e.target.value);
  };
  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };
  const handlePrimaryChange = (e: any) => {
    setPrimary_unit(e.target.value);
  };
  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };
  const handleUpcChange = (e: any) => {
    setUpc(e.target.value);
  };

  const handleSubmit = useCallback(() => {
    if (!sku || !name || !primaryUnit) {
      return;
    }

    console.log("Creating product:", { sku, name, primaryUnit, description, upc });
    dispatch(
      createProductAction({
        sku: sku,
        name: name,
        primary_unit: primaryUnit, // Send snake_case as expected by API
        description: description,
        upc: upc
      })
    );
  }, [sku, name, primaryUnit, description, upc, dispatch]);

  // Handle successful creation
  useEffect(() => {
    if (createSuccess) {
      // Reset form
      setSku("");
      setName("");
      setPrimary_unit("");
      setDescription("");
      setUpc("");
      // Close modal
      onClose();
      // Refresh product list
      dispatch(getProductListV2({ page: 1, per_page: 10 }));
    }
  }, [createSuccess, onClose, dispatch]);

  // Reset success state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset any previous success/error states
    }
  }, [isOpen]);

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
            Create Product
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {createError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}

            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              SKU *
            </Text>
            <Input
              value={sku}
              onChange={handleSkuChange}
              placeholder="SKU"
              size="sm"
              isRequired
            />
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              NAME *
            </Text>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="NAME"
              size="sm"
              isRequired
            />
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              Description
            </Text>
            <Input
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Description"
              size="sm"
            />
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              UPC Code
            </Text>
            <Input
              value={upc}
              onChange={handleUpcChange}
              placeholder="UPC Code"
              size="sm"
            />

            <FormControl style={{ paddingTop: "10px", fontWeight: "bold" }}>
              <FormLabel style={{ fontWeight: "bold" }}>
                Primary unit of measure *
              </FormLabel>
              <Select
                onChange={handlePrimaryChange}
                id="unique"
                placeholder="Primary unit of measure"
                value={primaryUnit}
                isRequired
              >
                {unique.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} disabled={createLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: "blue", color: "white" }}
              variant="ghost"
              isLoading={createLoading}
              loadingText="Creating..."
              disabled={!sku || !name || !primaryUnit || createLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
