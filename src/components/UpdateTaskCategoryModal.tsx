import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import axios from "axios";

interface TaskCategory {
  id: string;
  categoryName: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

interface UpdateTaskCategoryModalProps {
  open: boolean;
  onClose: () => void;
  taskCategory: TaskCategory | null;
  onUpdate: (updatedCategory: TaskCategory) => Promise<void>;
}

const UpdateTaskCategoryModal: React.FC<UpdateTaskCategoryModalProps> = ({
  open,
  onClose,
  taskCategory,
  onUpdate,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (taskCategory) {
      setCategoryName(taskCategory.categoryName);
      setDescription(taskCategory.description);
    }
  }, [taskCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskCategory) {
      const updatedCategory = {
        ...taskCategory,
        categoryName,
        description,
      };
      await onUpdate(updatedCategory);
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
        <h2>Update Task Category</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
            multiline
            rows={4}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Update Task Category
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateTaskCategoryModal;
