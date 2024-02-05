import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  /**
   * This is the constructor for the component
   * @param data
   * @returns Title and Description
   */

  constructor(@Inject(MAT_DIALOG_DATA) public data: { details: string }) {}

  ngOnInit(): void {}
}
