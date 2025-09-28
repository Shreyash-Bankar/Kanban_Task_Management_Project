import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card';
import { TaskFormComponent } from '../task-form/task-form';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../column-dialog/column-dialog';
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
  constructor(private dialog: MatDialog) {}

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
  this.editColumn.emit({ id: this.id, newTitle: this.title });
}


  onDeleteColumn() {
  this.deleteColumn.emit(this.id);
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
    this.save();
  }
  
  editTask(index: number) {
    this.editingIndex = index;
    this.showForm = true;
    this.save();
  }
  
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.save();
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
   
    this.save();

    const sourceId = event.previousContainer.id.replace('cdk-drop-list-', '');
    localStorage.setItem(`session2_${sourceId}`, JSON.stringify(event.previousContainer.data));
  }

  save() {
  localStorage.setItem(`session2_${this.id}`, JSON.stringify(this.tasks));

}

load() {
  const data = localStorage.getItem(`session2_${this.id}`);
this.tasks = data ? JSON.parse(data) : [];

}


ngOnInit() {
  this.load();
}


}
