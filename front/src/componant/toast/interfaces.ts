import PropTypes from 'prop-types';


export interface IAlertProps {
    titre: string;
    component: JSX.Element;
}

export interface IAlert extends IAlertProps {
    id: string;
}

const IAlertType = {
    titre: PropTypes.string,
    component: PropTypes.element,
    id: PropTypes.string
};

export interface IToast {
    open: (alert: IAlertProps) => void;
    close: (id: number) => void;
}

export { IAlertType };
