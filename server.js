const express = require("express");

const app = express();
const PORT = 5000;

let tasks = [];
let nextId = 1;

// Parse JSON request bodies
app.use(express.json());

// Log each incoming request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Require JSON for POST and PUT
app.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.is("application/json")
  ) {
    return res.status(400).json({
      error: "Content-Type must be application/json",
    });
  }

  next();
});

// Validate task IDs on routes that use :id
function validateTaskId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: "Task ID must be a positive integer",
    });
  }

  req.taskId = id;
  next();
}

// Optional home page
app.get("/", (req, res) => {
  res.send("Task Manager API is running. Visit /tasks to see tasks.");
});

// GET all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET one task
app.get("/tasks/:id", validateTaskId, (req, res) => {
  const task = tasks.find((item) => item.id === req.taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

// CREATE a task
app.post("/tasks", (req, res) => {
  const { title, completed = false } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Task title is required" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "completed must be true or false",
    });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    completed,
  };

  tasks.push(task);
  res.status(201).json(task);
});

// UPDATE a task
app.put("/tasks/:id", validateTaskId, (req, res) => {
  const task = tasks.find((item) => item.id === req.taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "title must be a non-empty string",
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "completed must be true or false",
      });
    }
    task.completed = completed;
  }

  res.status(200).json(task);
});

// DELETE a task
app.delete("/tasks/:id", validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex((item) => item.id === req.taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: "Task deleted",
    task: deletedTask,
  });
});

// 404 response for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler (keep this last)
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.status ? err.message : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});