const express = require("express");
const Task = require("../models/Task");
const Joi = require("joi");
const router = express.Router();

// Joi validation schema
const validateTask = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().optional(),
    status: Joi.string()
      .valid("TODO", "IN_PROGRESS", "COMPLETED")
      .default("TODO"),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
    dueDate: Joi.date().optional(),
  });

  return schema.validate(data);
};

// POST /tasks - Create a new task
router.post("/tasks", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err); // **Added for logging errors**
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks - Retrieve all tasks with pagination
router.get("/tasks", async (req, res) => {
  try {
    const { status, priority, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const totalTasks = await Task.countDocuments(filter); // Count the total number of tasks that match the filter
    const tasks = await Task.find(filter)
      .sort(sort ? { [sort]: 1 } : {}) // Sorting tasks
      .skip((pageNum - 1) * limitNum) // Pagination logic: skip tasks based on the page
      .limit(limitNum); // Limit the number of tasks returned

    res.json({
      totalTasks,
      totalPages: Math.ceil(totalTasks / limitNum),
      currentPage: pageNum,
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err); // **Added for logging errors**
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:id - Retrieve a task by ID
router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task by ID:", err); // **Added for logging errors**
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id - Update a task
router.put("/tasks/:id", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    console.error("Error updating task:", err); // **Added for logging errors**
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(204).send(); // No content response
  } catch (err) {
    console.error("Error deleting task:", err); // **Added for logging errors**
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
