import cors from "cors";
import express from "express";

import projectRoutes from "./routes/projectRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API is running",
    });
});

app.use("/", projectRoutes);

export default app;
