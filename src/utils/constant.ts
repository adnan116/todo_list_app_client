export const genderOptions: string[] = ["Male", "Female", "Other"];

export const religionOptions: string[] = [
  "Islam",
  "Christianity",
  "Hinduism",
  "Buddhism",
  "Other",
];

export const featureMapping: { [key: string]: string[] } = {
  User: ["ADD_USER", "GET_USER"],
  Task_Category: ["ADD_CATEGORY", "GET_CATEGORY"],
  Task: ["ADD_TASK", "GET_TASK"],
};

export const taskStatusOptions = [
  "TODO",
  "Pending",
  "In Progress",
  "Complete",
  "Close",
  "Cancelled",
];
