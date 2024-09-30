
import Task from '../models/task.model.js';
import User from '../models/user.model.js'
import { APiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'

const createTask = asyncHandler(async (req, res) => {
    // Get task details from the request body
    const { title, description, dueDate, priority } = req.body;

    // Validate input fields
    if ([title, dueDate, priority].some((field) => field?.trim() === "")) {
        throw new APiError(400, "All fields are required");
    }

    // Create the task
    const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        status: 'pending', 
    });

    // Check if task was created successfully
    if (!task) {
        throw new APiError(500, "Something went wrong while creating the task");

    }
    
    return res.status(201).json(new ApiResponse(201, "Task created successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
    // Fetch all tasks from the database
    const tasks = await Task.find();

    // If no tasks are found, return an appropriate message
    if (!tasks || tasks.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No tasks found"));
    }

    // Return the tasks in the response
    return res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

const getTasksByStatus = asyncHandler(async (req, res) => {
    // Get status from query parameters
    const { status } = req.query;

    // Validate the status
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
        throw new APiError(400, "Invalid status provided. Status must be 'pending', 'in-progress', or 'completed'.");
    }

    // Fetch tasks based on the provided status
    const tasks = await Task.find({ status });

    // If no tasks are found, return a not found response
    if (!tasks || tasks.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No tasks found with the specified status."));
    }

    // Return the tasks in the response
    return res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully based on status."));
});

const deleteTask = asyncHandler(async (req, res) => {
   
    const { id } = req.params;

    // Find the task by ID and delete it fro db
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
        throw new APiError(404, "Task not found");
    }

    // Return success response
    return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

const partialUpdateTask = asyncHandler(async (req, res) => {
 
    const { id } = req.params;
    const updateFields = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, {
        new: true, 
        runValidators: true 
    })
    if (!updatedTask) {
        throw new APiError(404, "Task not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const getTasksByPriority = asyncHandler(async (req, res) => {
    // Get priority from query parameters
    const { priority } = req.query;

    // Validate the priority
    if (!['High', 'Medium', 'Low'].includes(priority)) {
        throw new APiError(400, "Invalid priority provided. Priority must be 'High', 'Medium', or 'Low'.");
    }

    // Fetch tasks based on the provided priority
    const tasks = await Task.find({ priority });

    // If no tasks are found, return a not found response
    if (!tasks || tasks.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No tasks found with the specified priority."));
    }

    // Return the tasks in the response
    return res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully based on priority."));
});
const searchTasksByTitle = asyncHandler(async (req, res) => {
    // Get the search query from the request parameters
    const { title } = req.query;

    // Validate the title
    if (!title || title.trim() === "") {
        throw new APiError(400, "Title query is required.");
    }

    // Fetch tasks that match the title (case-insensitive)
    const tasks = await Task.find({
        title: { $regex: title, $options: 'i' } // Case-insensitive search
    });

   
    if (!tasks || tasks.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No tasks found with the specified title."));
    }

    // Return the tasks in the response
    return res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully based on title."));
});

export {createTask,getAllTasks,getTasksByStatus,deleteTask,partialUpdateTask,getTasksByPriority,searchTasksByTitle}