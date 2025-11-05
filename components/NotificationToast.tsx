import React from 'react';
import { Notification } from '../types';

interface NotificationToastProps {
    message: string;
    type: Notification['type'];
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type }) => {
    const baseClasses = 'w-full max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center gap-3 animate-fade-in-out';

    const typeClasses = {
        success: 'bg-green-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-600',
    };

    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    }

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div>{icons[type]}</div>
            <p className="font-medium text-sm">{message}</p>
        </div>
    );
};

export default NotificationToast;