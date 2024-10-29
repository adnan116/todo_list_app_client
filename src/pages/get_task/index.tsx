// src/pages/get_task/index.tsx

import React, { useEffect } from "react";
import Layout from "@components/Layout";
import TaskList from "@components/TaskList";
import { Container } from "@mui/material";
import { useRouter } from "next/router";

const GetTaskPage: React.FC = () => {
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
        <h1>Task List</h1>
        <TaskList />
      </Container>
    </Layout>
  );
};

export default GetTaskPage;
