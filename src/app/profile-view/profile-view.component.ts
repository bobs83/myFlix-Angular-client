import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../../fetch-api-data.service';
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
  user: User = {};

  @Input() userData: User = {
    Username: '',
    Password: '',
    Email: '',
    // Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();
    this.userData = {
      ...this.user,
      Password: '', // Password is kept empty for security
    };
  }

  submitForm() {
    // Handle the form submission logic here
    console.log('Form submitted', this.userData);
  }

  getUser(): User {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Retrieved user:', user);
    return user;
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (results) => {
        console.log('Retrieved:', results);
        localStorage.setItem('user', JSON.stringify(results));
        this.user = results;
        this.snackBar.open('Your profile has been updated', 'OK', {
          duration: 3000,
        });
        // Consider updating UI components or redirecting using Angular's Router
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
        (error) => {
          // handle error
          this.snackBar.open('Error deleting account', 'OK', {
            duration: 3000,
          });
        }
      );
    }
  }
}
