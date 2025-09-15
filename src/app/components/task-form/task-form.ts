import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css']
})
export class TaskFormComponent implements OnChanges {
  @Input() existingTask: { title: string; description: string; priority: string } | null = null;
  @Output() taskCreated = new EventEmitter<{ title: string; description: string; priority: string }>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['medium', Validators.required]
    });
  }

  // Whenever existingTask changes (e.g., when editing), update the form
  ngOnChanges(changes: SimpleChanges) {
    if (changes['existingTask'] && this.existingTask) {
      this.taskForm.patchValue(this.existingTask);
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskCreated.emit(this.taskForm.value);
      this.taskForm.reset({ priority: 'medium' });
    }
  }
}
