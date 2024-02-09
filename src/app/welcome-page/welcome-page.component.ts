import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

/**
 * Component for the welcome page that provides options for user registration and login.
 * Utilizes Angular Material Dialogs to present forms for user interaction.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  /**
   * Constructs the welcome page component with the dialog service injected.
   * @param dialog Service to open modal dialogs from Angular Material.
   */

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * Opens the user registration dialog with a predefined width.
   * This dialog presents the form for user registration.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '30%',
    });
  }

  /**
   * Opens the user login dialog with a predefined width.
   * This dialog presents the form for user login.
   */

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '30%',
    });
  }
}
