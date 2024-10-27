"use client";

import React from "react";
import { useRouter } from "next/router";
import { Divider, Typography, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { featureMapping } from "@utils/constant";

interface SidebarProps {
  permittedFeatures: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ permittedFeatures }) => {
  const router = useRouter();
  const [openUser, setOpenUser] = React.useState(false);
  const [openTaskCategory, setOpenTaskCategory] = React.useState(false);
  const [openTask, setOpenTask] = React.useState(false);

  // Generate menuItems with only permitted features per category
  const menuItems = Object.entries(featureMapping).reduce(
    (acc, [category, features]) => {
      const permitted = features.filter((feature) =>
        permittedFeatures.includes(feature)
      );

      if (permitted.length > 0) {
        acc.push({ category, features: permitted });
      }
      return acc;
    },
    [] as { category: string; features: string[] }[]
  );

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className="w-80 h-screen bg-gray-200 p-4 flex flex-col shadow-lg"
      style={{ width: "15%" }}
    >
      <div className="mt-4 flex flex-col gap-2">
        {menuItems.map(({ category, features }) => (
          <div key={category}>
            <Typography
              onClick={() => {
                if (category === "User") setOpenUser(!openUser);
                if (category === "Task_Category")
                  setOpenTaskCategory(!openTaskCategory);
                if (category === "Task") setOpenTask(!openTask);
              }}
              variant="body1"
              sx={{
                padding: "10px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {`${category.replace("_", " ")} Management`}
              {category === "User" &&
                (openUser ? <ExpandLess /> : <ExpandMore />)}
              {category === "Task_Category" &&
                (openTaskCategory ? <ExpandLess /> : <ExpandMore />)}
              {category === "Task" &&
                (openTask ? <ExpandLess /> : <ExpandMore />)}
            </Typography>
            <Collapse
              in={openUser && category === "User"}
              timeout="auto"
              unmountOnExit
            >
              {features.map((feature) => (
                <Typography
                  key={feature}
                  onClick={() => navigateTo(`/${feature.toLowerCase()}`)}
                  variant="body2"
                  sx={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#d0d0d0",
                    },
                    borderRadius: "5px",
                  }}
                >
                  {feature.replace("_", " ")}
                </Typography>
              ))}
            </Collapse>
            <Collapse
              in={openTaskCategory && category === "Task_Category"}
              timeout="auto"
              unmountOnExit
            >
              {features.map((feature) => (
                <Typography
                  key={feature}
                  onClick={() => navigateTo(`/${feature.toLowerCase()}`)}
                  variant="body2"
                  sx={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#d0d0d0",
                    },
                    borderRadius: "5px",
                  }}
                >
                  {feature.replace("_", " ")}
                </Typography>
              ))}
            </Collapse>
            <Collapse
              in={openTask && category === "Task"}
              timeout="auto"
              unmountOnExit
            >
              {features.map((feature) => (
                <Typography
                  key={feature}
                  onClick={() => navigateTo(`/${feature.toLowerCase()}`)}
                  variant="body2"
                  sx={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#d0d0d0",
                    },
                    borderRadius: "5px",
                  }}
                >
                  {feature.replace("_", " ")}
                </Typography>
              ))}
            </Collapse>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
