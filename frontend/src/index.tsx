import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import WidgetAdvancedSettings from './pages/widget-advanced-setings';
import '../widget/modules/settingsREON/style-settings.css';

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

    advancedSettings(SUBDOMAIN: string) {
        const rootAdvancedWidgetSettings:HTMLElement | null = document.getElementById('list_page_holder');

        if (rootAdvancedWidgetSettings) {
            const rootAdvancedSettings = ReactDOM.createRoot(rootAdvancedWidgetSettings);
            rootAdvancedSettings.render(
                <Provider store={store}>
                    <WidgetAdvancedSettings
                        SUBDOMAIN={SUBDOMAIN}
                    />
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

    },
};

export default Wid;