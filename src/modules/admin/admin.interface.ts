export type IUserQuery = {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  searchTerm?: string;

  role?: string;
  status?: string;
};

export type IRentalsQuery = {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  searchTerm?: string;

  status?: string;
};
