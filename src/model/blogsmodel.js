const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    authorId: {
        type: ObjectId,
        ref: "authors",
        required: true

    },

    tags: [{
        type: String,
        trim: true
    }],

    category: {
        type: String,
        required: true
    },

    subcategory: [{
        type: String,
        trim: true
    }],


    deletedAt: {
        type: Date,
        default: null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    publishedAt: {
        type: Date,
        default: null
    },

    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('blogs', blogSchema)