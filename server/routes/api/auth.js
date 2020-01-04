const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route GET api/auth
// @desc Get user
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json(user);
    } catch (error) {
        console.error(error.message);

        res.status(500).send('Server Error');
    }
});

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post(
    '/',
    [
        check('username', 'Username is required')
            .not()
            .isEmpty(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: 'Invalid username' }]
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            const payload = {
                user: {
                    id: user.id
                }
            };

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: 'Incorrect password' }]
                });
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000000 }, // CHANGE THIS TIME FOR PRODUCTION!
                (error, token) => {
                    if (error) throw error;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
