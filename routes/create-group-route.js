const express = require('express');
const route = express.Router();
const { groupModel, validateGroupModel } = require('../models/group-model');
const hashPassword = require('../utils/generate-salt');
const { userModel } = require('../models/user-model');

route.post('/', async (req, res) => {
    let { group_name, group_password } = req.body;
    let user_id = req.user;
    
    
    if (!group_name || !group_password) {
        return res.status(400).json({ message: 'Group name and password are required' });
    }

    let { error } = validateGroupModel({ name: group_name, password: group_password });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const hashedPassword = await hashPassword(group_password);
        const group = await groupModel.create({
            name: group_name,
            password: hashedPassword,
        });
        
        const user = await userModel.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.group.push(group._id);
        group.member.push(user_id);

        await user.save();
        await group.save();

        res.redirect('/');
    } catch (err) {
        console.error('Error creating group:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = route;
