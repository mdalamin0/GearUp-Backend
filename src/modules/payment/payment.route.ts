import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post("/create/:id", auth(Role.CUSTOMER), paymentController.initiatePayment)
router.post("/", paymentController.verifyPayment)

export const paymentRoutes = router;