import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Divider
} from "@chakra-ui/react";
import { deleteProductAction, getProductListV2 } from "./redux/actionCreators";
import { productdropdowndataSelector } from "./redux/selector";

interface DeleteProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const dispatch = useDispatch();
  const dropdownTableData = useSelector(productdropdowndataSelector);
  const deleteLoading = dropdownTableData?.deleteLoading;
  const deleteError = dropdownTableData?.deleteError;
  const deleteSuccess = dropdownTableData?.deleteSuccess;

  const handleDelete = useCallback(() => {
    if (product?.id) {
      console.log("Deleting product:", product.id);
      dispatch(deleteProductAction(product.id));
    }
  }, [product, dispatch]);

  // Handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      // Close modal
      onClose();
      // Refresh product list
      dispatch(getProductListV2({ page: 1, per_page: 10 }));
    }
  }, [deleteSuccess, onClose, dispatch]);

  return (
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
          {deleteError && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <Text mb={4} color="red.600" fontWeight="bold">
            Are you sure you want to delete this product? This action cannot be undone.
          </Text>

          <Box p={4} bg="gray.50" borderRadius="md">
            <Text style={{ fontWeight: "bold" }} mb="8px">
              SKU
            </Text>
            <Text mb="8px">{product?.sku || 'N/A'}</Text>

            <Text style={{ fontWeight: "bold" }} mb="8px">
              Name
            </Text>
            <Text mb="8px">{product?.name || 'N/A'}</Text>

            <Text style={{ fontWeight: "bold" }} mb="8px">
              Description
            </Text>
            <Text mb="8px">{product?.description || 'N/A'}</Text>

            <Text style={{ fontWeight: "bold" }} mb="8px">
              Primary Unit
            </Text>
            <Text mb="8px">{product?.primaryUnit || 'N/A'}</Text>

            <Text style={{ fontWeight: "bold" }} mb="8px">
              UPC Code
            </Text>
            <Text mb="8px">{product?.upc || 'N/A'}</Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style={{ backgroundColor: "red", color: "white" }}
            variant="ghost"
            isLoading={deleteLoading}
            loadingText="Deleting..."
            disabled={deleteLoading}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
