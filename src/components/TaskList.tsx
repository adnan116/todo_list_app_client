import React, { useState, useEffect, useCallback } from "react";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "./ConfirmationModal";
import UpdateTaskModal from "./UpdateTaskModal";
import ToastNotification from "./ToastNotification";
import axios from "axios";
import { backendBaseUrl } from "@configs/config";
import styles from "../styles/tasklist.module.css";
import { useRouter } from "next/router";
import { ICategory, ITask, ITaskUpdate, IUser } from "@interface/task";
import bcrypt from "bcryptjs";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState<ITaskUpdate | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [generalUserId, setGeneralUserId] = useState<string>("");
  const [didMount, setDidMount] = useState(false);

  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `${backendBaseUrl}/task/list?page=${currentPage}&limit=${rowsPerPage}${
          search ? `&search=${search}` : ""
        }${categoryId ? `&categoryId=${categoryId}` : ""}${
          userId
            ? `&userId=${userId}`
            : generalUserId
            ? `&userId=${generalUserId}`
            : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTasks(response.data.data.tasks);
        setTotalTasks(response.data.data.totalTasks);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error fetching tasks:", error);
      }
    }
  }, [
    currentPage,
    rowsPerPage,
    search,
    categoryId,
    userId,
    generalUserId,
    router,
  ]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `${backendBaseUrl}/task-category/all-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error fetching categories:", error);
      }
    }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(`${backendBaseUrl}/user/all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error fetching users:", error);
      }
    }
  }, [router]);

  const setUserType = useCallback(async () => {
    if (typeof window !== "undefined") {
      const storedUserType = window.localStorage.getItem("userType");
      const userInfo = JSON.parse(
        window.localStorage.getItem("userInfo") || "{}"
      );
      if (storedUserType && userInfo) {
        const isAdmin = await bcrypt.compare("admin", storedUserType);
        setIsAdmin(isAdmin);

        if (!isAdmin) setGeneralUserId(userInfo?.userId);
      }
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    setUserType();
    setDidMount(true);
  }, [fetchCategories, fetchUsers, setUserType]);

  useEffect(() => {
    if (didMount) fetchTasks();
  }, [fetchTasks, didMount]);

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

  const openDeleteConfirmation = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setConfirmDelete(true);
  };

  const handleDeleteTask = async () => {
    if (taskIdToDelete) {
      try {
        const token = window.localStorage.getItem("token");
        await axios.delete(`${backendBaseUrl}/task/delete/${taskIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchTasks();
        setConfirmDelete(false);
        setTaskIdToDelete(null);
        setToastMessage("Task deleted successfully!");
        setToastSeverity("success");
        setToastOpen(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized access - Redirecting to login.");
          router.push("/");
        } else {
          console.error("Error deleting task:", error);
          setToastMessage("Error deleting task.");
          setToastSeverity("error");
          setToastOpen(true);
        }
      }
    }
  };

  const handleEditTask = (task: ITaskUpdate) => {
    setTaskToUpdate(task);
    setUpdateModalOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Paper className={styles.root}>
      <div className={styles.searchContainer}>
        <TextField
          label="Search Tasks"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
          style={{ maxWidth: "600px" }}
        />

        <FormControl variant="outlined" className={styles.filterSelect}>
          <InputLabel id="category-select-label" style={{ fontSize: "13px" }}>
            Filter By Category
          </InputLabel>
          <Select
            labelId="category-select-label"
            value={categoryId || ""}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Filter By Category"
            style={{ minWidth: "200px" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isAdmin && (
          <FormControl variant="outlined" className={styles.filterSelect}>
            <InputLabel id="user-select-label" style={{ fontSize: "13px" }}>
              Filter By User
            </InputLabel>
            <Select
              labelId="user-select-label"
              value={userId || ""}
              onChange={(e) => setUserId(e.target.value)}
              label="Filter By User"
              style={{ minWidth: "200px" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user?.firstName ? user.firstName : ""} ${
                    user?.lastName ? user.lastName : ""
                  }`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell style={{ width: "50px" }}>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  {new Date(task.deadline).toLocaleDateString()}
                </TableCell>
                <TableCell>{task.categoryId.categoryName}</TableCell>
                <TableCell>
                  {`${task?.userId?.firstName ? task.userId.firstName : ""} ${
                    task?.userId?.lastName ? task.userId.lastName : ""
                  }`}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleEditTask({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        deadline: task.deadline,
                        categoryId: task.categoryId.id,
                        userId: task.userId.id,
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  {isAdmin && (
                    <IconButton
                      color="secondary"
                      onClick={() => openDeleteConfirmation(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalTasks}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <ConfirmationModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteTask}
        message="Are you sure you want to delete this task?"
      />
      <UpdateTaskModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        task={taskToUpdate}
        categories={categories}
        users={users}
        onUpdate={async (updatedTask) => {
          setTaskToUpdate(updatedTask);
          setUpdateModalOpen(false);
          await fetchTasks();
          setToastMessage("Task updated successfully!");
          setToastSeverity("success");
          setToastOpen(true);
        }}
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

export default TaskList;
