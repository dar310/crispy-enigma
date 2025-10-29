import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MainBodyComponent } from "../main-body/main-body.component";

@Component({
  selector: 'app-homepage',
  imports: [HeaderComponent, MainBodyComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {

}
