const asyncHandler = require('express-async-handler')
const { default: mongoose } = require('mongoose')

const Goal = require('../modals/goalModels')
const User = require('../modals/userModel')

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find( {user: req.user.id })
    res.status(200).json(goals)
})

const setGoals = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.json(goal)
})

const updateGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('No Goal Found')
    }

    if(!req.user) {
        res.status(401)
        throw new Error ('No User Found')
    }
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error ('User Not Authorized')
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,req.body,{new: true})
    res.json(updatedGoal)
})

const deleteGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal) {
        res.status(400)
        throw new Error('No Goal Found')
    }
    if(!req.user) {
        res.status(401)
        throw new Error ('No User Found')
    }
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error ('User Not Authorized')
    }
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id)
    await goal.remove()
    res.json({id: req.params.id})
})

module.exports = {
    getGoals, 
    setGoals, 
    updateGoals,
    deleteGoals,
}