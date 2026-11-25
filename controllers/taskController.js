import Task from "../models/Task.js"
import mongoose from 'mongoose';

const STATUSES = ['pending', 'in-progress', 'done'];

export const createTask = async (req, res) => {
  try {
    const { title, status, dueDate, userId } = req.body;

    if (!title || typeof title !== 'string' || !title.trim())
      return res.status(400).json({ success: false, message: 'Title is required' });
    if (status && !STATUSES.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    if (dueDate && isNaN(Date.parse(dueDate)))
      return res.status(400).json({ success: false, message: 'Invalid dueDate' });
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ success: false, message: 'Valid userId is required' });

    const task = await Task.create({ title, status, dueDate, userId });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const { status } = req.query;

    if (status && !STATUSES.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const filter = {};
    if (status) filter.status = status;

    const [total, data] = await Promise.all([
      task.countDocuments(filter),
      task.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ]);

    res.json({ total, page, limit, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};