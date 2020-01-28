const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Community = require('../../models/Community');

// @route    PUT api/profile/
// @desc     Create/update user profile
// @access   Private
router.post('/', auth, async (req, res) => {
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.avatar) profileFields.avatar = req.body.avatar;
    if (req.body.bio) profileFields.bio = req.body.bio;

    try {
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
            .populate('user', ['username'])
            .populate('communities.community', ['_id', 'name']);

        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['username']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/user/:id
// @desc     Get profile by user id
// @access   Public
router.get('/userId/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.id
        }).populate('user', ['username']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/user/:username
// @desc     Get profile by user username
// @access   Public
router.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        }).select('_id');

        if (!user) return res.status(400).json({ msg: 'Profile not found' });

        const profile = await Profile.findOne({
            user: user._id
        })
            .populate('user', ['username'])
            .populate('communities.community', ['_id', 'name', 'avatar'])
            .populate({
                path: 'followers.profile',
                select: '_id avatar',
                populate: { path: 'user', select: '_id username' }
            })
            .populate({
                path: 'following.profile',
                select: '_id avatar',
                populate: { path: 'user', select: '_id username' }
            });

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/join/community/:id
// @desc     Join community
// @access   Private
router.put('/join/community/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        const community = await Community.findById(req.params.id);
        if (!community)
            return res.status(400).json({ msg: 'Community not found' });

        if (
            profile.communities.filter(
                x => x.community.toString() === community.id
            ).length > 0
        ) {
            return res
                .status(400)
                .json({ msg: 'User already belongs to this community' });
        }

        profile.communities.unshift({ community: community.id });

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res
                .status(400)
                .json({ msg: 'Profile or Community not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/leave/community/:id
// @desc     Leave community
// @access   Private
router.put('/leave/community/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        const community = await Community.findById(req.params.id);
        if (!community)
            return res.status(400).json({ msg: 'Community not found' });

        if (
            profile.communities.filter(
                c => c.community.toString() === community.id
            ).length === 0
        ) {
            return res
                .status(400)
                .json({ msg: "User doesn't belongs to this community" });
        }

        const removeIndex = profile.communities
            .map(c => c.community.toString())
            .indexOf(community.id);

        profile.communities.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res
                .status(400)
                .json({ msg: 'Profile or Community not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/follow/:id
// @desc     Follow user
// @access   Private
router.put('/follow/:id', auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({ user: req.user.id });
        if (!myProfile)
            return res.status(400).json({ msg: 'Profile not found' });

        const profileToFollow = await Profile.findById(req.params.id);
        if (!profileToFollow)
            return res.status(400).json({ msg: 'Other profile not found' });

        if (myProfile.id === profileToFollow.id)
            return res.status(400).json({ msg: "You can't follow yourself" });

        if (
            myProfile.following.filter(
                x => x.profile.toString() === profileToFollow.id
            ).length > 0
        ) {
            return res
                .status(400)
                .json({ msg: 'This user is already in your following list' });
        }

        myProfile.following.unshift({ profile: profileToFollow.id });

        await myProfile.save();

        if (
            profileToFollow.followers.filter(
                x => x.profile.toString() === myProfile.id
            ).length > 0
        ) {
            return res.status(400).json({
                msg: 'This user already has you in their followers list'
            });
        }

        profileToFollow.followers.unshift({ profile: myProfile.id });

        await profileToFollow.save();

        res.json(myProfile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res
                .status(400)
                .json({ msg: 'One of the profiles not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/unfollow/:id
// @desc     Unfollow user
// @access   Private
router.put('/unfollow/:id', auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({ user: req.user.id });
        if (!myProfile)
            return res.status(400).json({ msg: 'Profile not found' });

        const profileToFollow = await Profile.findById(req.params.id);
        if (!profileToFollow)
            return res.status(400).json({ msg: 'Other profile not found' });

        if (myProfile.id === profileToFollow.id)
            return res.status(400).json({ msg: "You can't unfollow yourself" });

        if (
            myProfile.following.filter(
                x => x.profile.toString() === profileToFollow.id
            ).length === 0
        ) {
            return res
                .status(400)
                .json({ msg: 'This user is not in your following list' });
        }

        const myRemoveIndex = myProfile.following
            .map(x => x.profile.toString())
            .indexOf(profileToFollow.id);

        myProfile.following.splice(myRemoveIndex, 1);

        await myProfile.save();

        if (
            profileToFollow.followers.filter(
                x => x.profile.toString() === myProfile.id
            ).length === 0
        ) {
            return res.status(400).json({
                msg: "This user doesn't have you in their followers list"
            });
        }

        const otherRemoveIndex = profileToFollow.followers
            .map(x => x.profile.toString())
            .indexOf(myProfile.id);

        profileToFollow.followers.splice(otherRemoveIndex, 1);

        await profileToFollow.save();

        res.json(myProfile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res
                .status(400)
                .json({ msg: 'One of the profiles not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/profile (NOT TESTED YET)
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user.id });
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
