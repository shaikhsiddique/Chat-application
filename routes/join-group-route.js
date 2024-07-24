const express = require('express');
const { userModel } = require('../models/user-model');
const { groupModel } = require('../models/group-model');
const route = express.Router();
const bcrypt = require('bcrypt');

route.post('/',async (req, res) => {
   let {group_name,group_password} = req.body;;
   let user_id = req.user;

   let user = await userModel.findById(user_id);
   if(!user){
    return res.status(401).send("Something Went Wrong");
   }
   let group = await groupModel.findOne({name:group_name});
   if(!group){
    return res.status(404).send("Group Not Found");
   }
   const result = bcrypt.compare(group_password,group.password);
   if(!result){
    return res.status(401).send("Passwors Incorrect");
   }
   if(group.member.includes(user_id) || user.group.includes(group._id)){
    let userIndex = group.members.indexOf(user_id);
    if (userIndex !== -1) {
    group.member.splice(userIndex, 1);
    }
    let groupIndex = user.groups.indexOf(group_id);
    if (groupIndex !== -1) {
    user.group.splice(groupIndex, 1);
    }
   }
   group.member.push(user_id);
   user.group.push(group._id);
   await group.save();
   await user.save();
   res.redirect('/')
});

module.exports = route;