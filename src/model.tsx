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
  const dispatch = useDispatch();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [primaryUnit, setPrimary_unit] = useState("");
  const dropdownTableData = useSelector(productdataSelector);
  const tableData = dropdownTableData?.data?.data;
  console.log("tableData", tableData);
  //const unique = [...new Set(tableData.map( data => console.log(data.primary_unit)))];
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
  const handleSubmit = useCallback(() => {
    console.log("sku, name, primaryUnit", sku, name, primaryUnit);
    dispatch(
      sentDropdownResponse({
        sku: sku,
        name: name,
        primaryUnit: primaryUnit
      })
    );
  }, [sku, name, primaryUnit]);

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
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              SKU
            </Text>
            <Input
              value={sku}
              onChange={handleSkuChange}
              placeholder="SKU"
              size="sm"
            />
            <Text style={{ paddingTop: "10px", fontWeight: "bold" }} mb="8px">
              NAME
            </Text>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="NAME"
              size="sm"
            />

            <FormControl style={{ paddingTop: "10px", fontWeight: "bold" }}>
              <FormLabel style={{ fontWeight: "bold" }}>
                Primary unit of measure
              </FormLabel>
              <Select
                onChange={handlePrimaryChange}
                id="unique"
                placeholder="Primary unit of measure"
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
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: "blue", color: "white" }}
              variant="ghost"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
