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
import { backendBaseUrl } from "@configs/config";
import { ITaskUpdate, ICategory, IUser } from "@interface/task";
import { taskStatusOptions } from "@utils/constant";
import moment from "moment";

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: ITaskUpdate | null;
  categories: ICategory[];
  users: IUser[];
  onUpdate: (updatedTask: ITaskUpdate) => Promise<void>;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  open,
  onClose,
  task,
  categories,
  users,
  onUpdate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDeadline(task.deadline);
      setCategoryId(task.categoryId);
      setUserId(task.userId);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const updatedTask: ITaskUpdate = {
        id: task.id,
        title,
        description,
        status,
        deadline,
        categoryId,
        userId,
      };

      try {
        const token = window.localStorage.getItem("token");
        await axios.put(
          `${backendBaseUrl}/task/update/${task.id}`,
          updatedTask,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await onUpdate(updatedTask);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
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
        <h2>Update Task</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              {taskStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Deadline"
            type="date"
            value={moment(deadline).format("YYYY-MM-DD")}
            onChange={(e) => setDeadline(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>User</InputLabel>
            <Select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              label="User"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Update Task
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateTaskModal;
