import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card';
import { TaskFormComponent } from '../task-form/task-form';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    TaskFormComponent,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './column.html',
  styleUrls: ['./column.css'],
})
export class Column {
  @Input() title = '';
  @Input() tasks: any[] = [];
  @Input() connectedDropLists: string[] = [];
  @Input() id = '';

  @Output() editColumn = new EventEmitter<{ id: string; newTitle: string }>();
  @Output() deleteColumn = new EventEmitter<string>();

  showForm = false;
  editingIndex: number | null = null;

  // ✅ Horizontal drag list demo (time periods)
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];

  // Handles drag inside horizontal list
  dropTimePeriod(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.editingIndex = null;
  }

  // Column management
  onEditColumn() {
    const newTitle = prompt('Enter new column title', this.title);
    if (newTitle && newTitle.trim() !== '') {
      this.editColumn.emit({ id: this.id, newTitle: newTitle.trim() });
    }
  }

  onDeleteColumn() {
    if (confirm(`Are you sure you want to delete column "${this.title}"?`)) {
      this.deleteColumn.emit(this.id);
    }
  }

  // Task management
  saveTask(task: any) {
    if (this.editingIndex !== null) {
      this.tasks[this.editingIndex] = {
        ...this.tasks[this.editingIndex],
        ...task,
      };
    } else {
      this.tasks.push({ id: Date.now(), ...task });
    }
    this.toggleForm();
  }

  editTask(index: number) {
    this.editingIndex = index;
    this.showForm = true;
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  // Handles drag & drop for tasks
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
