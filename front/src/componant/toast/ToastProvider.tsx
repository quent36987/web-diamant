import React, { useState, useMemo } from 'react';
import './toast.css';
import { ToastContext } from './ToastContext';
import { Toast } from './Toast';
import { IAlert, IAlertProps } from './interfaces';
import { generateUEID } from '../../utils/maths';
import { debugLog } from '../../utils/logger';

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

    const closeFirst = (): void => {
        setToasts((currentToasts) => currentToasts.slice(1));
    };

    const contextValue = useMemo(() => ({ open, closeFirst }), []);

    return (
        <ToastContext.Provider value={contextValue}>
            <div className="toasts-wrapper" onClick={closeFirst}>
                {toasts.length > 0 && (
                    <Toast key={toasts[0].id} alert={toasts[0]} close={() => close(toasts[0].id)} />
                )}
            </div>
            {children}
        </ToastContext.Provider>
    );
};
