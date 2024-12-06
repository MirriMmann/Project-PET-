const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Создание транзакции (доход или расход)
router.post('/create', auth, async (req, res) => {
    const { type, category, amount } = req.body;

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: 'Недопустимый тип транзакции' });
    }

    try {
        const transaction = new Transaction({
            userId: req.user.id,
            type,
            category,
            amount
        });
        await transaction.save();
        res.status(201).json({ message: 'Транзакция создана', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// Получение истории транзакций
router.get('/history', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

module.exports = router;
