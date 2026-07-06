import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.PROVIDER), gearItemController.createGearItem)

export const providerGearRoutes = router;