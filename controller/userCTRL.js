const express = require('express');
const User = reuire('./models/user');

const userCtrl = {
    createUser : async (req, res) => {
        try
        {
            const user = await User.create(req.body);
            res.status(201).json(user);
            res.json({message: 'User created successfully'});
        }
        catch(error)
        {
            console.log(error);
        }
    },
    getUser : async (req, res) => {
        try
        {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        }
        catch(error)
        {
            console.log(error);
        }
    },
    updateUser : async (req, res) => {
        try
        {
            const user = await User.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json(user);
        }
        catch(error)
        {
            console.log(error);
        }
    },
    deleteUser : async (req, res) => {
        try
        {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json(user);
        }
        catch(error)
        {
            console.log(error);
        }
    }
}