const express = require('express');
const { createTask, editTask, getTaskList, getTables, getDetails, deleteTask } = require('../controllers/taskController');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/createTask',verifyToken,createTask);
router.post('/editTask',verifyToken,editTask);
router.post('/deleteTask',verifyToken, deleteTask);
router.post('/getTaskList',verifyToken,getTaskList);
router.get('/getTables',verifyToken,getTables);
router.get('/getDetails',verifyToken,getDetails);

module.exports = router;