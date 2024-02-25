import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Contact, Country, Tag, Users } from 'app/modules/admin/apps/contacts/contacts.types';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ContactsService
{
    // Private
    private _contact: BehaviorSubject<Contact | null> = new BehaviorSubject(null);
    private _user: BehaviorSubject<Users | null> = new BehaviorSubject(null);

    private _User: BehaviorSubject<User | null> = new BehaviorSubject(null);

    private _contacts: BehaviorSubject<Contact[] | null> = new BehaviorSubject(null);
    private _Users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private apiUrl = environment.apiUrl;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<Contact>
    {
        return this._contact.asObservable();
    }

    get user$(): Observable<Users>
    {
        return this._user.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Contact[]>
    {
        return this._contacts.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    get users$(): Observable<Users[]>
    {
        return this._Users.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
    getContacts(): Observable<Contact[]>
    {
        return this._httpClient.get<Contact[]>('api/apps/contacts/all').pipe(
            tap((contacts) =>
            {
                this._contacts.next(contacts);
            }),
        );
        
    }

    getUsers(): Observable<Users []>
    {
        return this._httpClient.get<Users[]>(this.apiUrl + 'users/GetAll?UserId=1&PageNumber=11&PageSize=1').pipe(
            tap((contacts) =>
            {
                this._Users.next(contacts);
            }),
        );
    }
    /**
     * Search contacts with given query
     *
     * @param query
     */
    searchContacts(query: string): Observable<Contact[]>
    {
        return this._httpClient.get<Contact[]>('api/apps/contacts/search', {
            params: {query},
        }).pipe(
            tap((contacts) =>
            {
                this._contacts.next(contacts);
            }),
        );
    }

    /**
     * Get contact by id
     */
    getContactById(id: string): Observable<Contact>
    {
        return this._contacts.pipe(
            take(1),
            map((contacts) =>
            {
                // Find the contact
                const contact = contacts.find(item => item.id === id) || null;

                // Update the contact
                this._contact.next(contact);

                // Return the contact
                return contact;
            }),
            switchMap((contact) =>
            {
                if ( !contact )
                {
                    return throwError('Could not found contact with id of ' + id + '!');
                }

                return of(contact);
            }),
        );
    }

    getUserById(id: string): Observable<any>
    {
        return this._Users.pipe(
            take(1),
            map((contacts) =>
            {
                // Find the contact
                const contact = contacts.find(item => item.id === id) || null;

                // Update the contact
                this._user.next(contact);

                // Return the contact
                return contact;
            }),
            switchMap((contact) =>
            {
                if ( !contact )
                {
                    return throwError('Could not found contact with id of ' + id + '!');
                }

                return of(contact);
            }),
        );
    }

    /**
     * Create contact
     */
    createContact(): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/contact', {}).pipe(
                map((newContact) =>
                {
                    // Update the contacts with the new contact
                    this._contacts.next([newContact, ...contacts]);

                    // Return the new contact
                    return newContact;
                }),
            )),
        );
    }

    createUser(newUser): Observable<Users>
    {
        return this.users$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Users>(this.apiUrl + 'users', newUser).pipe(
                map((newContact) =>
                {
                    // Update the contacts with the new contact
                    this._Users.next([newContact, ...contacts]);

                    // Return the new contact
                    return newContact;
                }),
            )),
        );
    }

    /**
     * Update contact
     *
     * @param id
     * @param contact
     */
    updateContact(id: string, contact: Users): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.patch<Contact>('api/apps/contacts/contact', {
                id,
                contact,
            }).pipe(
                map((updatedContact) =>
                {
                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    }),
                )),
            )),
        );
    }

    updateUser(id: string, contact: Users): Observable<Users> {
        const url = `${this.apiUrl}UpdateUser/${id}`;
        
        return this._httpClient.put<Users>(url, contact).pipe(
          tap(updatedContact => {
            // Update the local data with the updated user
            this.users$.pipe(
              take(1),
              map(users => {
                const updatedContacts = users.map(item =>
                  item.id === id ? updatedContact : item
                );
                this._Users.next(updatedContacts);
              })
            ).subscribe();
            
            // Subscribe to user$ to get the latest value
            this.user$.pipe(
              take(1),
              filter(user => user && user.id === id)
            ).subscribe(selectedUser => {
              this._user.next(updatedContact);
            });
          }),
          catchError(error => {
            console.error('Error updating user:', error);
            // Handle error here (e.g., display error message to user)
            return throwError(error); // Rethrow the error to propagate it to the caller
          })
        );
      }
      
    updateUserx(id: string, contact: Users): Observable<Users> {
        const url = `${this.apiUrl}UpdateUser/${id}`;
        
        return this._httpClient.put<Users>(url, contact).pipe(
          tap(updatedContact => {
            // Update the local data with the updated user
            this.users$.pipe(
              take(1),
              map(users => {
                const updatedContacts = users.map(item =>
                  item.id === id ? updatedContact : item
                );
                this._Users.next(updatedContacts);
              })
            ).subscribe();
            
            // If the updated user is currently selected, update it in the selected user observable
            //  const selectedUser = this.user$.value;
            // if (selectedUser && selectedUser.id === id) {
            //   this._user.next(updatedContact);
            // }
          }),
          catchError(error => {
            console.error('Error updating user:', error);
            // Handle error here (e.g., display error message to user)
            return throwError(error); // Rethrow the error to propagate it to the caller
          })
        );
      }
      
      
      

    updateUsers(id: string, contact: Users): Observable<Users>
    {
        return this.users$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.put<Users>(this.apiUrl +'UpdateUser/' + id, {
               contact
            }).pipe(
                map((updatedContact) =>
                {
                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._Users.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.user$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        // Update the contact if it's selected
                        this._user.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    }),
                )),
            )),
        );
        
    }

      
      

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: string): Observable<boolean>
    {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.delete(this.apiUrl + 'users/' + id).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted contact
                    const index = users.findIndex(item => item.id === id);

                    // Delete the contact
                    users.splice(index, 1);

                    // Update the contacts
                    this._Users.next(users);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]>
    {
        return this._httpClient.get<Country[]>('api/apps/contacts/countries').pipe(
            tap((countries) =>
            {
                this._countries.next(countries);
            }),
        );
    }

    /**
     * Get tags
     */
    getTags(): Observable<Tag[]>
    {
        return this._httpClient.get<Tag[]>('api/apps/contacts/tags').pipe(
            tap((tags) =>
            {
                this._tags.next(tags);
            }),
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/apps/contacts/tag', {tag}).pipe(
                map((newTag) =>
                {
                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                }),
            )),
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/apps/contacts/tag', {
                id,
                tag,
            }).pipe(
                map((updatedTag) =>
                {
                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
                }),
            )),
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/contacts/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.contacts$.pipe(
                    take(1),
                    map((contacts) =>
                    {
                        // Iterate through the contacts
                        contacts.forEach((contact) =>
                        {
                            const tagIndex = contact.tags.findIndex(tag => tag === id);

                            // If the contact has the tag, remove it
                            if ( tagIndex > -1 )
                            {
                                contact.tags.splice(tagIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    }),
                )),
            )),
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: string, avatar: File): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/avatar', {
                id,
                avatar,
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': avatar.type,
                },
            }).pipe(
                map((updatedContact) =>
                {
                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    }),
                )),
            )),
        );
    }
}
