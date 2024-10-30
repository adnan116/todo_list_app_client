import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@components/Layout";
import styles from "@styles/dashboard.module.css";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    let token;
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("token");
    }
    if (!token) {
      router.push("/");
    } else {
      if (typeof window !== "undefined") {
        const userdata = JSON.parse(
          window.localStorage.getItem("userInfo") || "{}"
        );
        setUserInfo(userdata);
      }
    }
  }, [router]);

  return (
    <Layout>
      <div className={styles.content}>
        <h3>{`Welcome, ${
          userInfo && userInfo?.firstName ? userInfo.firstName : ""
        } ${userInfo && userInfo?.lastName ? userInfo.lastName : ""}`}</h3>
        <h4>{"Let’s Make Today Productive"}</h4>
      </div>
    </Layout>
  );
};

export default Dashboard;
