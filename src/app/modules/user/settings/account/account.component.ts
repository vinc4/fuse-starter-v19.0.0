import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import {Router} from "@angular/router";

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    user: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    showAlert = false;
    _contactsService: any;
    userFirstTime = false;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _router: Router,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.accountForm = this._formBuilder.group({
            firstname: ['',[Validators.required]],
            lastname: ['',[Validators.required]],
            email   : ['', Validators.email],
            phone   : ['',[Validators.required]],
            company : ['',[Validators.required]],
            address_line_2 : [''],
            address_line_1 : ['',[Validators.required]],
            city : ['',[Validators.required]],
            state_province : ['',[Validators.required]],
            zip_postal_code : ['',[Validators.required]],
            suburb: ['',[Validators.required]],
            country : ['southafrica',[Validators.required]],
            language: ['english'],
            id: '',
        });

        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) =>
        {
            this.user = user
            this.accountForm.patchValue(user);
            if(user.addressId == null)
            {
                this.userFirstTime = true;
            }
        });


    }

    getUserData(user: User): void {
        if(user)
        {
            this._userService.get(user).subscribe((userData: User) =>{
                // this.accountForm.patchValue(userData);
                 this.user = userData;
                this._router.navigateByUrl('/landing');
            });
        }

    }

    saveUserDetails(): void
    {
        // Do nothing if the form is invalid
        if ( this.accountForm.invalid )
        {
            return;
        }

        // Disable the form
        this.accountForm.disable();

        // Hide the alert
        this.showAlert = false;

         const accountForm = this.accountForm.getRawValue();
         accountForm.id = this.user.id;
         if(accountForm.address_line_2 == null || accountForm.address_line_2 == '')
         {
             accountForm.address_line_2 = "NA"
         }
          // Update the contact on the server
          this._userService.updateUser(this.user.id, accountForm).subscribe(() =>
          {
                this.accountForm.enable();
                if(this.userFirstTime)
                {
                    this.getUserData(this.user);

                }
          });
    }


    toggleEditMode(arg0: boolean) {
        throw new Error('Method not implemented.');
    }



}
