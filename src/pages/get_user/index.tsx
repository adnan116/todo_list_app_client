import React, { useEffect } from "react";
import Layout from "@components/Layout";
import UserList from "@components/UserList";
import { Container } from "@mui/material";
import { useRouter } from "next/router";

const GetUserPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    let token;
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("token");
    }
    if (!token) {
      router.push("/");
    }
  });

  return (
    <Layout>
      <Container style={{ padding: 0, overflow: "hidden", height: "100%" }}>
        <h1>User List</h1>
        <UserList />
      </Container>
    </Layout>
  );
};

export default GetUserPage;
