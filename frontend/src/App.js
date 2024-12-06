import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import MainPage from './components/MainPage';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    const addTransaction = (transaction) => {
        setTransactions((prevTransactions) => {
            const updatedTransactions = [...prevTransactions, transaction];
            if (updatedTransactions.length > 5) {
                updatedTransactions.shift();
            }
            return updatedTransactions;
        });
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/main" replace />
                            ) : (
                                <LoginForm setIsAuthenticated={setIsAuthenticated} />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/main" replace />
                            ) : (
                                <RegistrationForm setIsAuthenticated={setIsAuthenticated} />
                            )
                        }
                    />
                    <Route
                        path="/main"
                        element={
                            isAuthenticated ? (
                                <MainPage
                                    setIsAuthenticated={setIsAuthenticated}
                                    addTransaction={addTransaction}
                                    transactions={transactions}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
