import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component responsible for displaying and managing a user's favorite movies.
 */
@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements OnInit {
  /** Array to store movie objects that the user has marked as favorites. */
  movies: any[] = [];
  /** Array to store IDs of the user's favorite movies for quick access and manipulation. */
  favoriteMovieIds: string[] = [];

  /**
   * Constructor for FavoriteMoviesComponent.
   * @param fetchApiData Service to fetch movie data from the backend.
   * @param router Service to navigate between routes.
   * @param snackBar Service to display notifications.
   * @param dialog Service to handle modal dialogs.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  /**
   * OnInit lifecycle hook to initialize the component by fetching the user's favorite movies.
   */
  ngOnInit(): void {
    this.checkUserStatusAndFetchFavorites();
  }

  /**
   * Checks if a user is logged in and fetches their favorite movies if they are.
   * Redirects to the welcome page if the user is not logged in.
   * If the user is logged in, it fetches the user's favorite movies and stores them in the component.
   */
  private checkUserStatusAndFetchFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user._id) {
      this.router.navigate(['welcome']);
      return;
    }
    this.favoriteMovieIds = user.FavoriteMovies || [];
    this.getMovies();
  }

  /**
   * Fetches all movies and filters them to only include the user's favorites.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any[]) => {
      this.movies = resp.filter((movie) =>
        this.favoriteMovieIds.includes(movie._id)
      );
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
   * Adds a movie to the user's list of favorites and shows a success notification.
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
   * Removes a movie from the user's list of favorites and shows a success notification.
   * @param id The ID of the movie to remove from favorites.
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Removed from favorite list', 'OK', {
        duration: 2000,
      });
    });
  }
}
