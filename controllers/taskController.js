const Task = require("../models/Task");
const Joi = require("joi");

// Validation Schema
const taskValidationSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid("TODO", "IN_PROGRESS", "COMPLETED")
    .default("TODO"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
  dueDate: Joi.date().optional(),
});

// Create a Task
exports.createTask = async (req, res) => {
  try {
    const { error } = taskValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err); // **Added for logging errors**
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Tasks with Pagination
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Convert page and limit to integers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const totalTasks = await Task.countDocuments(filter); // Count the total number of tasks that match the filter
    const tasks = await Task.find(filter)
      .sort(sort ? { [sort]: 1 } : {}) // Sorting tasks
      .skip((pageNum - 1) * limitNum) // Pagination logic: skip tasks based on the page
      .limit(limitNum); // Limit the number of tasks returned

    // Response with pagination info
    res.json({
      totalTasks,
      totalPages: Math.ceil(totalTasks / limitNum),
      currentPage: pageNum,
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err); // **Added for logging errors**
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Error fetching task by ID:", err); // **Added for logging errors**
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a Task
exports.updateTask = async (req, res) => {
  try {
    const { error } = taskValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err); // **Added for logging errors**
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(204).send(); // No content response
  } catch (err) {
    console.error("Error deleting task:", err); // **Added for logging errors**
    res.status(500).json({ error: "Internal Server Error" });
  }
};
