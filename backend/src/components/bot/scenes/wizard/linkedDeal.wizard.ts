import { Scenes } from 'telegraf';
import { WizardSteps } from './linkedDeal.wizardSteps';

export const linkedDealWizard = new Scenes.WizardScene(
    'linked-deal-wizard',
    WizardSteps.listDeal,
    WizardSteps.dealMenu,
    WizardSteps.proofActionButtons,
    WizardSteps.acceptAction
);
