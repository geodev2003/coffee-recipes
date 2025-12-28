import React, { createContext, useContext, useState } from 'react';
import ToastContainer from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', options = {}) => {
        const id = Date.now() + Math.random();
        const toast = {
            id,
            message,
            type,
            title: options.title,
            duration: options.duration || 3000,
            autoClose: options.autoClose !== false,
        };

        setToasts((prev) => [...prev, toast]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message, options) => showToast(message, 'success', options);
    const error = (message, options) => showToast(message, 'error', options);
    const warning = (message, options) => showToast(message, 'warning', options);
    const info = (message, options) => showToast(message, 'info', options);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

