const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'profile'
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'community',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        details: {
            type: String
        },
        votes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                },
                value: {
                    type: Number,
                    min: -1,
                    max: 1
                }
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
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
