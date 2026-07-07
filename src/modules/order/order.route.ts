import { Router } from "express";
import { orderController } from "./order.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), orderController.creatOrder)
router.get("/", auth(Role.CUSTOMER), orderController.getCustomerOrders)
router.get("/:id", auth(Role.CUSTOMER), orderController.getSingleOrder)


export const orderRoutes = router;