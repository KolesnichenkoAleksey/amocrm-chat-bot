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
				App.default.advancedSettings(subdomain);
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