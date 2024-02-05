// Import necessary Angular core modules and services for component functionality
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Component decorator to define metadata for FavoriteMoviesComponent
@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements OnInit {
  movies: any[] = []; // Array to store movie objects
  favoriteMovieIds: string[] = []; // Array to store IDs of favorite movies

  // Constructor to inject services into the component
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  /**
   * OnInit lifecycle hook to check user status and fetch favorite movies on component initialization.
   */
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Retrieve user data from local storage
    if (!user || !user._id) {
      // If no user data or user ID is found, redirect to the welcome page
      this.router.navigate(['welcome']);
      return;
    }
    this.favoriteMovieIds = user.FavoriteMovies || []; // Initialize favoriteMovieIds with user's favorite movies
    this.getMovies(); // Fetch favorite movies
  }

  /**
   * Fetches all movies and filters them to only include the user's favorites.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.filter((movie: any) =>
        this.favoriteMovieIds.includes(movie._id)
      ); // Filter movies to only include favorites
      console.log(this.movies);
    });
  }

  /**
   * Toggles the favorite status of a movie. Adds the movie to favorites if not already present, otherwise removes it.
   * @param id The ID of the movie to toggle.
   */
  toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      this.removeFavorite(id); // Remove from favorites if it's already a favorite
    } else {
      this.addFavorite(id); // Add to favorites if it's not already a favorite
    }
  }

  /**
   * Adds a movie to the user's list of favorites and shows a notification.
   * @param id The ID of the movie to add to favorites.
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Added to favorite list', 'OK', { duration: 2000 }); // Show success notification
    });
  }

  /**
   * Checks if a movie is in the user's list of favorites.
   * @param id The ID of the movie to check.
   * @returns Boolean indicating whether the movie is a favorite.
   */
  isFavorite(id: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (
      Array.isArray(user.FavoriteMovies) && user.FavoriteMovies.includes(id)
    ); // Return true if movie is a favorite
  }

  /**
   * Removes a movie from the user's list of favorites and shows a notification.
   * @param id The ID of the movie to remove from favorites.
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Removed from favorite list', 'OK', {
        duration: 2000,
      }); // Show success notification
    });
  }
}
