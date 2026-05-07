import express from "express";
import authRoutes from "./routes/authRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/workspaces", workspaceRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/comments", commentRoutes);

app.get("/", (req, res)=> {
    res.send("Welcome to workpilot API");
})

const PORT = 5000

app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
});

