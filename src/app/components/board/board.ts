import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '../column/column';
import { CdkDropList, CdkDrag, CdkDropListGroup, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../column-dialog/column-dialog';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, Column, CdkDropList, CdkDrag, CdkDropListGroup, MatDialogModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board {
  constructor(private dialog: MatDialog) {}

  columns = [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ];

  getConnectedDropLists(currentId: string) {
    return this.columns.filter(c => c.id !== currentId).map(c => c.id);
  }

  // ✅ Add Column with dialog
  promptAddColumn() {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '300px',
      data: { title: 'Add Column', inputLabel: 'Column Title', inputValue: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.trim()) {
        this.addColumn(result.trim());
      }
    });
  }

  addColumn(title: string) {
    const id = title.replace(/\s+/g, '').toLowerCase();
    if (this.columns.find(c => c.id === id)) return;
    this.columns.push({ id, title, tasks: [] });
    this.save();
  }

  // ✅ Edit Column with dialog
  editColumn(event: { id: string }) {
  const col = this.columns.find(c => c.id === event.id);
  if (!col) return;

  // Open dialog to edit the column title
  const dialogRef = this.dialog.open(ColumnDialogComponent, {
    width: '300px',
    data: {
      title: 'Edit Column',
      inputLabel: 'New Title',
      inputValue: col.title
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.trim()) {
      col.title = result.trim(); // only update title
      // DO NOT change col.id — keeps tasks intact
      this.save();
    }
  });
}


  // ✅ Delete Column with confirmation dialog
  deleteColumn(id: string) {
  const dialogRef = this.dialog.open(ColumnDialogComponent, {
    width: '300px',
    data: {
      title: 'Delete Column',
      isConfirmOnly: true,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // remove column
      this.columns = this.columns.filter(c => c.id !== id);
      // remove tasks from localStorage
      localStorage.removeItem(`session2_${id}`);
      this.save();
    }
  });
}


  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.save();
  }
  resetBoard() {
  // Clear all column task storage keys
  this.columns.forEach(col => {
    localStorage.removeItem(`session2_${col.id}`);
  });

  // Set default columns
  this.columns = [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ];

  // Save default board in localStorage
  localStorage.setItem('session', JSON.stringify(this.columns));
}

  save() {
    localStorage.setItem('session', JSON.stringify(this.columns));
  }

  load() {
    const data = localStorage.getItem('session');
    this.columns = data ? JSON.parse(data) : [];
  }

  ngOnInit() {
    this.load();
    // [{"id":"todo","title":"To Do","tasks":[]},{"id":"inprogress","title":"In Progress","tasks":[]},{"id":"done","title":"Done","tasks":[]}]
  }
}
