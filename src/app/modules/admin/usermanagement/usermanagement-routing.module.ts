import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';

import { UsermanagementComponent } from './usermanagement.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { ContactsService } from '../apps/contacts/contacts.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { catchError, throwError } from 'rxjs';
import { NewUserComponent } from './new-user/new-user.component';

const contactResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const contactsService = inject(ContactsService);
    const router = inject(Router);

    return contactsService.getUserById(route.paramMap.get('id'))
        .pipe(
            // Error here means the requested contact is not available
            catchError((error) =>
            {
                // Log the error
                console.error(error);

                // Get the parent url
                //const parentUrl = state.url.split('/').slice(0, -1).join('/');
                const parentUrl = state.url;


                // Navigate to there
                //router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            }),
        );
};

const canDeactivateContactsDetails = (
    component: UserDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) =>
{
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while ( nextRoute.firstChild )
    {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if ( !nextState.url.includes('/list-users') )
    {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if ( nextRoute.paramMap.get('id') )
    {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

const canDeactivateAddUserDetails = (
  component: NewUserComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot) =>
{
  // Get the next route
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while ( nextRoute.firstChild )
  {
      nextRoute = nextRoute.firstChild;
  }

  // If the next state doesn't contain '/contacts'
  // it means we are navigating away from the
  // contacts app
  if ( !nextState.url.includes('/list-users') )
  {
      // Let it navigate
      return true;
  }

  // If we are navigating to another contact...
  if ( nextRoute.paramMap.get('id') )
  {
      // Just navigate
      return true;
  }

  // Otherwise, close the drawer first, and then navigate
  return component.closeDrawer().then(() => true);
};

const routes: Routes = [
  {
    path: '',
    component: UsermanagementComponent,
    children: [
      {
        path: '', 
        redirectTo: 'list-users',
        pathMatch: 'full'
      },
      {
        path: 'list-users',
        component: ListUsersComponent,
        resolve: {
            users : () => inject(ContactsService).getUsers(),
            countries: () => inject(ContactsService).getCountries(),
        },
        children : [
            {
            path         : 'new-user',
            component    : NewUserComponent,
            canDeactivate: [canDeactivateContactsDetails],
            
           },
            {
                path         : ':id',
                component    : UserDetailsComponent,
                resolve      : {
                    contact  : contactResolver,
                    countries: () => inject(ContactsService).getCountries(),
                },
                canDeactivate: [canDeactivateContactsDetails],
            },

        ],
      },
      {
        path: 'add-users',
        component: AddUsersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
