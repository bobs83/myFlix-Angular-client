import { Component, OnInit, Input } from '@angular/core';
// This import closes the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
// This import brings in the API calls
import { FetchApiDataService } from '../../fetch-api-data.service';
// This import displays notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    const params = new HttpParams()
      .set('Username', this.userData.Username)
      .set('Password', this.userData.Password);
    console.log(params);
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        this.dialogRef.close(); // This will close the modal on success!
        console.log(result);
        this.snackBar.open(result, 'OK', { duration: 2000 });
      },
      (result) => {
        console.log(result);
        this.snackBar.open(result, 'OK', { duration: 2000 });
      }
    );
  }
}
