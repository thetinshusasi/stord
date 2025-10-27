import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productdataSelector, productdropdowndataSelector } from "./redux/selector";
import { ChakraProvider } from "@chakra-ui/react";
import { getPage, getProductListV2 } from "./redux/actionCreators";
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

const App = () => {
  const dispatch = useDispatch();
  // Comment out old API data usage
  // const mainTableData = useSelector(productdataSelector);
  // const { quickFilterInput } = useSelector(productdataSelector);

  // Use product v2 data instead
  const productV2Data = useSelector(productdropdowndataSelector);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Comment out old data structure
  // const dataTable = mainTableData?.data?.data;
  // const total_pages = mainTableData?.data?.total_pages;
  // const total = mainTableData?.data?.total;
  // const loading = mainTableData?.loading;
  // const error = mainTableData?.error;

  // Use product v2 data structure
  const dataTable = productV2Data?.data?.data;
  const total_pages = productV2Data?.data?.total_pages;
  const total = productV2Data?.data?.total;
  const loading = productV2Data?.loading;
  const error = productV2Data?.error;

  console.log("dataTable", dataTable);
  console.log("error state:", error);
  console.log("loading state:", loading);
  const [search, setSearch] = useState("");
  const [data, setFilteredData] = useState([]);
  const [deleteData, setDeleteData] = useState(dataTable);
  const next = () => (page < total_pages ? setPage(page + 1) : page);
  let previous = () => (page > 1 ? setPage(page - 1) : 1);

  // Constants
  const LOADING_TEXT = "Loading products...";
  const NO_PRODUCTS_TEXT = "No products found";
  const TRY_AGAIN_TEXT = "Try Again";

  // Complex conditions
  const hasData = Array.isArray(data) && data.length > 0;
  const paginationText = loading ? LOADING_TEXT : `Page ${page} of ${total_pages} (${total} total items)`;

  useEffect(() => {
    setFilteredData(
      dataTable?.filter((data: any) =>
        data.sku.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, dataTable]);

  useEffect(() => {
    console.log("dispatch product v2", page, pageSize);
    // Comment out old API dispatch
    // dispatch(
    //   getPage({
    //     page: page
    //   })
    // );

    // Use product v2 dispatch instead
    dispatch(
      getProductListV2({
        page: page,
        per_page: pageSize
      })
    );
  }, [page, pageSize]);

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
        per_page: pageSize
      })
    );
  };

  const columns = [
    {
      Header: "SKU and Name",
      accessorKey: "sku",
      id: "sku",
      meta: {
        style: {
          color: "blue"
        }
      }
    },
    {
      Header: "Primary unit",
      accessorKey: "primaryUnit",
      id: "primaryUnit"
    },
    {
      Header: "UPC code",
      accessorKey: "upc",
      id: "upc"
    },
    {
      Header: "Description",
      accessorKey: "description",
      id: "description"
    },
    {
      Header: "Last updated",
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
            color: "blue",
            textDecoration: "underline"
          }}
          onClick={() => {
            console.log("tableProps", tableProps.row);
            // ES6 Syntax use the rvalue if your data is an array.
            const dataCopy = [...deleteData];
            // It should not matter what you name tableProps. It made the most sense to me.
            dataCopy.splice(tableProps.row.index, 1);
            setDeleteData(dataCopy);
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
              placeholder="Search product SKU"
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
      </ChakraProvider>
    </div>
  );
};

export default App;
