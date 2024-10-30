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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../styles/userlist.module.css";
import ConfirmationModal from "./ConfirmationModal";
import UpdateUserModal from "./UpdateUserModal";
import ToastNotification from "@components/ToastNotification";
import axios from "axios";
import { useRouter } from "next/router";
import { backendBaseUrl } from "@configs/config";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  email: string;
  gender: string;
  religion: string;
  roleId:
    | {
        id: string;
        roleName: string;
      }
    | string;
  username?: string;
  isActive?: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `${backendBaseUrl}/user/list?page=${currentPage}&limit=${rowsPerPage}${
          search ? `&search=${search}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(response.data.data.users);
        setTotalUsers(response.data.data.totalUsers);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error fetching users:", error);
      }
    }
  }, [router, currentPage, rowsPerPage, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleEditUser = (user: User) => {
    setUserToUpdate(user);
    setUpdateModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (userIdToDelete) {
      try {
        const token = window.localStorage.getItem("token");
        await axios.delete(`${backendBaseUrl}/user/delete/${userIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers();
        setConfirmDelete(false);
        setUserIdToDelete(null);

        setToastMessage("User deleted successfully!");
        setToastSeverity("success");
        setToastOpen(true);
      } catch (error) {
        console.error("Error deleting user:", error);
        setToastMessage("Error deleting user.");
        setToastSeverity("error");
        setToastOpen(true);
      }
    }
  };

  const openDeleteConfirmation = (userId: string) => {
    setUserIdToDelete(userId);
    setConfirmDelete(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDelete(false);
    setUserIdToDelete(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const token = window.localStorage.getItem("token");
      await axios.put(
        `${backendBaseUrl}/user/update/${updatedUser.id}`,
        {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          dob: updatedUser.dob,
          phoneNumber: updatedUser.phoneNumber,
          email: updatedUser.email,
          gender: updatedUser.gender,
          religion: updatedUser.religion,
          roleId: updatedUser.roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateModalOpen(false);
      setUserToUpdate(null);
      fetchUsers();

      setToastMessage("User updated successfully!");
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      console.error("Error updating user:", error);

      setToastMessage("Error updating user.");
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
          label="Search Users"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>
                  {(user.roleId as { id: string; roleName: string }).roleName}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteConfirmation(user.id)}
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
        count={totalUsers}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <ConfirmationModal
        open={confirmDelete}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user?"
      />
      <UpdateUserModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        user={userToUpdate as User}
        onUpdate={handleUpdateUser}
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

export default UserList;
