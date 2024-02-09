import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

/**
 * Component for displaying movie cards with options to view details, genres, and directors.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /** Stores the list of movies fetched from the API */
  movies: any[] = []; // Consider using a more specific type if available

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  /**
   * Initializes the component by fetching the list of movies.
   */
  ngOnInit(): void {
    this.checkUserAndFetchMovies();
  }

  /**
   * Checks if user data exists in localStorage and fetches movies if the user is authenticated.
   */
  private checkUserAndFetchMovies(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['welcome']);
      return;
    }
    this.getMovies();
  }

  /**
   * Fetches movies from the API and assigns them to the `movies` array.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      // Use a specific type instead of any if possible
      this.movies = movies;
    });
  }

  /**
   * Toggles the favorite status of a movie by adding or removing it from the user's favorites.
   * @param id The ID of the movie to toggle.
   */
  toggleFavorite(id: string): void {
    this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id);
  }

  /**
   * Adds a movie to the user's list of favorites.
   * @param id The ID of the movie to add to favorites.
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Added to favorite list', 'OK', { duration: 2000 });
    });
  }

  /**
   * Checks if a movie is among the user's favorites.
   * @param id The ID of the movie to check.
   * @returns True if the movie is a favorite; otherwise, false.
   */
  isFavorite(id: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies && user.FavoriteMovies.includes(id);
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param id The ID of the movie to remove from favorites.
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Removed from favorite list', 'OK', {
        duration: 2000,
      });
    });
  }

  /**
   * Opens a dialog to display genre information.
   * @param genre The genre data to display.
   */
  getGenre(genre: any): void {
    // Consider using a more specific type
    this.dialog.open(GenreComponent, { data: { genre } });
  }

  /**
   * Opens a dialog to display director information.
   * @param director The director data to display.
   */
  getOneDirector(director: any): void {
    // Consider using a more specific type
    this.dialog.open(DirectorComponent, { data: { director } });
  }

  /**
   * Opens a dialog to display movie details.
   * @param details The movie details to display.
   */
  openMovieDetails(details: string): void {
    this.dialog.open(MovieDetailsComponent, { data: { details } });
  }
}
