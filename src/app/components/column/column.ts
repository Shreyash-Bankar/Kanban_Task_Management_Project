import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card';
import { TaskFormComponent } from '../task-form/task-form';

import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskFormComponent,CdkDropList, CdkDrag],
  templateUrl: './column.html',
  styleUrls: ['./column.css']
})
export class Column {
  @Input() title = '';

  tasks: { id: number; title: string; description: string; priority: string }[] = [];
  showForm = false;
  editingIndex: number | null = null;

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.editingIndex = null;
  }

  saveTask(task: { title: string; description: string; priority: string }) {
    if (this.editingIndex !== null) {
      this.tasks[this.editingIndex] = { ...this.tasks[this.editingIndex], ...task };
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
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
  
}
