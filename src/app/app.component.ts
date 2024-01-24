import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MovieCardComponent } from './movie-card/movie-card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'movie_api-Angular-client';

  constructor(public dialog: MatDialog) {}

  // This is the function that will open the dialog when the signup button is clicked
  openUserRestrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  // This is the function that will open the dialog when the login button is clicked
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }

  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '500px',
    });
  }
}
