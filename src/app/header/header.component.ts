import { Component, Input, signal } from '@angular/core';
import { SearchAndFilterComponent } from "../search-and-filter/search-and-filter.component";
import { Router} from '@angular/router';
import { User } from '../model/user';

@Component({
  selector: 'app-header',
  imports: [SearchAndFilterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showUserMenu = signal(false);
  UserComponent: any;
  @Input() user!: User;
  constructor(
    // private route: ActivatedRoute,
    private router: Router
  ){}

  toggleUserMenu() {
    this.showUserMenu.update((v) => !v);
  }

  navigateTo(section: string) {
    console.log(`Navigating to: ${section}`);
    this.showUserMenu.set(false);
    this.router.navigate(['/${{section}}',this.user.id]);
  }
}
