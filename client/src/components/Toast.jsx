import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (toast.autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, toast.duration || 3000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-green-600" />,
        error: <XCircle size={20} className="text-red-600" />,
        warning: <AlertCircle size={20} className="text-yellow-600" />,
        info: <Info size={20} className="text-blue-600" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`glass-card p-4 border-l-4 shadow-lg min-w-[300px] max-w-md ${bgColors[toast.type] || bgColors.info}`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {icons[toast.type] || icons.info}
                </div>
                <div className="flex-1">
                    {toast.title && (
                        <h4 className="font-semibold text-coffee-900 mb-1">
                            {toast.title}
                        </h4>
                    )}
                    <p className="text-sm text-coffee-800/80">
                        {toast.message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-coffee-600 hover:text-coffee-900 transition-colors p-1"
                >
                    <X size={18} />
                </button>
            </div>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={toast} onClose={() => removeToast(toast.id)} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;

// Toast hook/context
export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

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

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};

