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
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import axiosInstance from "@utils/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../styles/userlist.module.css"; // Import the CSS module
import ConfirmationModal from "./ConfirmationModal"; // Import the modal component
import UpdateUserModal from "./UpdateUserModal"; // Import the new modal component
import ToastNotification from "@components/ToastNotification"; // Import your existing ToastNotification component
import axios from "axios";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  dob: string;
  phone_number: string;
  email: string;
  gender: string;
  religion: string;
  role_id: {
    _id: string;
    role_name: string;
  };
  username?: string;
  is_active?: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const fetchUsers = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/user/list?page=${currentPage}&limit=${rowsPerPage}${
          searchQuery ? `&search=${searchQuery}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
        setTotalUsers(response.data.data.totalUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowsPerPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage + 1); // `newPage` is zero-based, backend expects 1-based
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
        await axiosInstance.delete(`/user/delete/${userIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers();
        setConfirmDelete(false);
        setUserIdToDelete(null);
        // Show success toast
        setToastMessage("User deleted successfully!");
        setToastSeverity("success");
        setToastOpen(true);
      } catch (error) {
        console.error("Error deleting user:", error);
        // Show error toast
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
        `http://localhost:5000/user/update/${updatedUser._id}`,
        {
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          dob: updatedUser.dob,
          phoneNumber: updatedUser.phone_number,
          email: updatedUser.email,
          gender: updatedUser.gender,
          religion: updatedUser.religion,
          roleId: updatedUser.role_id._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(); // Refresh the user list after updating
      setUpdateModalOpen(false); // Close the modal
      setUserToUpdate(null); // Clear the user to update
      // Show success toast
      setToastMessage("User updated successfully!");
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      console.error("Error updating user:", error);
      // Show error toast
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
        <Button
          variant="contained"
          onClick={handleSearchSubmit}
          className={styles.searchButton}
        >
          Search
        </Button>
      </div>
      <TableContainer>
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
              <TableRow key={user._id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.role_id.role_name}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteConfirmation(user._id)}
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
        user={userToUpdate}
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
