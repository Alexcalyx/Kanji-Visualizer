import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { XCircle } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext'; // Adjust path

function ErrorDisplay({ message, context }) {
    const { theme } = useContext(ThemeContext);
    if (!message) return null;

    return (
        <div className={`text-center p-6 md:p-8 rounded-lg border-l-4 shadow-lg ${
            theme === 'light'
                ? 'bg-secondary/10 border-secondary text-secondary-dark'
                : 'bg-neon-magenta/10 border-neon-magenta text-neon-magenta' // Use neon magenta
        }`}>
            <p className="font-semibold font-heading text-lg flex items-center justify-center gap-2">
                <XCircle size={20} /> Error {context || 'Loading Data'}:
            </p>
            <p className="text-sm mt-2">{message}</p>
        </div>
    );
}

ErrorDisplay.propTypes = {
    message: PropTypes.string,
    context: PropTypes.string
};

export default ErrorDisplay;