import { Router } from "express";
import { orderController } from "./order.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/rentals", auth(Role.CUSTOMER), orderController.creatOrder);
router.get("/rentals", auth(Role.CUSTOMER), orderController.getCustomerOrders);
router.get("/rentals/:id", auth(Role.CUSTOMER), orderController.getSingleOrder);

// Provider
router.get(
  "/provider/orders",
  auth(Role.PROVIDER),
  orderController.getProviderOrders,
);

router.patch(
  "/provider/orders/:id",
  auth(Role.PROVIDER),
  orderController.updateOrderStatus,
);

export const orderRoutes = router;
