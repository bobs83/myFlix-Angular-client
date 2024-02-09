import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description Component representing a director card.
 * @selector 'app-director'
 * @templateUrl './director.component.html'
 * @styleUrls ['../director.component.scss']
 */

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss'],
})

/**
 * Injects data about the director into the component.
 * @param data An object containing information about the director.
 */
export class DirectorComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { director: any }) {}

  ngOnInit(): void {}
}
