import React, { useState } from 'react';

const BalanceInput = ({ setBalance }) => {
    const [balanceInput, setBalanceInput] = useState('');
    const [isBalanceSet, setIsBalanceSet] = useState(false);

    const handleBalanceSubmit = () => {
        if (balanceInput) {
            setBalance(balanceInput); 
            setIsBalanceSet(true); 
        } else {
            alert("Пожалуйста, введите баланс");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                {!isBalanceSet ? (
                    <div className="text-center">
                        <h2 className="text-2xl text-white mb-4">Добавьте свой текущий баланс</h2>
                        <input
                            type="number"
                            value={balanceInput}
                            onChange={(e) => setBalanceInput(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
                            placeholder="Введите баланс в Сом"
                        />
                        <button
                            onClick={handleBalanceSubmit}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Создать баланс
                        </button>
                    </div>
                ) : (
                    <p className="text-xl text-white text-center">
                        Ваш текущий баланс: <span className="font-bold">{balanceInput} Сом</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default BalanceInput;
