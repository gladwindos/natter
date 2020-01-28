const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        avatar: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        },
        communities: [
            {
                community: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'community'
                }
            }
        ],
        followers: [
            {
                profile: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'profile'
                }
            }
        ],
        following: [
            {
                profile: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'profile'
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
