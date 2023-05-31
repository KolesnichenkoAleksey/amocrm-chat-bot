define(['./index.js'], function (App) {

	const Widget = function () {

		const self = this;
		system = this.system();
		langs = this.langs;

		/** @private */
		this.callbacks = {
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
				const subdomain = system.subdomain;
				const accountId = AMOCRM.constant('account').id;
				App.default.advancedSettings(subdomain, accountId);
			},
			onSave() {
				return true;
			},
			destroy() {
				return true;
			},
			contacts: {
				selected() {}
			},
			leads: {
				selected() {}
			},
			tasks: {
				selected() {}
			},
		};

		return this;
	};

	return Widget;
});