import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';

const apiUrl = 'https://mybestflix-9620fb832942.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
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
   * Retrieves a specific movie by title.
   * @param title The title of the movie.
   * @returns An Observable with the requested movie data.
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
   * Retrieves information about a director.
   * @param directorName The name of the director.
   * @returns An Observable with the director's data.
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
   * Retrieves information about a specific genre.
   * @param genreName The name of the genre.
   * @returns An Observable with the genre's data.
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
   * Retrieves a user's data.
   * @param userName The username.
   * @returns An Observable with the user's data.
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
   * Adds a movie to a user's list of favorite movies.
   * @param FavMovie The ID or title of the favorite movie.
   * @returns An Observable of the add favorite movie request.
   */
  addFavoriteMovie(FavoriteMovie: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http
      .post(apiUrl + 'users/' + userName + '/movies/' + FavoriteMovie, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Removes a movie from a user's list of favorite movies.
   * @param FavMovie The ID or title of the movie to remove.
   * @returns An Observable of the remove favorite movie request.
   */
  deleteFavoriteMovie(FavoriteMovie: string): Observable<any> {
    const token = localStorage.getItem('token');
    const Username = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http
      .delete(apiUrl + 'users/' + Username + '/movies/' + FavoriteMovie, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves a user's list of favorite movies.
   * @returns An Observable with the user's favorite movies.
   */
  getFavoriteMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http
      .get(apiUrl + 'users/' + userName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Non-typed response extraction.
   * Extracts the body of the response and returns it.
   * @param res The HTTP response.
   * @returns The body of the response or an empty object.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles errors occurred during HTTP requests.
   * @param error The HttpErrorResponse to handle.
   * @returns An Observable throwing an error message.
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
