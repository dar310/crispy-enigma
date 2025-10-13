import { Component, OnInit } from '@angular/core';
import { MenuService } from '../service/menu.service';
import { Menu } from '../model/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit  {
  public menus: Menu[] = []

  constructor(private menuService: MenuService) {
  }

  ngOnInit(): void {
      this.menuService.getData().subscribe(data => {this.menus = data; });
  }
}
