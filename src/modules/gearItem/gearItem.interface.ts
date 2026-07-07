
export interface ICreateGearItem {
  title: string;
  description: string;
  specifications: Record<string, unknown>;
  brand: string;
  rentalPrice: number;
  stock: number;
  image: string;
  categoryId: string;
}

export interface IGearItemsQuery {
  searchTerm?: string;
  brand?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  available?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IUpdateGearPayload {
  title?: string;
  description?: string;
  specifications?: Record<string, unknown>;
  brand?: string;
  rentalPrice?: number;
  stock?: number;
  image?: string;
  categoryId?: string;
}
