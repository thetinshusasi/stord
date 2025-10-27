import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productdataSelector, productdropdowndataSelector, productdropdowndataV1Selector } from "./redux/selector";
import { ChakraProvider } from "@chakra-ui/react";
import { getPage, getProductListV2, getProductListV1 } from "./redux/actionCreators";
import Moment from "moment";
import {
  Button,
  ButtonGroup,
  Heading,
  InputGroup,
  Input,
  InputLeftElement,
  Select
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { DataTable } from "./table";
import "./styles.css";
//import { columns } from "./redux/constants";
import { AddProduct } from "./model";
import { DeleteProductModal } from "./deleteModel";

const App = () => {
  const dispatch = useDispatch();
  // Comment out old API data usage
  // const mainTableData = useSelector(productdataSelector);
  // const { quickFilterInput } = useSelector(productdataSelector);

  // Use both v1 and v2 data
  const productV1Data = useSelector(productdropdowndataV1Selector);
  const productV2Data = useSelector(productdropdowndataSelector);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showV1V2, setShowV1V2] = useState(false); // Toggle for bonus feature

  // Combine v1 and v2 data for bonus feature
  const v1Data = productV1Data?.data?.data || [];
  const v2Data = productV2Data?.data?.data || [];
  const combinedData = showV1V2 ? [...v1Data, ...v2Data] : v2Data;

  // Use combined data structure
  const dataTable = combinedData;
  const total_pages = showV1V2
    ? Math.max(productV1Data?.data?.total_pages || 0, productV2Data?.data?.total_pages || 0)
    : productV2Data?.data?.total_pages;
  const total = showV1V2
    ? (productV1Data?.data?.total || 0) + (productV2Data?.data?.total || 0)
    : productV2Data?.data?.total;
  const loading = productV1Data?.loading || productV2Data?.loading;
  const error = productV1Data?.error || productV2Data?.error;

  console.log("dataTable", dataTable);
  console.log("error state:", error);
  console.log("loading state:", loading);
  const [search, setSearch] = useState("");
  const [data, setFilteredData] = useState([]);
  const [deleteData, setDeleteData] = useState(dataTable);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const next = () => (page < total_pages ? setPage(page + 1) : page);
  let previous = () => (page > 1 ? setPage(page - 1) : 1);

  // Constants
  const LOADING_TEXT = "Loading products...";
  const NO_PRODUCTS_TEXT = "No products found";
  const TRY_AGAIN_TEXT = "Try Again";

  // Complex conditions
  const hasData = Array.isArray(data) && data.length > 0;
  const paginationText = loading ? LOADING_TEXT : `Page ${page} of ${total_pages} (${total} total items)`;

  // Service-side search implementation (bonus feature)
  useEffect(() => {
    if (search) {
      // Query service for updated records
      dispatch(
        getProductListV2({
          page: 1,
          per_page: pageSize,
          search: search
        })
      );
    } else {
      // Reset to normal data when search is cleared
      setFilteredData(dataTable);
    }
  }, [search, dispatch, pageSize]);

  // Client-side filtering for combined v1/v2 data
  useEffect(() => {
    if (!search) {
      setFilteredData(dataTable);
    }
  }, [dataTable, search]);

  useEffect(() => {
    console.log("dispatch product v2", page, pageSize);

    // Fetch v2 data
    dispatch(
      getProductListV2({
        page: page,
        per_page: pageSize,
        search: search || undefined
      })
    );

    // Fetch v1 data for bonus feature
    if (showV1V2) {
      dispatch(
        getProductListV1({
          page: page,
          per_page: pageSize
        })
      );
    }
  }, [page, pageSize, showV1V2, dispatch]);

  // Reset to page 1 when error occurs
  useEffect(() => {
    if (error && page !== 1) {
      setPage(1);
    }
  }, [error, page]);

  // Retry function
  const handleRetry = () => {
    dispatch(
      getProductListV2({
        page: page,
        per_page: pageSize,
        search: search || undefined
      })
    );

    if (showV1V2) {
      dispatch(
        getProductListV1({
          page: page,
          per_page: pageSize
        })
      );
    }
  };

  const columns = [
    {
      Header: "SKU & Name",
      id: "skuAndName",
      accessorFn: (d: any) => `${d.sku} - ${d.name}`,
      cell: (tableProps: any) => (
        <div>
          <div style={{ fontWeight: "bold", color: "blue" }}>
            {tableProps.row.original.sku}
          </div>
          <div style={{ fontSize: "0.9em", color: "gray" }}>
            {tableProps.row.original.name}
          </div>
        </div>
      )
    },
    {
      Header: "Primary Unit",
      accessorKey: "primaryUnit",
      id: "primaryUnit"
    },
    {
      Header: "UPC Code",
      accessorKey: "upc",
      id: "upc"
    },
    {
      Header: "Description",
      accessorKey: "description",
      id: "description"
    },
    {
      Header: "Last Updated",
      id: "lastUpdated",
      accessorFn: (d: any) => {
        return Moment(d.updatedAt).local().format("MM/DD/YYYY");
      }
    },
    {
      Header: "Delete",
      id: "delete",
      accessorFn: (str: any) => "delete",
      cell: (tableProps: any) => (
        <span
          style={{
            cursor: "pointer",
            color: "red",
            textDecoration: "underline"
          }}
          onClick={() => {
            console.log("tableProps", tableProps.row);
            setSelectedProduct(tableProps.row.original);
            setDeleteModalOpen(true);
          }}
        >
          Delete
        </span>
      )
    }
  ];
  return (
    <div style={{ padding: "30px" }}>
      <ChakraProvider>
        <Heading style={{ paddingBottom: "10px", fontSize: "30px" }}>
          {" "}
          Products
        </Heading>
        <div style={{ paddingBottom: "10px", maxWidth: "350px" }}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              focusBorderColor="blue.400"
              placeholder="Search by SKU or name"
            />
          </InputGroup>
        </div>
        <div style={{ paddingBottom: "10px", maxWidth: "200px", marginLeft: "10px" }}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // Reset to first page when changing page size
            }}
            placeholder="Items per page"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </Select>
        </div>
        <div style={{ float: "right", marginTop: "-99px" }}>
          <AddProduct />
        </div>
        <div style={{ float: "right", marginTop: "-69px", marginRight: "120px" }}>
          <Button
            onClick={() => setShowV1V2(!showV1V2)}
            style={{
              backgroundColor: showV1V2 ? "green" : "gray",
              color: "white",
              fontSize: "12px",
              padding: "5px 10px"
            }}
            size="sm"
          >
            {showV1V2 ? "V1+V2" : "V2 Only"}
          </Button>
        </div>
        {!error && (
          <ButtonGroup
            style={{ float: "right", marginTop: "-49px" }}
            variant="outline"
            spacing="6"
          >
            <div
              style={{ margin: "7px -19px" }}
            > {paginationText}</div>
            <Button
              style={{
                margin: "0px -19px 0 22px",
                fontSize: "15px",
                width: "90px"
              }}
              onClick={previous}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              style={{ fontSize: "15px", width: "50px" }}
              onClick={next}
              disabled={page >= total_pages}
            >
              Next
            </Button>
          </ButtonGroup>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {LOADING_TEXT}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
            <div style={{ marginBottom: '10px' }}>
              Error: {error}
            </div>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleRetry}
              disabled={loading}
            >
              {loading ? LOADING_TEXT : TRY_AGAIN_TEXT}
            </Button>
          </div>
        ) : hasData ? (
          <DataTable columns={columns} data={data} />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {NO_PRODUCTS_TEXT}
          </div>
        )}

        <DeleteProductModal
          product={selectedProduct}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      </ChakraProvider>
    </div>
  );
};

export default App;
