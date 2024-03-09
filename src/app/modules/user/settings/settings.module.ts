import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {SettingsComponent} from "./settings.component";
import {SettingsNotificationsComponent} from "./notifications/notifications.component";
import {SettingsTeamComponent} from "./team/team.component";
import {SettingsPlanBillingComponent} from "./plan-billing/plan-billing.component";
import {SettingsSecurityComponent} from "./security/security.component";
import {SettingsAccountComponent} from "./account/account.component";
import settingsRoutes from "./settings.routes";
import {SharedModule} from "../../../shared/shared.module";
import {FuseAlertComponent} from "../../../../@fuse/components/alert";

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,

    ],
    imports: [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        SharedModule,
        FuseAlertComponent
    ]
})
export class SettingsModule
{
}
