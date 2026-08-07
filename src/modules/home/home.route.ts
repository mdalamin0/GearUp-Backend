import { Router } from "express";
import { homeController } from "./home.controller";

const router = Router();

router.get("/", homeController.getAllStatsData)

export const homeRoutes = router;