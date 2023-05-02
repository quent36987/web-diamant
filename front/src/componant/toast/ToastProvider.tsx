import React, { useState, useMemo } from 'react';
import './toast.css';
import { ToastContext } from './ToastContext';
import { Toast } from './Toast';
import { IAlert, IAlertProps } from './interfaces';
import { generateUEID } from '../../utils/maths';
import { debugLog, errorLog, infoLog } from '../../utils/logger';

// eslint-disable-next-line react/prop-types
export const ToastProvider = ({ children }): JSX.Element => {
    const [toasts, setToasts] = useState<IAlert[]>([]);

    const open = (content: IAlertProps): void => {
        setToasts((currentToasts) => [{ id: generateUEID(), ...content }, ...currentToasts]);
        debugLog('[TOAST] open', content.titre);
    };

    const close = (id): void => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    };

    const contextValue = useMemo(() => ({ open }), []);

    return (
        <ToastContext.Provider value={contextValue}>
            <div className="toasts-wrapper">
                {toasts.map((toast) => (
                    <Toast key={toast.id} alert={toast} close={() => close(toast.id)} />
                ))}
            </div>
            {children}
        </ToastContext.Provider>
    );
};
