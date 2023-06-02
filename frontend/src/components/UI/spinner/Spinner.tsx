import React from 'react';
import cl from './spinner.module.scss';

function Spinner() {
    return (
        <div className={cl.spinner}>
            <div className={"button-input__spinner"}>
                <span className="button-input__spinner__icon spinner-icon spinner-icon-white"></span>
            </div>
        </div>
    )
}

export default Spinner
