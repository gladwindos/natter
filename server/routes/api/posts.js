const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Community = require('../../models/Community');
const Post = require('../../models/Post');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
    '/',
    [
        auth,
        [
            check('community', 'Community is required')
                .not()
                .isEmpty(),
            check('title', 'Title is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const community = await Community.findById(req.body.community);
            if (!community)
                return res.status(400).json({ msg: 'Community not found' });

            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile)
                return res.status(400).json({ msg: 'Profile not found' });

            const profileCommunities = profile.communities.map(
                c => c.community
            );

            if (!profileCommunities.includes(req.body.community)) {
                return res.status(401).json({
                    msg:
                        "User doesn't belong to community, authorization denied"
                });
            }
            const newPost = new Post({
                user: req.user.id,
                profile: profile.id,
                community: req.body.community,
                title: req.body.title,
                details: req.body.details
            });

            const post = await newPost.save();

            res.json(post);
        } catch (error) {
            console.error(error.message);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ msg: 'Id not valid' });
            }
            res.status(500).send('Server Error');
        }
    }
);

// @route GET api/posts
// @desc Get all posts
// @access Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'user', select: 'username' })
            .populate({ path: 'community', select: 'name' })
            .populate({ path: 'profile', select: 'avatar' });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/posts/user/:id
// @desc Get all posts a user has created
// @access Public
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const posts = await Post.find({ user: req.params.id })
            .sort({
                createdAt: -1
            })
            .populate({ path: 'user', select: 'username' })
            .populate({ path: 'community', select: 'name' })
            .populate({ path: 'profile', select: 'avatar' });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

// @route GET api/posts/community/:id
// @desc Get all posts for community
// @access Private
router.get('/community/:id', async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(404).json({ msg: 'Community not found' });
        }

        const posts = await Post.find({ community: req.params.id }).sort({
            createdAt: -1
        });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

// @route GET api/posts/feed
// @desc Get user feed (i.e. all posts from current users communities)
// @access Private
router.get('/feed', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        const profileCommunities = profile.communities.map(c => c.community);

        const posts = await Post.find()
            .where('community')
            .in(profileCommunities)
            .sort({ createdAt: -1 })
            .populate({ path: 'user', select: 'username avatar' })
            .populate({ path: 'community', select: 'name' })
            .populate({ path: 'profile', select: 'avatar' });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/posts/:id
// @desc Get post by id (Make sure this route is last of the GET requests)
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/posts/:id/upvote
// @desc     Upvote a post
// @access   Private
router.put('/:id/upvote', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (
            post.votes.filter(vote => vote.user.toString() === req.user.id)
                .length > 0
        ) {
            const userVote = post.votes.filter(
                vote => vote.user.toString() === req.user.id
            )[0];

            switch (userVote.value) {
                case 1:
                    return res
                        .status(400)
                        .json({ msg: 'Post has already been upvoted' });
                    break;
                case 0:
                    userVote.value = 1;
                    break;
                case -1:
                    userVote.value = 0;
                    break;
                default:
                    return res.status(400).json({
                        msg: 'Something went wrong, nothing has been updated.'
                    });
            }
        } else {
            post.votes.unshift({ user: req.user.id, value: 1 });
        }

        await post.save();

        res.json(post.votes);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/posts/:id/downvote
// @desc     Downvote a post
// @access   Private
router.put('/:id/downvote', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (
            post.votes.filter(vote => vote.user.toString() === req.user.id)
                .length > 0
        ) {
            const userVote = post.votes.filter(
                vote => vote.user.toString() === req.user.id
            )[0];

            switch (userVote.value) {
                case -1:
                    return res
                        .status(400)
                        .json({ msg: 'Post has already been downvoted' });
                    break;
                case 0:
                    userVote.value = -1;
                    break;
                case 1:
                    userVote.value = 0;
                    break;
                default:
                    return res.status(400).json({
                        msg: 'Something went wrong, nothing has been updated.'
                    });
            }
        } else {
            post.votes.unshift({ user: req.user.id, value: -1 });
        }

        await post.save();

        res.json(post.votes);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    POST api/posts/:id/comment
// @desc     Comment on a post
// @access   Private
router.post(
    '/:id/comment',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const newComment = {
                user: req.user.id,
                text: req.body.text
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        } catch (error) {
            console.error(error.message);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ msg: 'Id not valid' });
            }
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/posts/:id/comment/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/:id/comment/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const removeIndex = post.comments
            .map(comment => comment.id)
            .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Id not valid' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
