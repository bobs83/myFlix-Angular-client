import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
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
  private userData = new BehaviorSubject<Object>({
    Username: '',
    Password: '',
    Email: '',
    Birth: '',
  });
  currentUser = this.userData.asObservable();

  private movies = new BehaviorSubject<Object>({});
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
   * @param FavMovie The ID or title of the favorite movie.
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

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

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