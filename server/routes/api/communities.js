const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Community = require('../../models/Community');

// @route POST api/communities
// @desc Create community
// @access Private
router.post(
    '/',
    [
        auth,
        check('name', 'Name is required')
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile)
                return res.status(400).json({ msg: 'Profile not found' });

            const newCommunity = new Community({
                name: req.body.name,
                creator: req.user.id,
                avatar: req.body.avatar
            });

            const community = await newCommunity.save();

            profile.communities.unshift({ community: community.id });

            await profile.save();

            res.json(community);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route GET api/communities
// @desc Get all communities
// @access Public
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find().select(
            'id name creator avatar'
        );
        res.json(communities);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/communities/:id
// @desc Get community by id
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({ msg: 'Community not found' });
        }

        res.json(community);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Community not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route PUT api/communities/:id
// @desc Update community
// @access Private
router.put('/:id', auth, async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (req.body.name) community.name = req.body.name;
        if (req.body.avatar) community.avatar = req.body.avatar;

        await community.save();

        res.json(community);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Community not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
