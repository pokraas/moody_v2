import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Moody 2.0 –  Live Emotion Detection';

  sideBarOpen = false;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }


}
