import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsermanagementComponent } from './usermanagement.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUsersComponent } from './add-users/add-users.component';

import { UserManagementRoutingModule } from './usermanagement-routing.module'; // Import the routing module
import { MatDrawerContainer } from '@angular/material/sidenav';

@NgModule({
  declarations: [



  ],
    providers:[
        ListUsersComponent,
        UsermanagementComponent,
        AddUsersComponent,
    ],
  imports: [
    CommonModule,
    ListUsersComponent,
    UsermanagementComponent,
    AddUsersComponent,
    UserManagementRoutingModule
  ],
  exports: [UsermanagementComponent]
})
export class UserManagementModule { }
