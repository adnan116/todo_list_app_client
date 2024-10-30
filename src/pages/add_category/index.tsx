import React, { useEffect } from "react";
import Layout from "@components/Layout";
import AddTaskCategory from "@components/AddTaskCategory";
import { Container } from "@mui/material";
import { useRouter } from "next/router";

const AddCategoryPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    let token;
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("token");
    }
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <Layout>
      <Container
        sx={{
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <AddTaskCategory />
      </Container>
    </Layout>
  );
};

export default AddCategoryPage;
