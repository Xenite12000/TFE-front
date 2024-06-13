import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() page_selected = new EventEmitter<string>();

  page_change(page: string) {
    this.page_selected.emit(page);
  }
}
