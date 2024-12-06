import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                setIsAuthenticated(true); 
                alert('Вы успешно вошли в аккаунт!');
                navigate('/main'); 
            } else {
                alert(data.message || 'Ошибка входа');
            }
        } catch (error) {
            alert('Ошибка сервера');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
                <div className="w-full lg:w-1/2 p-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <h2 className="text-3xl font-bold text-white mb-6">Вход</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="password">
                                Пароль
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Войти
                        </button>
                    </form>
                </div>
                <div className="hidden lg:block lg:w-1/2">
                    <img
                        src="/img/LogIn-Ryo-Yamada.jpg"
                        alt="Пример изображения"
                        className="max-w-full max-h-full rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-300">
                            Нет аккаунта?{' '}
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Зарегистрируйтесь
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
