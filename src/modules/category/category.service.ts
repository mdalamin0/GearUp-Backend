import { prisma } from "../../lib/prisma";

const createCategoryIntoDB = async (categoryName: string) => {
  const normalizedCategoryName = categoryName.trim().toLowerCase();

  const category = await prisma.category.findUnique({
    where: {
      name: normalizedCategoryName,
    },
  });

  if (category) {
    throw new Error(`Category ${categoryName} is already exist`);
  }

  const createdCategory = await prisma.category.create({
    data: {
      name: normalizedCategoryName,
    },
  });

  return createdCategory;
};

const getCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const updateCategoryIntoDB = async (name: string, id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });


  if (!category) {
    throw new Error("Category not found!");
  }


  if (category.name.toLowerCase() === name.toLowerCase()) {
    throw new Error(`Category ${name} already updated.`);
  }

   const existingCategory = await prisma.category.findUnique({
     where: {
       name,
     },
   });

  if (existingCategory && existingCategory.id !== id) {
    throw new Error(`Category '${name}' already exists.`);
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return updatedCategory;
};

export const categoryServices = {
  createCategoryIntoDB,
  getCategoriesFromDB,
  updateCategoryIntoDB,
};
