import { Router } from "express";
import { gearItemController } from "./gearItem.controller";

const router = Router();


router.get("/", gearItemController.getAllGear)
router.get("/brands", gearItemController.getAllGearBrands);
router.get("/:id", gearItemController.getSingleGearItem)


export const gearRoutes = router;