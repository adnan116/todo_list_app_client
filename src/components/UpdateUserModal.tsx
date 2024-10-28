import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { genderOptions, religionOptions } from "@utils/constant";
import moment from "moment";
import { backendBaseUrl } from "@configs/config";

interface Role {
  id: string;
  roleName: string;
}

interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (updatedUser: User) => Promise<void>;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // Ensure this is in 'YYYY-MM-DD' format
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

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  open,
  onClose,
  user,
  onUpdate,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.get(`${backendBaseUrl}/user/all-roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const fetchedRoles = response.data.data;

          // Sort the roles alphabetically by roleName
          const sortedRoles = fetchedRoles.sort((a: Role, b: Role) =>
            a.roleName.localeCompare(b.roleName)
          );

          setRoles(sortedRoles);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      // Set DOB in correct format
      setDob(moment(user.dob).format("YYYY-MM-DD"));
      setPhoneNumber(user.phoneNumber);
      setEmail(user.email);
      setGender(user.gender);
      setReligion(user.religion);
      setRoleId(
        (
          user.roleId as {
            id: string;
            roleName: string;
          }
        ).id
      );
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        firstName,
        lastName,
        dob,
        phoneNumber,
        email,
        gender,
        religion,
        roleId,
      };
      await onUpdate({ id: user.id, ...updatedUser });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>Update User</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={dob} // Correctly formatted
            onChange={(e) =>
              setDob(moment(e.target.value).format("YYYY-MM-DD"))
            }
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Gender Dropdown */}
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Gender</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Gender"
            >
              {genderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Religion Dropdown */}
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Religion</InputLabel>
            <Select
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              label="Religion"
            >
              {religionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Role Dropdown */}
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Update User
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateUserModal;
