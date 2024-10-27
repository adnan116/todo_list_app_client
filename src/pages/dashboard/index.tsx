import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@components/Sidebar";
import Navbar from "@components/Navbar";
import styles from "@styles/dashboard.module.css";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [permittedFeatures, setPermittedFeatures] = useState<string[]>([]);
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
        const permittedFeatures = JSON.parse(
          window.localStorage.getItem("permittedFeatures") || "[]"
        );
        setPermittedFeatures(permittedFeatures || []);

        const userdata = JSON.parse(
          window.localStorage.getItem("userInfo") || "{}"
        );
        setUserInfo(userdata);
      }
    }
  }, [router]);

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <Sidebar permittedFeatures={permittedFeatures} />
        <div className={styles.content}>
          <h1>{`Welcome, ${
            userInfo && userInfo?.firstName ? userInfo.firstName : ""
          } ${userInfo && userInfo?.lastName ? userInfo.lastName : ""}`}</h1>
          {/* Your main dashboard content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
