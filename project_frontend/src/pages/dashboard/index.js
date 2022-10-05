import { useState, useEffect, useCallback, Component } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { useMounted } from "../../hooks/use-mounted";
import { Plus as PlusIcon } from "../../icons/plus";
import { API_SERVICE } from "../../config/API";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const applyFilters = (products, filters) =>
  products.filter((product) => {
    if (filters.name) {
      const nameMatched = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());

      if (!nameMatched) {
        return false;
      }
    }

    // It is possible to select multiple category options
    if (filters.category?.length > 0) {
      const categoryMatched = filters.category.includes(product.category);

      if (!categoryMatched) {
        return false;
      }
    }

    // It is possible to select multiple status options
    if (filters.status?.length > 0) {
      const statusMatched = filters.status.includes(product.status);

      if (!statusMatched) {
        return false;
      }
    }

    // Present only if filter required
    if (typeof filters.inStock !== "undefined") {
      const stockMatched = product.inStock === filters.inStock;

      if (!stockMatched) {
        return false;
      }
    }

    return true;
  });

const applyPagination = (products, page, rowsPerPage) =>
  products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const TableViewPage = ({ membership, i }) => {
  return (
    <TableRow
      key={1}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="center" component="th" scope="row">
        {i}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        {membership.admin.name}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        {membership.start_time}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <NextLink
          href={{
            pathname: "/dashboard/products/new",
            query: { id: membership._id },
          }}
          passHref
          marginX={5}
        >
          <Button component="a" variant="contained">
            Update
          </Button>
        </NextLink>
      </TableCell>
    </TableRow>
  );
};

const Overview = () => {
  const isMounted = useMounted();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setloading] = useState(true);
  const [memberships, setmemberships] = useState([]);

  const [filters, setFilters] = useState({
    name: undefined,
    category: [],
    status: [],
    inStock: undefined,
  });

  const getProducts = useCallback(async () => {
    try {
      const data = await productApi.getProducts();

      if (isMounted()) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getProducts();
      fetchallmemberships();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFiltersChange = (filters) => {
    setFilters(filters);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredProducts = applyFilters(products, filters);
  const paginatedProducts = applyPagination(
    filteredProducts,
    page,
    rowsPerPage
  );

  const fetchallmemberships = async () => {
    try {
      const res = await fetch(`${API_SERVICE}/getinterview`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const content = await res.json();
      console.log("content start");
      console.log(content);
      console.log("content end");
      setmemberships(content);
      setloading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const showMemberships = () => {
    var i = 0;
    return (
      <>
        {memberships.map((membership) => {
          i = i + 1;
          return (
            <TableViewPage i={i} membership={membership} key={membership._id} />
          );
        })}
      </>
    );
  };
  console.log(memberships);
  return (
    <>
      <Head>
        <title>Interview Scheduler</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Scheduled Interviews</Typography>
              </Grid>
              <Grid item></Grid>
              <Grid item>
                <NextLink href="/dashboard/products/new" passHref marginX={5}>
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
              style={{ marginTop: "0px" }}
            >
              <Grid item></Grid>
            </Grid>
          </Box>
          <Card>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                id="table-to-xls"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">SL No.</TableCell>
                    <TableCell align="center">Admin</TableCell>
                    <TableCell align="center">Start_Time</TableCell>
                    <TableCell align="center">Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? <></> : <>{showMemberships()}</>}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Overview.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Overview;
