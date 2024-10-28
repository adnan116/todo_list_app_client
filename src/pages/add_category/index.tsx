import React from "react";
import Layout from "@components/Layout";
import AddTaskCategory from "@components/AddTaskCategory";
import { Container } from "@mui/material";

const AddCategoryPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <AddTaskCategory />
      </Container>
    </Layout>
  );
};

export default AddCategoryPage;
