import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "./ConfirmationModal";
import ToastNotification from "@components/ToastNotification";
import UpdateTaskCategoryModal from "./UpdateTaskCategoryModal";
import styles from "@styles/userlist.module.css";
import { backendBaseUrl } from "@configs/config";
import { useRouter } from "next/router";

interface TaskCategory {
  id: string;
  categoryName: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

const TaskCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<TaskCategory | null>(
    null
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const router = useRouter();
  const fetchCategories = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `${backendBaseUrl}/task-category/list?page=${currentPage}&limit=${rowsPerPage}${
          search ? `&search=${search}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCategories(response.data.data.categories);
        setTotalPages(response.data.data.totalPages);
        setTotalCategories(response.data.data.totalCategories);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error fetching task categories:", error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, rowsPerPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleEditCategory = (category: TaskCategory) => {
    setCategoryToUpdate(category);
    setUpdateModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (categoryIdToDelete) {
      try {
        const token = window.localStorage.getItem("token");
        await axios.delete(
          `${backendBaseUrl}/task-category/delete/${categoryIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchCategories();
        setConfirmDelete(false);
        setCategoryIdToDelete(null);

        setToastMessage("Task category deleted successfully!");
        setToastSeverity("success");
        setToastOpen(true);
      } catch (error) {
        console.error("Error deleting task category:", error);
        setToastMessage("Error deleting task category.");
        setToastSeverity("error");
        setToastOpen(true);
      }
    }
  };

  const openDeleteConfirmation = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setConfirmDelete(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDelete(false);
    setCategoryIdToDelete(null);
  };

  const handleUpdateCategory = async (updatedCategory: TaskCategory) => {
    try {
      const token = window.localStorage.getItem("token");
      await axios.put(
        `${backendBaseUrl}/task-category/update/${updatedCategory.id}`,
        {
          categoryName: updatedCategory.categoryName,
          description: updatedCategory.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateModalOpen(false);
      setCategoryToUpdate(null);
      fetchCategories();

      setToastMessage("Task category updated successfully!");
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      console.error("Error updating task category:", error);

      setToastMessage("Error updating task category.");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Paper className={styles.root}>
      <div className={styles.searchContainer}>
        <TextField
          label="Search Task Categories"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditCategory(category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteConfirmation(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCategories}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <ConfirmationModal
        open={confirmDelete}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteCategory}
        message="Are you sure you want to delete this task category?"
      />
      <UpdateTaskCategoryModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        taskCategory={categoryToUpdate}
        onUpdate={handleUpdateCategory}
      />
      <ToastNotification
        open={toastOpen}
        onClose={handleToastClose}
        message={toastMessage}
        severity={toastSeverity}
      />
    </Paper>
  );
};

export default TaskCategoryList;
