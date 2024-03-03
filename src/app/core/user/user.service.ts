import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Users } from 'app/modules/admin/apps/contacts/contacts.types';
import { environment } from 'environments/environment.development';
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private apiUrl = environment.apiUrl;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(user: User): Observable<User>
    {
        return this._httpClient.get<User>(this.apiUrl + 'users/' + user.id).pipe(
            tap((user) =>
            {
                this._user.next(user);
            }),
        );
    }

    getUser(user: User): void {
        this._httpClient.get<User>(`${this.apiUrl}users/${user.id}`).pipe(
          tap((userResponse: User) => {
            this._user.next(userResponse);
          })
        ).subscribe();
      }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }

    updateUser(userid: string ,user: User): Observable<any>
    {
        const url = `${this.apiUrl}UpdateUserAccount/${userid}`;

        return this._httpClient.put<Users>(url, user).pipe(
            tap(updatedContact => {

            }),
            catchError(error => {
              console.error('Error updating user:', error);
            
              return throwError(error);
            })
          );
    }
}
