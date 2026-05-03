import express from "express";
import authRoutes from "./routes/authRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/workspaces", workspaceRoutes);

app.get("/", (req, res)=> {
    res.send("Welcome to workpilot API");
})

const PORT = 5000

app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
});

