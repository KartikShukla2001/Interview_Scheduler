import { useEffect } from "react";
import NextLink from "next/link";
import Head from "next/head";
import { Box, Container } from "@mui/material";

import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { InterviewCreateForm } from "../../../components/dashboard/interview/interview-create-form";

const ProductCreate = () => {
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
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}></Box>
          <InterviewCreateForm />
        </Container>
      </Box>
    </>
  );
};

ProductCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductCreate;
