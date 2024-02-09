import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type User = {
  _id?: string;
  Username?: string;
  Password?: string;
  Email?: string;
  Birthday?: string;
  FavoriteMovies?: any[];
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  /** Holds the current user's profile data. */
  user: User = {};

  /** Stores a list of the user's favorite movies. */
  favoriteMovies: any[] = [];

  /**
   * Input property to receive user data, from a parent component.
   * It initializes with default empty values and a favorite movies list.
   */

  @Input() userData: User = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };

  /**
   * Constructs the UserProfile component with necessary dependencies.
   *
   * @param fetchApiData Service to fetch data from the backend API.
   * @param snackBar Service to display notifications.
   * @param router Service for navigating to different pages.
   */

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  /**
   * Placeholder for form submission logic.
   */
  submitForm() {
    // Handle the form submission logic here
    console.log('Form submitted', this.userData);
  }
  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Retrieves the user's data from local storage and updates the component's user and favoriteMovies properties.
   */

  getUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Retrieved user:', user);

    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.favoriteMovies = response.filter(
        (m: { _id: any }) => user.FavoriteMovies?.indexOf(m._id) >= 0
      );
      this.user = user;
      this.userData = {
        ...this.user,
        Password: '', // Password is kept empty for security
        FavoriteMovies: this.favoriteMovies,
      };
    });
  }

  /**
   * Updates the user's data on the server and locally, then notifies the user of success or error.
   */

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (results) => {
        console.log('Retrieved:', results);
        localStorage.setItem('user', JSON.stringify(results));
        this.user = results;
        this.snackBar.open('Your profile has been updated', 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error('Update error:', error);
        let errorMessage = 'Something went wrong';
        // Customize the error message based on the error object
        if (error.error?.errors) {
          errorMessage = error.error.errors.map((e: any) => e.msg).join(', ');
        }
        this.snackBar.open(errorMessage, 'OK', {
          duration: 3000,
        });
      }
    );
  }

  /**
   * Confirms with the user before deleting their account, then proceeds with the deletion.
   */

  deleteUser(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser().subscribe(
        (result) => {
          console.log(result);
          localStorage.clear();
          this.router.navigate(['welcome']).then(() => {
            this.snackBar.open('Your account has been deleted', 'OK', {
              duration: 3000,
            });
          });
        },
        (err) => {
          // handle error
          this.snackBar.open('Error deleting account', 'OK', {
            duration: 3000,
          });
        }
      );
    }
  }
}
