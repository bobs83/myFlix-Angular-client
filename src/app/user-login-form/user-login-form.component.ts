import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for the user login form.
 * Handles user authentication, providing feedback and redirecting the user upon successful login.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Input property for user data bound to the login form.
   */
  @Input() userData = { Username: '', Password: '' };

  /**
   * Constructs the user login form component with injected services for API calls, dialog handling, notifications, and routing.
   * @param fetchApiData Service for making API calls.
   * @param dialogRef Reference to the dialog opened.
   * @param snackBar Service for displaying snack bar notifications.
   * @param router Service for routing to different paths.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Submits the user login form, attempting to authenticate the user.
   * Upon successful authentication, closes the dialog, stores the user token and data in local storage, and navigates to the movies view.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        this.dialogRef.close(); // Close the modal on success
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.snackBar.open('Welcome back!', 'OK', { duration: 2000 });
        this.router.navigate(['movies']); // Navigate to movies view upon successful login
      },
      error: () => {
        this.snackBar.open(
          'Failed to log in. Please check your username and password.',
          'OK',
          {
            duration: 2000,
          }
        );
      },
    });
  }
}
