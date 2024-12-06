const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');


router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'Email или Username уже существуют' });
        }

        const user = new User({ firstName, lastName, email, username, password });
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});


router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({
            message: 'Данные пользователя',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                balance: user.balance
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});


router.put('/update-balance', auth, async (req, res) => {
    const { balance } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        user.balance = balance;
        await user.save();

        res.status(200).json({
            message: 'Баланс обновлен',
            balance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

module.exports = router;
