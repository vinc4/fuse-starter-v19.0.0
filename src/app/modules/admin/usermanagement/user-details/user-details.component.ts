import { ChangeDetectorRef, Component, ElementRef, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ListUsersComponent } from '../list-users/list-users.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsService } from '../../apps/contacts/contacts.service';
import { Tag, Country,Contact, Users } from '../../apps/contacts/contacts.types';
import { TemplatePortal } from '@angular/cdk/portal';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';


@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  imports : [FuseFindByKeyPipe,CommonModule,NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, DatePipe],
})
export class UserDetailsComponent {

  @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
  @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
  @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

  editMode: boolean = false;
  createMode: boolean = false;
  tags: Tag[];
  tagsEditMode: boolean = false;
  filteredTags: Tag[];
  contact: Contact;
  User: Users;

  contactForm: UntypedFormGroup;
  contacts: Contact[];
  users: Users[];

  countries: Country[];
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _usersListComponent: ListUsersComponent,
    private _contactsService: ContactsService,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    ){

  }

  
  ngOnInit(): void
  {
      // Open the drawer
      this._usersListComponent.matDrawer.open();

      // Create the contact form phoneNumbers
      this.contactForm = this._formBuilder.group({
        id          : [''],
        avatar      : [null],
        firstName        : ['', [Validators.required]],
        emails      : this._formBuilder.array([]),
        phoneNumbers: this._formBuilder.array([]),
        title       : [''],
        company     : [''],
        birthday    : [null],
        notes       : [null],
        tags        : [[]],
        background: '',
        email : ['', [Validators.required]],
        address     : ['', [Validators.required]],
        role        : ['', [Validators.required]],
        lastName    : ['', [Validators.required]],
        phoneNumber    : ['', [Validators.required]],


    });

    this.addEmailField();
    // this.addPhoneNumberField();

      // Get the contacts
      this._contactsService.users$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((contacts: Users[]) =>
          {
              this.users = contacts;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Get the contact
      this._contactsService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Users) =>
            {
                // Open the drawer in case it is closed
                this._usersListComponent.matDrawer.open();

                contact.background = 'assets/images/cards/15-640x480.jpg';
                // Get the contact
                this.User = contact;

                // Clear the emails and phoneNumbers form arrays
                // (this.contactForm.get('emails') as UntypedFormArray).clear();
                // (this.contactForm.get('phoneNumbers') as UntypedFormArray).clear();

                const phoneNumberFormGroup = this._formBuilder.group({
                    country    : [contact.phoneCountry],
                    phoneNumber: [contact.phoneNumber],
                    label      : [''],
                });
                
                if(contact.phoneNumbers === null)
                {

                    // Add the phone number form group to the phoneNumbers form array
                    (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(phoneNumberFormGroup);
                }
               


                // Patch values to the form
                this.contactForm.patchValue(contact);

                // Setup the emails form array
                const emailFormGroups = [];

                // Setup the phone numbers form array
                const phoneNumbersFormGroups = [];

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


      // Get the country telephone codes
      this._contactsService.countries$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((codes: Country[]) =>
          {
              this.countries = codes;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Get the tags
      this._contactsService.tags$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((tags: Tag[]) =>
          {
              this.tags = tags;
              this.filteredTags = tags;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });
  }

  toggleEditMode(editMode: boolean | null = null): void
  {
      if ( editMode === null )
      {
          this.editMode = !this.editMode;
      }
      else
      {
          this.editMode = editMode;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

  toggleCreateMode(createMode: boolean | null = null): void
  {
      if ( createMode === null )
      {
          this.createMode = !this.createMode;
      }
      else
      {
          this.createMode = createMode;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

  deleteContact(): void
  {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
          title  : 'Delete user',
          message: 'Are you sure you want to delete this user? This action cannot be undone!',
          actions: {
              confirm: {
                  label: 'Delete',
              },
          },
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) =>
      {
          // If the confirm button pressed...
          if ( result === 'confirmed' )
          {
              // Get the current contact's id
              const id = this.User.id;

              // Get the next/previous contact's id
              const currentContactIndex = this.users.findIndex(item => item.id === id);
              const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.users.length - 1)) ? -1 : 1);
              const nextContactId = (this.users.length === 1 && this.users[0].id === id) ? null : this.users[nextContactIndex].id;

              // Delete the contact
              this._contactsService.deleteContact(id)
                  .subscribe((isDeleted) =>
                  {
                      // Return if the contact wasn't deleted...
                      if ( !isDeleted )
                      {
                          return;
                      }

                      // Navigate to the next contact if available
                      if ( nextContactId )
                      {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                          //this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
                      }
                      // Otherwise, navigate to the parent
                      else
                      {
                          this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                      }

                      // Toggle the edit mode off
                      this.toggleEditMode(false);
                  });

              // Mark for check
              this._changeDetectorRef.markForCheck();
          }
      });

  }

 uploadAvatar(fileList: FileList): void
 {
     // Return if canceled
     if ( !fileList.length )
     {
         return;
     }

     const allowedTypes = ['image/jpeg', 'image/png'];
     const file = fileList[0];

     // Return if the file is not allowed
     if ( !allowedTypes.includes(file.type) )
     {
         return;
     }

     // Upload the avatar
     this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
 }

 removeAvatar(): void
 {
     // Get the form control for 'avatar'
     const avatarFormControl = this.contactForm.get('avatar');

     // Set the avatar as null
     avatarFormControl.setValue(null);

     // Set the file input value as null
     this._avatarFileInput.nativeElement.value = null;

     // Update the contact
     this.contact.avatar = null;
 }

 openTagsPanel(): void
 {
     // Create the overlay
     this._tagsPanelOverlayRef = this._overlay.create({
         backdropClass   : '',
         hasBackdrop     : true,
         scrollStrategy  : this._overlay.scrollStrategies.block(),
         positionStrategy: this._overlay.position()
             .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
             .withFlexibleDimensions(true)
             .withViewportMargin(64)
             .withLockedPosition(true)
             .withPositions([
                 {
                     originX : 'start',
                     originY : 'bottom',
                     overlayX: 'start',
                     overlayY: 'top',
                 },
             ]),
     });

     // Subscribe to the attachments observable
     this._tagsPanelOverlayRef.attachments().subscribe(() =>
     {
         // Add a class to the origin
         this._renderer2.addClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

         // Focus to the search input once the overlay has been attached
         this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
     });

     // Create a portal from the template
     const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

     // Attach the portal to the overlay
     this._tagsPanelOverlayRef.attach(templatePortal);

     // Subscribe to the backdrop click
     this._tagsPanelOverlayRef.backdropClick().subscribe(() =>
     {
         // Remove the class from the origin
         this._renderer2.removeClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

         // If overlay exists and attached...
         if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
         {
             // Detach it
             this._tagsPanelOverlayRef.detach();

             // Reset the tag filter
             this.filteredTags = this.tags;

             // Toggle the edit mode off
             this.tagsEditMode = false;
         }

         // If template portal exists and attached...
         if ( templatePortal && templatePortal.isAttached )
         {
             // Detach it
             templatePortal.detach();
         }
     });
 }

 filterTags(event): void
 {
     // Get the value
     const value = event.target.value.toLowerCase();

     // Filter the tags
     this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
 }

 filterTagsInputKeyDown(event): void
 {
     // Return if the pressed key is not 'Enter'
     if ( event.key !== 'Enter' )
     {
         return;
     }

     // If there is no tag available...
     if ( this.filteredTags.length === 0 )
     {
         // Create the tag
         this.createTag(event.target.value);

         // Clear the input
         event.target.value = '';

         // Return
         return;
     }

     // If there is a tag...
     const tag = this.filteredTags[0];
     const isTagApplied = this.contact.tags.find(id => id === tag.id);

     // If the found tag is already applied to the contact...
     if ( isTagApplied )
     {
         // Remove the tag from the contact
         this.removeTagFromContact(tag);
     }
     else
     {
         // Otherwise add the tag to the contact
         this.addTagToContact(tag);
     }
 }

 createTag(title: string): void
    {
        const tag = {
            title,
        };

        // Create tag on the server
        this._contactsService.createTag(tag)
            .subscribe((response) =>
            {
                // Add the tag to the contact
                this.addTagToContact(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._contactsService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void
    {
        // Delete the tag from the server
        this._contactsService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the contact
     *
     * @param tag
     */
    addTagToContact(tag: Tag): void
    {
        // Add the tag
        this.contact.tags.unshift(tag.id);

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the contact
     *
     * @param tag
     */
    removeTagFromContact(tag: Tag): void
    {
        // Remove the tag
        this.contact.tags.splice(this.contact.tags.findIndex(item => item === tag.id), 1);

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle contact tag
     *
     * @param tag
     */
    toggleContactTag(tag: Tag): void
    {
        if ( this.contact.tags.includes(tag.id) )
        {
            this.removeTagFromContact(tag);
        }
        else
        {
            this.addTagToContact(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Add the email field
     */
    addEmailField(): void
    {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: [''],
        });

        // Add the email form group to the emails form array
        (this.contactForm.get('emails') as UntypedFormArray).push(emailFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeEmailField(index: number): void
    {
        // Get form array for emails
        const emailsFormArray = this.contactForm.get('emails') as UntypedFormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void
    {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country    : ['us'],
            phoneNumber: [''],
            label      : [''],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(phoneNumberFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void
    {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.contactForm.get('phoneNumbers') as UntypedFormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country
    {
        if(iso !== null)
        {
         return this.countries.find(country => country.iso === iso);
        }
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

    updateContact(): void
    {
        // Get the contact object
        const contact = this.contactForm.getRawValue();

        // Go through the contact object and clear empty values
        contact.emails = contact.emails.filter(email => email.email);

        contact.phoneNumbers = contact.phoneNumbers.filter(phoneNumber => phoneNumber.phoneNumber);

        // Update the contact on the server
        this._contactsService.updateUser(contact.id, contact).subscribe(() =>
        {
            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }

    
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._usersListComponent.matDrawer.close();
    }

}
