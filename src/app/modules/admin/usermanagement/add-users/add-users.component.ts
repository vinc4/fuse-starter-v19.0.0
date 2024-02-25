import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss',
  standalone: true,
})
export class AddUsersComponent {
  private createMode:boolean = true;
}
