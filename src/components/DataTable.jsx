import { useState, useMemo, useEffect } from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { visuallyHidden } from "@mui/utils";

import useFetchData from "../hooks/useFetchData";
import urlGenerator from "../func/urlGenerator";
import DataSkeleton from "./DataSkeleton";

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "DESC" : "ASC"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function DataTable() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(1);

  const [{ data, isLoading, isError }, setUrl] = useFetchData(
    urlGenerator({ pageSize: rowsPerPage, page, sort: orderBy, order })
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    setPage(1);
    setUrl(
      urlGenerator({
        pageSize: rowsPerPage,
        page: 1,
        sort: property,
        order: newOrder,
      })
    );
  };

  const handleChangePage = (event, newPage) => {
    if (newPage === 0) return null;
    setPage(newPage);
    setUrl(
      urlGenerator({
        pageSize: rowsPerPage,
        page: newPage,
        sort: orderBy,
        order,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let value = 1;
    const regex = /^[0-9]+$/;

    if (!regex.test(event.target.value) && Boolean(event.target.value))
      return null;
    else if (Boolean(event.target.value))
      value = parseInt(event.target.value, 10);

    setRowsPerPage(value);
    setUrl(
      urlGenerator({
        pageSize: value,
        page: 1,
        sort: orderBy,
        order,
      })
    );
    setPage(1);
  };

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nazwa",
    },
    {
      id: "popular",
      numeric: true,
      disablePadding: false,
      label: "Liczba powiązanych",
    },
  ];

  const visibleRows = data?.items ?? [];

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        InputLabelProps={{ shrink: true }}
        label={"Ilość rekordów na stronie"}
        type={"number"}
        onChange={handleChangeRowsPerPage}
        value={rowsPerPage}
        sx={{ width: "100%" }}
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {isLoading ? (
                <DataSkeleton quantity={rowsPerPage} />
              ) : (
                visibleRows.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={row.count} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data?.quota_max * rowsPerPage ?? 0}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={handleChangePage}
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`;
          }}
          labelRowsPerPage={false}
          rowsPerPageOptions={false}
        />
      </Paper>
    </Box>
  );
}
