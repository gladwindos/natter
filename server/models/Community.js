const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        avatar: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = Community = mongoose.model('community', CommunitySchema);
