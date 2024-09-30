import express from 'express'

import { verifyJWT } from '../middleware/auth.middleware.js'
import { createTask, getAllTasks,getTasksByStatus,deleteTask,partialUpdateTask,getTasksByPriority,searchTasksByTitle } from '../contraollers/task.controller.js'
const router = express.Router()


router.post('/create',createTask)
router.post('/alltasks',getAllTasks)

router.get('/alltasks-by-status/status', getTasksByStatus);
router.delete('/delete-task/:id', deleteTask);
router.patch('/update/:id', partialUpdateTask);
router.get('/filter-by-priority/priority', getTasksByPriority);
router.get('/search-by-title/search', searchTasksByTitle);
export default router