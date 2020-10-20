import { Component } from '@angular/core';
import { browser } from 'webextension-polyfill-ts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  width = 800;
  height = 600;

  ngOnInit() {
  }
}
