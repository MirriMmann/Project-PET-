import React from 'react';

const TransactionHistory = ({ transactions }) => {
    // Словарь для перевода названий категорий
    const categoryTranslation = {
        Salary: 'Зарплата',
        Gifts: 'Подарки',
        Miscellaneous: 'Прочее',
        Food: 'Еда',
        Transport: 'Транспорт',
        Entertainment: 'Развлечения'
    };

    return (
        <div className="mt-8 w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-white mb-4">История транзакций</h3>
            <table className="min-w-full bg-gray-700 text-white rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 text-left">Действие</th>
                        <th className="py-2 px-4 text-left">Сумма</th>
                        <th className="py-2 px-4 text-left">Категория</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index} className="border-t border-gray-600">
                            <td className="py-2 px-4">{transaction.action}</td>
                            <td className="py-2 px-4">{transaction.amount} Сом</td>
                            <td className="py-2 px-4">{categoryTranslation[transaction.category] || transaction.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
