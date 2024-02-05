// Import necessary modules and components from Angular and Angular Material
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Import additional components used in this module
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

// Define the component using the @Component decorator
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  // Define a variable to store movie data retrieved from the API
  movies: any[] = [];

  // Constructor method with dependency injection
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  // Lifecycle hook - ngOnInit is called when the component is initialized
  ngOnInit(): void {
    // Check if user data is stored in localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      // If user data is not found, navigate to the 'welcome' route
      this.router.navigate(['welcome']);
      return;
    }
    // Fetch the list of movies when the component is initialized
    this.getMovies();
  }

  // Method to fetch a list of movies from the API
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      // Store the retrieved movies in the 'movies' variable
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Method to toggle the favorite status of a movie
  toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(id);
    }
  }

  /**
   * This method adds a movie to the user's list of favorites
   * @param id - The ID of the movie to add to favorites
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
      // Display a snack bar notification when a movie is added to favorites
      this.snackBar.open('Added to favorite list', 'OK', {
        duration: 2000,
      });
    });
  }

  // Method to check if a movie is in the user's list of favorites
  isFavorite(id: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (
      Array.isArray(user.FavoriteMovies) && user.FavoriteMovies.includes(id)
    );
  }

  /**
   * This method removes a movie from the user's list of favorites
   * @param id - The ID of the movie to remove from favorites
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      // Display a snack bar notification when a movie is removed from favorites
      this.snackBar.open('Removed from favorite list', 'OK', {
        duration: 2000,
      });
    });
  }

  /**
   * Open a dialog to display genre information from GenreComponent
   * @param genre - The genre data to display
   */
  public getGenre(genre: any) {
    this.dialog.open(GenreComponent, {
      data: { genre: genre },
    });
  }

  /**
   * Open a dialog to display director information from DirectorComponent
   * @param director - The director data to display
   */
  public getOneDirector(director: any) {
    this.dialog.open(DirectorComponent, {
      data: { director: director },
    });
  }

  /**
   * Open a dialog to display movie details from MovieDetailsComponent
   * @param details - The movie details to display
   */
  public openMovieDetails(details: string) {
    this.dialog.open(MovieDetailsComponent, {
      data: { details: details },
    });
  }
}
