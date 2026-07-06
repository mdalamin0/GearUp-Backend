import express, { Request, Response } from "express";
import { Application } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GearUp server is running successfully!",
  });
});

export default app;
