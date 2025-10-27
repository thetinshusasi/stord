import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productdataSelector } from "./redux/selector";
import { ChakraProvider } from "@chakra-ui/react";
import { getPage } from "./redux/actionCreators";
import Moment from "moment";
import {
  Button,
  ButtonGroup,
  Heading,
  InputGroup,
  Input,
  InputLeftElement
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { DataTable } from "./table";
import "./styles.css";
//import { columns } from "./redux/constants";
import { AddProduct } from "./model";

const App = () => {
  const dispatch = useDispatch();
  const mainTableData = useSelector(productdataSelector);
  const { quickFilterInput } = useSelector(productdataSelector);
  const [page, setPage] = useState(1);
  const dataTable = mainTableData?.data?.data;
  const total_pages = mainTableData?.data?.total_pages;
  const total = mainTableData?.data?.total;
  console.log("dataTable", dataTable);
  const [search, setSearch] = useState("");
  const [data, setFilteredData] = useState([]);
  const [deleteData, setDeleteData] = useState(dataTable);
  const next = () => (page < 10 ? setPage(page + 1) : 1);
  let previous = () => (page > 1 ? setPage(page - 1) : 1);

  useEffect(() => {
    setFilteredData(
      dataTable?.filter((data: any) =>
        data.sku.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, dataTable]);

  useEffect(() => {
    console.log("dispatch", page);
    dispatch(
      getPage({
        page: page
      })
    );
  }, [page]);
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
              value={quickFilterInput}
              focusBorderColor="blue.400"
              placeholder="Search product SKU"
            />
          </InputGroup>
        </div>
        <div style={{ float: "right", marginTop: "-99px" }}>
          <AddProduct />
        </div>
        <ButtonGroup
          style={{ float: "right", marginTop: "-49px" }}
          variant="outline"
          spacing="6"
        >
          <div
            style={{ margin: "7px -19px" }}
          >{`Items ${page} - ${total_pages} of ${total}`}</div>
          <Button
            style={{
              margin: "0px -19px 0 22px",
              fontSize: "15px",
              width: "90px"
            }}
            onClick={previous}
          >
            Previous
          </Button>
          <Button style={{ fontSize: "15px", width: "50px" }} onClick={next}>
            Next
          </Button>
        </ButtonGroup>

        {Array.isArray(data) && data.length > 0 ? (
          <DataTable columns={columns} data={data} />
        ) : null}
      </ChakraProvider>
    </div>
  );
};

export default App;
