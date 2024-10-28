import React, { useEffect } from "react";
import Layout from "@components/Layout";
import TaskCategoryList from "@components/TaskCategoryList";
import { Container } from "@mui/material";
import { useRouter } from "next/router";

const GetCategoryPage: React.FC = () => {
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
      <Container>
        <h1>Task Category List</h1>
        <TaskCategoryList />
      </Container>
    </Layout>
  );
};

export default GetCategoryPage;
