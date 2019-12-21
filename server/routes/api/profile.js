const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Community = require('../../models/Community');

// @route    PUT api/profile/
// @desc     Create/update user
// @access   Private
router.post('/', auth, async (req, res) => {
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.avatar) profileFields.avatar = req.body.avatar;

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
        }).populate('user', ['username']);

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
router.get('/user/:id', async (req, res) => {
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

// @route    PUT api/profile/follow/user/:id
// @desc     Follow user
// @access   Private
router.put('/follow/user/:id', auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id)
            return res.status(400).json({ msg: "You can't follow yourself" });

        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        const otherProfile = await Profile.findOne({ user: req.params.id });
        if (!otherProfile)
            return res.status(400).json({ msg: 'Other profile not found' });

        if (
            profile.following.filter(x => x.user.toString() === req.params.id)
                .length > 0
        ) {
            return res
                .status(400)
                .json({ msg: 'This user is already in your following list' });
        }

        profile.following.unshift({ user: req.params.id });

        await profile.save();

        if (
            otherProfile.followers.filter(
                x => x.user.toString() === req.user.id
            ).length > 0
        ) {
            return res.status(400).json({
                msg: 'This user already has you in their followers list'
            });
        }

        otherProfile.followers.unshift({ user: req.user.id });

        await otherProfile.save();

        res.json(profile);
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

// @route    PUT api/profile/unfollow/user/:id
// @desc     Unfollow user
// @access   Private
router.put('/unfollow/user/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        const otherProfile = await Profile.findOne({ user: req.params.id });
        if (!otherProfile)
            return res.status(400).json({ msg: 'Other profile not found' });

        if (
            profile.following.filter(x => x.user.toString() === req.params.id)
                .length === 0
        ) {
            return res
                .status(400)
                .json({ msg: 'This user is not in your following list' });
        }

        const myRemoveIndex = profile.following
            .map(x => x.user.toString())
            .indexOf(req.params.id);

        profile.following.splice(myRemoveIndex, 1);

        await profile.save();

        if (
            otherProfile.followers.filter(
                x => x.user.toString() === req.user.id
            ).length === 0
        ) {
            return res.status(400).json({
                msg: "This user doesn't have you in their followers list"
            });
        }

        const otherRemoveIndex = otherProfile.followers
            .map(x => x.user.toString())
            .indexOf(req.user.id);

        otherProfile.followers.splice(otherRemoveIndex, 1);

        await otherProfile.save();

        res.json(profile);
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
