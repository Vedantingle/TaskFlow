const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

// @route  GET /api/tasks
// @desc   Get all tasks for logged-in user
// @access Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const filter = { user: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/tasks
// @desc   Create a new task
// @access Private
router.post('/', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/tasks/:id
// @desc   Get single task
// @access Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  PUT /api/tasks/:id
// @desc   Update a task
// @access Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  DELETE /api/tasks/:id
// @desc   Delete a task
// @access Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/tasks/stats/summary
// @desc   Get task stats for dashboard
// @access Private
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const pending = await Task.countDocuments({ user: req.user._id, status: 'pending' });
    const inProgress = await Task.countDocuments({ user: req.user._id, status: 'in-progress' });
    const completed = await Task.countDocuments({ user: req.user._id, status: 'completed' });

    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
