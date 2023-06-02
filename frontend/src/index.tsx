import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import WidgetAdvancedSettings from './pages/widget-advanced-settings';

const createReactRoot = (domElementId: string, rootComponent: JSX.Element) => {
    const rootDOMElement: HTMLElement | null = document.getElementById(domElementId);
    if (rootDOMElement) {
        const modalRoot = ReactDOM.createRoot(rootDOMElement);
        modalRoot.render(
            <Provider store={store}>
                {rootComponent}
            </Provider>
        );
    }
}

const Wid = {

    render() {        
        return true;
    },

    init() {        
        return true;
    },

    bind_actions() {
        return true;
    },

    settings() {
        return true;
    },

    advancedSettings(subdomain: string, accountId: number) {
        createReactRoot('list_page_holder', <WidgetAdvancedSettings subdomain={subdomain} accountId={accountId} />);
        return true;
    },

    onSave() {        
        return true;
    },

    destroy() {
    },

    contacts_selected() {

    },

    leads_selected() {

    },

    tasks_selected() {

    },
};

export default Wid;