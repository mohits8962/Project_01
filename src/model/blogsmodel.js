const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: 'author',
        required: true
    },
    tags: [{
        trim: true,
        type: String
    }],
    category: {
        type: String,
        trim: true,
        required: true
    },
    subcategory: [{
        trim: true,
        type: String
    }],
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    deletedAt: {
        type: Date,
        default:null
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default:null
    },
   
}, { timestamps: true })


module.exports = mongoose.model('blog', blogSchema)