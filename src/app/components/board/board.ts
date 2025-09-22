import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '../column/column';
import {
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, Column, CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board {
  columns = [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ];

  getConnectedDropLists(currentId: string) {
    return this.columns.filter(c => c.id !== currentId).map(c => c.id);
  }

    promptAddColumn() {
    const title = prompt('Enter column title:');
    if (title && title.trim() !== '') {
      this.addColumn(title.trim());
    }
  }

  
  addColumn(title: string) {
    if (!title) return; 
    const id = title.replace(/\s+/g, '').toLowerCase(); 
   
    if (this.columns.find(c => c.id === id)) {
      console.warn('Column with this title already exists');
      return;
    }
    this.columns.push({
      id: id,
      title: title,
      tasks: [],
    });
  }
  editColumn(event: { id: string; newTitle: string }) {
  const col = this.columns.find(c => c.id === event.id);
  if (col) {
    col.title = event.newTitle;
    // also update the column id in case new title changes it
    col.id = event.newTitle.replace(/\s+/g, '').toLowerCase();
  }
}

deleteColumn(id: string) {
  
    this.columns = this.columns.filter(c => c.id !== id);
  
}
 dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
  

}
