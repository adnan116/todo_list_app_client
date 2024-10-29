export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  categoryId: {
    id: string;
    categoryName: string;
  };
  userId: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ICategory {
  id: string;
  categoryName: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ITaskUpdate {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  categoryId: string;
  userId: string;
}
