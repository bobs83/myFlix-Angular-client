import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying information about a movie genre.
 * It uses Angular Material dialog to present genre details such as title and description.
 */

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {
  /**
   * Injects genre data into the component. The data includes genre details
   * such as title and description which are used to populate the dialog.
   *
   * @param data An object containing the genre details. Expected to have properties
   * like `name` for the genre's title and `description` for its description.
   */

  constructor(@Inject(MAT_DIALOG_DATA) public data: { genre: any }) {}

  ngOnInit(): void {}
}
