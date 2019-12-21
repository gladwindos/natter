const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'community'
        },
        title: {
            type: String,
            required: true
        },
        details: {
            type: String
        },
        votes: {
            type: Number,
            default: 0
        },
        comments: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                },
                text: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = Post = mongoose.model('post', PostSchema);
