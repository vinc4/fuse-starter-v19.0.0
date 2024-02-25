import { Routes } from '@angular/router';
import { AuthConfirmationRequiredComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';
import { EmailConfirmationComponent } from './email-confirmation.component';

export default [
    {
        path     : '',
        component: EmailConfirmationComponent,
    },
] as Routes;
