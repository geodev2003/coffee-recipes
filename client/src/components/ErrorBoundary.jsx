import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-warm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl w-full text-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="p-4 bg-red-100 rounded-full">
                                <AlertTriangle size={64} className="text-red-600" />
                            </div>
                        </motion.div>
                        
                        <h1 className="text-4xl font-serif font-bold text-coffee-900 mb-4">
                            Oops! Something went wrong
                        </h1>
                        
                        <p className="text-lg text-coffee-800/70 mb-8">
                            We're sorry, but something unexpected happened. Please try refreshing the page or return to the home page.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-8 text-left bg-red-50 p-4 rounded-lg border border-red-200">
                                <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs text-red-700 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={this.handleReset}
                                className="btn-primary inline-flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={20} />
                                Try Again
                            </motion.button>
                            
                            <Link
                                to="/"
                                className="btn-secondary inline-flex items-center justify-center gap-2"
                            >
                                <Home size={20} />
                                Go Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

