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
