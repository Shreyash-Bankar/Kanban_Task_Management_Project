import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '../column/column';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, Column],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board {
  columns = ['To Do', 'In Progress', 'Completed'];
}
