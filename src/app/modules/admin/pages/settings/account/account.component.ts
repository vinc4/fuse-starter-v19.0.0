import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {Subject, takeUntil} from "rxjs";
import {User} from "../../../../../core/user/user.types";
import {UserService} from "../../../../../core/user/user.service";
import {Router} from "@angular/router";

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule],
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
}
