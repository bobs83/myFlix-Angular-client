import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying information about a movie synopis.
 * It uses Angular Material dialog to present movie synopsis details
 */

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  /**
   * Injects movie synopsis into the component for display.
   * The `data` object is expected to contain a string that holds movie synopsis.
   *
   * @param data An object containing the synopsis The `synopsis` property
   *             of this object should be a string that include the movie
   *            synopsis to be displayed.
   */

  constructor(@Inject(MAT_DIALOG_DATA) public data: { details: string }) {}

  ngOnInit(): void {}
}
