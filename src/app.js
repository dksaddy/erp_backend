import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import requisitionRoutes from "./modules/requisition/requisition.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/requisitions", requisitionRoutes);

app.get("/", (req, res) => res.send("ERP API Running"));

export default app;
