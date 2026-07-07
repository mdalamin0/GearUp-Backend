import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { Application } from "express";
import cors from "cors";
import config from "./config";
import globalErrorHanlder from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { providerGearRoutes } from "./modules/gearItem/providerGear.routes";
import { gearRoutes } from "./modules/gearItem/gear.routes";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GearUp server is running successfully!",
  });
});


app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/provider/gear", providerGearRoutes);
app.use("/api/gears", gearRoutes);


app.use(notFound)
app.use(globalErrorHanlder);

export default app;
