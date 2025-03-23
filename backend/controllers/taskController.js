const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const Task = require('../models/taskSchema');

const createTask = asyncHandler(async(req,res)=>{
    const{name,priority,startTime,endTime,status} = req.body;
    
    const user = await User.findById(req.userId);
    // console.log("in controller");
    console.log(name,priority,startTime,endTime,status);
    
    if(!name || !priority || !startTime || !endTime || !status){
        res.status(404).json({error:'fill all fields'});
        return;
    }
    const task = await Task.create({
        name,
        priority,
        startTime,
        endTime,
        status,
        userId:user,
    })
    if(task){
        res.status(201).json(task);
    }
    else{
        throw new Error('error');
    }
})

const editTask = asyncHandler(async(req,res)=>{
    const{name,priority,startTime,endTime,status,taskId} = req.body;
    // const user = await User.findById(req.userId);
    const task = await Task.findById(taskId);
    if(!task){
        res.status(404).json({error:'task not found'});
        return;
    }
    task.name = name;
    task.priority = priority;
    task.startTime = startTime;
    task.endTime = endTime;
    if(status==2 && task.status==1){
        task.timeCompleted = new Date();
    }
    task.status = status;
    const updatedTask = await task.save();
    if(updatedTask){
        res.status(201).json(updatedTask);
    }
    else{
        throw new Error('error');
    }
})

const getTaskList = asyncHandler(async(req,res)=>{
    const {priority, status} = req.body;
    // console.log(priority,status);
    
    const user = await User.findById(req.userId);
    var tasks = await Task.find({userId:user});
    if(priority!=0){
        tasks = tasks.filter((task)=>{
            return task.priority === priority
        })
    }
    if(status != 0){
        tasks = tasks.filter((task)=>{
            return task.status === status
        })
    }
    if(tasks){
        res.status(201).json(tasks);
    }
    else{
        throw new Error('error');
    }
})

const getTables = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.userId);
    const tasks = await Task.find({userId:user});
    var data = []
    for(var i = 1;i<=5;i++){
        var filteredTasks = tasks.filter((task)=>{
            return (task.priority==i && task.status == 1);
        })
        var currTime = new Date();
        var totalLapsedTime = 0;
        var totalTimeToFinish = 0;
        filteredTasks.forEach(task => {
            var diffInMilliseconds = currTime - task.startTime;
            if(diffInMilliseconds>0){
                totalLapsedTime += diffInMilliseconds/(1000*60*60);
            }
            diffInMilliseconds = task.endTime-currTime;
            if(diffInMilliseconds>0){
                totalTimeToFinish += diffInMilliseconds/(1000*60*60);
            }
        });

        data.push({
            "priority":i,
            "pendingTasks":Math.floor(filteredTasks.length),
            "totalLapsedTime":Math.floor(totalLapsedTime),
            "totalTimeToComplete":Math.floor(totalTimeToFinish),
        })
        
    }
    if(data){
        res.status(201).json(data);
    }
})

const getDetails = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.userId);
    const tasks = await Task.find({userId:user});
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task)=>{
        return task.status == 1;
    })
    const completedTasks = tasks.filter((task)=>{
        return task.status == 2;
    })
    var totalLapsedTime = 0;
    var totalTimeToFinish = 0;
    var avgTimeToFinish = 0;
    const currTime = new Date();
    pendingTasks.forEach(task => {
        var diffInMilliseconds = currTime - task.startTime;
        if(diffInMilliseconds>0){
            totalLapsedTime += diffInMilliseconds/(1000*60*60);
        }
        diffInMilliseconds = task.endTime-currTime;
        if(diffInMilliseconds>0){
            totalTimeToFinish += diffInMilliseconds/(1000*60*60);
        }
    })
    
    completedTasks.forEach(task => {
        var diffInMilliseconds = task.timeCompleted - task.startTime;
        if(diffInMilliseconds>0){
            avgTimeToFinish += diffInMilliseconds/(1000*60*60);
        }
    })
    
    totalLapsedTime = Math.floor(totalLapsedTime);
    totalTimeToFinish = Math.floor(totalTimeToFinish);
    if(completedTasks.length>0)
        avgTimeToFinish = Math.floor(avgTimeToFinish/completedTasks.length);
    if(tasks){
        res.status(201).json({
            totalTasks,
            pendingTasks:pendingTasks.length,
            completedTasks:completedTasks.length,
            totalLapsedTime,
            totalTimeToFinish,
            avgTimeToFinish,
        });
    }
    else{
        throw new Error('error');
    }
})

const deleteTask = asyncHandler(async(req,res)=>{
    const {taskIds} = req.body;

    console.log(taskIds);
    

    taskIds.forEach(async(taskId)=>{
        const task = await Task.findById(taskId);
        if(task)
            await Task.deleteOne(task);
    })
    res.status(201).json({message:'tasks deleted'});
})



module.exports = {createTask, editTask, getTaskList, getTables, getDetails, deleteTask};