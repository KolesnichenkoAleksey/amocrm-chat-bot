import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import '../widget/modules/settingsREON/style-settings.css'

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

    advancedSettings() {
        const rootPapa:HTMLElement | null = document.getElementById('list_page_holder') ? document.getElementById('list_page_holder') : null;
        if (rootPapa) {

        const root = ReactDOM.createRoot(rootPapa);
        root.render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        }
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

    }

};

export default Wid;