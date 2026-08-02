export type IUserQuery = {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  searchTerm?: string;

  role?: string;
  status?: string;
};
