import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.PROVIDER), gearItemController.createGearItem)
router.put("/:id", auth(Role.PROVIDER), gearItemController.updateGearItem)
router.delete("/:id", auth(Role.PROVIDER), gearItemController.deleteGear)

export const providerGearRoutes = router;