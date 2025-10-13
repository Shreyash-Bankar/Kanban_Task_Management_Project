import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '../column/column';
import { CdkDropList, CdkDrag, CdkDropListGroup, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../column-dialog/column-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, Column, CdkDropList, CdkDrag, CdkDropListGroup, MatDialogModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}


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
     this.snackBar.open(`🆕 Column "${title}" added`, 'Close', { duration: 3000, horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar'] });
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
      const oldTitle = col.title;
      col.title = result.trim(); 
      this.save();
       this.snackBar.open(`✏️ Column renamed: "${oldTitle}" → "${col.title}"`, 'Close', { duration: 3000, horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar'] } );
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
      const col = this.columns.find(c => c.id === id);
      // remove column
      this.columns = this.columns.filter(c => c.id !== id);
      // remove tasks from localStorage
      localStorage.removeItem(`session2_${id}`);
      this.save();
       this.snackBar.open(`🗑️ Column "${col?.title}" deleted`, 'Close', { duration: 3000, horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar'] });
    }
  });
}


  dropColumn(event: CdkDragDrop<any[]>) {
  const movedColumn = this.columns[event.previousIndex]; // column being moved
  const oldIndex = event.previousIndex;
  const newIndex = event.currentIndex;

  // Move the column
  moveItemInArray(this.columns, oldIndex, newIndex);
  this.save();

  // Show snackbar with column title
  this.snackBar.open(
    `➡️ Column "${movedColumn.title}" moved from position ${oldIndex + 1} → ${newIndex + 1}`,
    'Close',
    {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    }
  );
}

  resetBoard() {
  // Clear all column task storage keys
  this.columns.forEach(col => {
    localStorage.removeItem(`session2_${col.id}`);
  });

  // Set default columns
  this.columns = [
    // { id: 'todo', title: 'To Do', tasks: [] },
    // { id: 'inprogress', title: 'In Progress', tasks: [] },
    // { id: 'done', title: 'Done', tasks: [] },
  ];

  // Save default board in localStorage
  localStorage.setItem('session', JSON.stringify(this.columns));
  this.snackBar.open(
    `Board Cleared!`,
    'Close',
    {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    }
  );
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
