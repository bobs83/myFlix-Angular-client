import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * Component for rendering the navigation bar of the application.
 * This component includes navigation links and logout functionality.
 */

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  /**
   * Constructs the NavbarComponent with injected dependencies.
   *
   * @param router Service for navigating among views.
   */
  constructor(public router: Router) {}

  /**
   * Logs out the user by navigating to the welcome screen and clearing user data from local storage.
   */

  logoutUser(): void {
    this.router.navigate(['welcome']); // Navigates to the welcome page
    localStorage.removeItem('user'); // Removes the 'user' item from local storage
    localStorage.removeItem('token'); // Removes the 'token' item from local storage
  }
}
