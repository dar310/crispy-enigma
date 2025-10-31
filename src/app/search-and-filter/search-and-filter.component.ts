import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-search-and-filter',
  imports: [CommonModule],
  templateUrl: './search-and-filter.component.html',
  styleUrl: './search-and-filter.component.css',
})
export class SearchAndFilterComponent {
  searchQuery = signal('');

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value.trim());
    console.log('Search:', this.searchQuery());
  }
}
