import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsermanagementComponent } from './usermanagement.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUsersComponent } from './add-users/add-users.component';

import { UserManagementRoutingModule } from './usermanagement-routing.module'; // Import the routing module
import {MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule} from "@angular/router";

import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {SharedModule} from "../../../shared/shared.module";
import {FuseAlertComponent} from "../../../../@fuse/components/alert";

@NgModule({

  declarations: [
      ListUsersComponent,
      UsermanagementComponent,
      AddUsersComponent,
  ],
    providers:[
        ListUsersComponent,
        UsermanagementComponent,
        AddUsersComponent,
    ],
  imports: [
      UserManagementRoutingModule,
    CommonModule,
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

  ],
  exports: [UsermanagementComponent]
})
export class UserManagementModule { }
