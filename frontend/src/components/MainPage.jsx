import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionHistory from './TransactionHistory';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MainPage = ({ setIsAuthenticated }) => {
    const [balance, setBalance] = useState(localStorage.getItem('balance') || null);
    const [tempBalance, setTempBalance] = useState('');
    const [income, setIncome] = useState('');
    const [expense, setExpense] = useState('');
    const [incomeCategory, setIncomeCategory] = useState('Salary');
    const [expenseCategory, setExpenseCategory] = useState('Food');
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const checkZoom = () => {
            const zoom = Math.round(window.devicePixelRatio * 100);
            if (zoom < 34) {
                setShowEasterEgg(true);
            } else {
                setShowEasterEgg(false);
            }
        };

        window.addEventListener('resize', checkZoom);
        window.addEventListener('load', checkZoom);

        return () => {
            window.removeEventListener('resize', checkZoom);
            window.removeEventListener('load', checkZoom);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    const handleBalanceSubmit = () => {
        const parsedBalance = parseFloat(tempBalance);
        if (!isNaN(parsedBalance)) {
            setBalance(parsedBalance);
            localStorage.setItem('balance', parsedBalance);
            setTempBalance('');
        }
    };

    const handleIncomeChange = (e) => {
        setIncome(e.target.value);
    };

    const handleExpenseChange = (e) => {
        setExpense(e.target.value);
    };

    const handleIncomeCategoryChange = (e) => {
        setIncomeCategory(e.target.value);
    };

    const handleExpenseCategoryChange = (e) => {
        setExpenseCategory(e.target.value);
    };

    const handleUpdateBalance = async () => {
        const incomeValue = parseFloat(income) || 0;
        const expenseValue = parseFloat(expense) || 0;
        const newBalance = (parseFloat(balance) || 0) + incomeValue - expenseValue;

        setBalance(newBalance);
        setIncome('');
        setExpense('');
        localStorage.setItem('balance', newBalance);

        const newTransaction = {
            action: incomeValue > 0 ? 'Доход' : 'Расход',
            amount: incomeValue > 0 ? incomeValue : expenseValue,
            category: incomeValue > 0 ? incomeCategory : expenseCategory,
            balance: newBalance,
            date: new Date().toLocaleString(), // Add date for the graph's X-axis
        };

        setTransactions((prevTransactions) => {
            const updatedTransactions = [...prevTransactions, newTransaction];
            if (updatedTransactions.length > 5) {
                updatedTransactions.shift(); // Keep only the latest 5 transactions
            }
            return updatedTransactions;
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/update-balance', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ balance: newBalance }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Баланс успешно обновлен:', data.balance);
            } else {
                console.error('Ошибка при обновлении баланса:', data.message);
            }
        } catch (error) {
            console.error('Ошибка сервера:', error);
        }
    };

    const handleResetBalance = () => {
        setBalance(null);
        localStorage.removeItem('balance');
    };

    // Prepare data for the graph (last 5 transactions)
    const graphData = transactions.map((transaction, index) => ({
        name: `Транзакция ${index + 1}`, // Changed to a simple index for X-axis labels
        balance: transaction.balance,
    }));

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
            {showEasterEgg && (
                <div className="absolute top-8 left-8 bg-black text-white p-4 rounded-lg shadow-lg">
                    <p>👀 Автору нравится Ямада Рё </p>
                    <img src="/img/Secret-Yamada-Ryo.jpg" alt="" className="mt-2" />
                </div>
            )}
            <div className="absolute top-4 right-4 text-xl text-white">
                {balance !== null ? `${balance} Сом` : 'Баланс не установлен'}
            </div>
            {balance === null ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl text-white mb-4">Добавьте свой текущий баланс</h2>
                    <input
                        type="number"
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
                        placeholder="Введите баланс в Сом"
                        value={tempBalance}
                        onChange={(e) => setTempBalance(e.target.value)}
                    />
                    <button
                        onClick={handleBalanceSubmit}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Создать баланс
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl text-white mb-4">Управление доходами и расходами</h2>
                    <div className="mb-4">
                        <label className="block text-sm text-white mb-2">Доход</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
                            value={income}
                            onChange={handleIncomeChange}
                            placeholder="Введите доход"
                        />
                        <select
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
                            value={incomeCategory}
                            onChange={handleIncomeCategoryChange}
                        >
                            <option value="Salary">Зарплата</option>
                            <option value="Gifts">Подарки</option>
                            <option value="Miscellaneous">Прочее</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-white mb-2">Расход</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
                            value={expense}
                            onChange={handleExpenseChange}
                            placeholder="Введите расход"
                        />
                        <select
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
                            value={expenseCategory}
                            onChange={handleExpenseCategoryChange}
                        >
                            <option value="Food">Еда</option>
                            <option value="Transport">Транспорт</option>
                            <option value="Entertainment">Развлечения</option>
                            <option value="Miscellaneous">Прочее</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateBalance}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 mb-4"
                    >
                        Обновить баланс
                    </button>
                    <button
                        onClick={handleResetBalance}
                        className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                        Сбросить баланс
                    </button>
                </div>
            )}

            <div className="w-full max-w-4xl p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={false} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <TransactionHistory transactions={transactions} />
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded-lg mt-8"
            >
                Выйти
            </button>
        </div>
    );
};

export default MainPage;
