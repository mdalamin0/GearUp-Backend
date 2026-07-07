import { Router } from "express";
import { gearItemController } from "./gearItem.controller";

const router = Router();


router.get("/", gearItemController.getAllGear)


export const gearRoutes = router;