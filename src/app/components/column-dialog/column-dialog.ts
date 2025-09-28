import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  inputLabel?: string;
  inputValue?: string;
  confirmText?: string;
  cancelText?: string;
  isConfirmOnly?: boolean; // for delete confirmation
}

@Component({
  selector: 'app-column-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './column-dialog.html',
  styleUrls: ['./column-dialog.css']
})
export class ColumnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    this.dialogRef.close(this.data.inputValue ?? true);
  }
}
