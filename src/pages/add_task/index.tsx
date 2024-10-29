import React, { useEffect } from "react";
import { Container } from "@mui/material";
import Layout from "@components/Layout";
import AddTask from "@components/AddTask";
import { useRouter } from "next/router";

const AddTaskPage: React.FC = () => {
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <AddTask />
      </Container>
    </Layout>
  );
};

export default AddTaskPage;
