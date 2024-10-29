import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@components/Sidebar";
import Navbar from "@components/Navbar";
import styles from "@styles/layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [permittedFeatures, setPermittedFeatures] = useState<string[]>([]);

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
      }
    }
  }, [router]);

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <Sidebar permittedFeatures={permittedFeatures} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
