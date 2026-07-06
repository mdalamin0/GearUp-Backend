import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/",  categoryController.createCategory)
router.get("/",  categoryController.getCategories)
router.patch("/:id", categoryController.updateCategory);

export const categoryRoutes = router;