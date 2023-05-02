import React from 'react';
import './toast.css';
import PropTypes from 'prop-types';
import { IAlert, IAlertType } from './interfaces';
import { useTimeout } from '../../utils/useTimeout';

interface IProps {
    alert: IAlert;
    close: Function;
}

const Toast = (props: IProps): JSX.Element => {
    useTimeout(props.close, 3000);

    return (
        <div className="my-toast">
            <div className="my-toast-header">
                <div className="my-toast-title">{props.alert.titre}</div>
                <div className="my-toast-close" onClick={() => props.close()}>
                    X
                </div>
            </div>

            <div>
                {props.alert.component}
            </div>
        </div>
    );
};

Toast.propTypes = {
    alert: PropTypes.shape(IAlertType).isRequired,
    close: PropTypes.func.isRequired
};

export { Toast };
