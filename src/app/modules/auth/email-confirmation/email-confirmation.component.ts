import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss',
  
})
export class EmailConfirmationComponent {
  userId: string;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
    });

    this.sendConfirmationEmail();
  }

  sendConfirmationEmail() {
    this._authService.sendConfirmationEmail(this.userId,this.token)
    .subscribe((response) => {
        if(response)
        {
          alert('Email confimation sucessful ');
        }
    });

  }
}
