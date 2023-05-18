define(['./index.js', './modules/settingsREON/settings-reon.js'], function (App, settingREON) {

	const Widget = function () {

		const self = this;
		self.system = this.system();
		self.langs = this.langs;

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
				const settings = self.langs.settings;
				const SUBDOMAIN = self.system.subdomain;
				const settingPattern = new settingREON(self, [])
				settingPattern.insertFooterLinksBlock()

				settingPattern.createSettingsBody([
					{
						name: 'Настройки',
						id: 'reon_main_settings',
						main: true
					},
					{
						name: 'Пользователи',
						id: 'reon_users'
					},
					{
						name: 'Подписка',
						id: 'reon_payment'
					}
				]);

				const mainSettingBody = document.querySelector(`[id-body="reon_main_settings"]`)
				mainSettingBody.insertAdjacentElement('beforeend', settingPattern.returnAndRemoveStandartSettingsInput('client_name'))
				mainSettingBody.insertAdjacentElement('beforeend', settingPattern.returnAndRemoveStandartSettingsInput('phone_number'))
				settingPattern.createCheckbox(mainSettingBody, 'terms_of_use', 'Я прочитал(-а) <a href="https://drive.google.com/file/d/13HBl0vCbeyxANlA3VszC57_xZP-IJbpw/view" target="_blank">Условия</a> соглашения и согласен(-на) с условиями')

				const reonUsersBody = document.querySelector(`[id-body="reon_users"]`)
				settingPattern.insertAccessUsersBlock(reonUsersBody, 'beforeend')
				reonUsersBody.insertAdjacentElement('beforeend', settingPattern.returnAndRemoveStandartSettingsInput('access_for_users', true))

				const reonPaymentBody = document.querySelector(`[id-body="reon_payment"]`)
				settingPattern.insertForwardToContact(reonPaymentBody, 'https://reon.pro/interface_amocrm')
				settingPattern.insertPriceBlock(reonPaymentBody, 'beforeend', [
					{
						title: 'Минимальный срок оплаты виджета',
						period: '6 месяцев',
						value: '2 994 ₽',
						active: true
					},
					{
						title: '2 месяца работы виджета в подарок при оплате',
						period: '10 месяцев',
						value: '4 990 ₽'
					}
				])
				settingPattern.insertSubscribeTimeInfo(reonPaymentBody, `https://widev3.reon.pro/widgets/hints/status?subdomain=${SUBDOMAIN}`);
			},
			advancedSettings() {
				
			},
			onSave() {
				const settings = self.get_settings()
				const widgetSettingsPopup = document.querySelector(".widget-settings");
				const widgetSettingsBlock = widgetSettingsPopup.querySelector(".widget_settings_block__fields");
				
				const userNameInputSetting = widgetSettingsBlock.querySelector('input[name="client_name"]');
				const phoneNumberInput = widgetSettingsBlock.querySelector('input[name="phone_number"]');
				const termsOfUseField = document.querySelector('input[name="terms_of_use-checkbox-item"]');
				const accessForUsers = document.querySelector('input[name="access_for_users"]');
				console.log({
					userName: userNameInputSetting.value,
					userPhone: phoneNumberInput.value,
					account: AMOCRM.constant("account").id,
					widgetName: "amocrm-chat-bot",
					termsOfUse: termsOfUseField.value,
					// accessForUsers: accessForUsers.value,
					accountSubdomain: AMOCRM.constant("account").subdomain,
					widgetStatus: settings.active,
					client_uuid: settings.oauth_client_uuid,
					enumId: 1066197
				});
				
				return true;
			},
			destroy() {
				return true;
			},
			contacts: {
				selected() {

				}
			},
			leads: {
				selected() {

				}
			},
			tasks: {
				selected() {

				}
			}
		};

		return this;

	};

	return Widget;

});