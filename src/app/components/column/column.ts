import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskFormComponent],
  templateUrl: './column.html',
  styleUrls: ['./column.css']
})
export class Column {
  @Input() title = '';
  tasks: { title: string; description: string; priority: string }[] = [];
  showForm = false;

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addTask(task: { title: string; description: string; priority: string }) {
    this.tasks.push(task);
    this.showForm = false;
  }
}
