import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCardComponent {
  @Input() task!: { id: number; title: string; description: string; priority: string };
  @Input() index!: number;

  @Output() editTask = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  onEdit() {
    this.editTask.emit(this.index);
  }

  onDelete() {
    this.deleteTask.emit(this.index);
  }
}
