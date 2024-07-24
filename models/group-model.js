const mongoose = require('mongoose');
const Joi = require('joi');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

const validateGroupModel = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

const groupModel = mongoose.model('Group', groupSchema);

module.exports = { groupModel, validateGroupModel };
