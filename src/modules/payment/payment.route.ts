import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post("/create/:id", auth(Role.CUSTOMER), paymentController.initiatePayment)
router.post("/", paymentController.verifyPayment)
router.get("/", auth(Role.CUSTOMER), paymentController.getUsersPaymentHistory)
router.get("/:id", auth(Role.CUSTOMER), paymentController.getSinglePayment)

export const paymentRoutes = router;