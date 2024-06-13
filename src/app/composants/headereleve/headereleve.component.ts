import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-headereleve',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './headereleve.component.html',
  styleUrl: './headereleve.component.css'
})
export class HeadereleveComponent {
  @Output() page_selected = new EventEmitter<string>();

  page_change(page: string) {
    this.page_selected.emit(page);
  }
}
