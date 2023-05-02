import Application from './application';
import './index.css';
import React from 'react';
import ReportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { Context } from './componant/Context';
import { ToastProvider } from './componant/toast';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(

        <Context>
            <ToastProvider>
        <Application />
            </ToastProvider>
            </Context>


);

ReportWebVitals();
