import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';

const apiUrl = 'https://mybestflix-9620fb832942.herokuapp.com/';

/**
 * Service to handle all API calls to the backend server.
 * This service includes functions for user registration and login, fetching movies, genres, directors,
 * user information, and managing favorite movies.
 */

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  private userData = new BehaviorSubject<Object>({
    Username: '',
    Password: '',
    Email: '',
    Birth: '',
  });

  /**
   * Observable for the current user data.
   */

  currentUser = this.userData.asObservable();

  private movies = new BehaviorSubject<Object>({});

  /**
   * Observable for the list of movies.
   */
  moviesList = this.movies.asObservable();

  /**
   * Constructor to inject HttpClient into the service.
   * @param http The HttpClient which is used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userDetails The user's registration details.
   * @returns An Observable of the registration request.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param userDetails The user's login details.
   * @returns An Observable of the login request.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);

    let params = '';
    for (let key in userDetails) {
      if (userDetails.hasOwnProperty(key)) {
        params += `&${encodeURIComponent(key)}=${encodeURIComponent(
          userDetails[key]
        )}`;
      }
    }
    params = params.substring(1); // remove leading '&'

    const url = `${apiUrl}login?${params}`;

    return this.http.post(url, null).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all movies.
   * @returns An Observable with the list of all movies.
   */

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves a single movie by its title.
   * @param title The title of the movie.
   * @returns An Observable with the details of the movie.
   */

  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves movies directed by a specific director.
   * @param directorName The name of the director.
   * @returns An Observable with the list of movies directed by the specified director.
   */

  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/director/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves movies belonging to a specific genre.
   * @param genreName The name of the genre.
   * @returns An Observable with the list of movies belonging to the specified genre.
   */

  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genre/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves user information by username.
   * @param userName The username of the user.
   * @returns An Observable with the user's information.
   */

  getUser(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + userName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Updates user information.
   * @param updatedUser The updated user information.
   * @returns An Observable with the updated user information.
   */

  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    console.log('Attempting to update user:', user.Username, updatedUser); // Debugging

    return this.http
      .put(apiUrl + 'users/' + user.Username, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        catchError((error) => {
          console.error('Error in editUser:', error);
          return throwError(() => new Error('Error editing user'));
        })
      );
  }

  /**
   * Deletes a user account.
   * @returns An Observable indicating the success or failure of the operation.
   */

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    return this.http
      .delete(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the list of favorite movies for the current user.
   * @returns An Observable with the list of favorite movies.
   */

  public getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        tap((data) => console.log(data.FavoriteMovies)), // Logging the favorite movies here
        map((data) => data.FavoriteMovies), // Continue the stream with the favorite movies
        catchError(this.handleError)
      );
  }

  /**
   * Checks if a movie is in the user's list of favorite movies.
   * @param movieId The ID of the movie to check.
   * @returns A boolean indicating whether the movie is a favorite.
   */

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Ensures FavoriteMovies is always treated as an array and access the correct property name
    const favoriteMovies = Array.isArray(user.FavoriteMovies)
      ? user.FavoriteMovies
      : [];
    return favoriteMovies.includes(movieId);
  }

  /**
   * Adds a movie to a user's list of favorite movies.
   * @param FavoriteMovie The ID or title of the favorite movie.
   * @returns An Observable of the add favorite movie request.
   */
  public addFavoriteMovie(movieId: string): Observable<any> {
    if (!movieId) {
      console.error('movieId is undefined');
      return throwError(() => new Error('movieId is undefined'));
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .post(
        apiUrl + 'users/' + user.Username + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
          responseType: 'text',
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   * @param movieId The ID of the movie to remove from favorites.
   * @returns An Observable indicating the success or failure of the operation.
   */

  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Extracts response data from an HTTP response.
   * @param res The HTTP response object.
   * @returns The extracted response data.
   */

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   * @returns An observable error indicating the failure.
   */

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
