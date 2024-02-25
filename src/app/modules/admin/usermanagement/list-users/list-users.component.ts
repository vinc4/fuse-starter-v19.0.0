import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, DOCUMENT, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Observable, Subject, filter, fromEvent, switchMap, takeUntil } from 'rxjs';
import { Contact } from '../../apps/chat/chat.types';
import { Country, Users } from '../../apps/contacts/contacts.types';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from '../../apps/contacts/contacts.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  standalone: true,
  imports        : [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe],
})
export class ListUsersComponent implements OnInit, OnDestroy {

    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    contacts$: Observable<Contact[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
      private _activatedRoute: ActivatedRoute,
      private _changeDetectorRef: ChangeDetectorRef,
      private _contactsService: ContactsService,
      @Inject(DOCUMENT) private _document: any,
      private _router: Router,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
  )
  {
  }
  
  ngOnInit(): void
  {
      // Get the contacts
      this.contacts$ = this._contactsService.users$;
      this._contactsService.users$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((users: Users[]) =>
          {
              // Update the counts
              this.contactsCount = users.length;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Get the contact
      this._contactsService.contact$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((contact: Contact) =>
          {
              // Update the selected contact
              this.selectedContact = contact;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Get the countries
      this._contactsService.countries$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((countries: Country[]) =>
          {
              // Update the countries
              this.countries = countries;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Subscribe to search input field value changes
      this.searchInputControl.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              switchMap(query =>

                  // Search
                  this._contactsService.searchContacts(query),
              ),
          )
          .subscribe();

      // Subscribe to MatDrawer opened change
      this.matDrawer.openedChange.subscribe((opened) =>
      {
          if ( !opened )
          {
              // Remove the selected contact when drawer closed
              this.selectedContact = null;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          }
      });

      // Subscribe to media changes
      this._fuseMediaWatcherService.onMediaChange$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(({matchingAliases}) =>
          {
              // Set the drawerMode if the given breakpoint is active
              if ( matchingAliases.includes('lg') )
              {
                  this.drawerMode = 'side';
              }
              else
              {
                  this.drawerMode = 'over';
              }

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Listen for shortcuts
      fromEvent(this._document, 'keydown')
          .pipe(
              takeUntil(this._unsubscribeAll),
              filter<KeyboardEvent>(event =>
                  (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                  && (event.key === '/'), // '/'
              ),
          )
          .subscribe(() =>
          {
              this.createContact();
          });
  }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    createContact(): void
    {
      this._router.navigate(['./list-users/new-user']);
      //this._router.navigate(['./new-user'], {relativeTo: this._activatedRoute});
        return;
        
        // Create the contact [routerLink]="['./', contact.id]"
        // this._contactsService.createContact().subscribe((newContact) =>
        // {
        //     // Go to the new contact [routerLink]="['./', contact.id]"
        //     this._router.navigate(['./', newContact.id], {relativeTo: this._activatedRoute});

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


        /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
        trackByFn(index: number, item: any): any
        {
            return item.id || index;
        }

    
}
