import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description Component representing a genre card.
 * @selector 'app-genre'
 * @templateUrl './genre.component.html'
 * @styleUrls ['../genre.component.scss']
 */

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {
  /**
   * This is the constructor for the component
   * @param data
   * @returns Genre Title and Description
   */

  constructor(@Inject(MAT_DIALOG_DATA) public data: { genre: any }) {}

  ngOnInit(): void {}
}
