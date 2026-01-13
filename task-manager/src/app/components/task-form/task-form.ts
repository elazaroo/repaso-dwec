import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskFormComponent implements OnInit {

  task: Task = {
    title: '',
    completed: false
  };

  isEditMode: boolean = false;
  taskId: number | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (data) => {
        this.task = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar la tarea';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isFormValid(): boolean {
    return this.task.title.trim().length >= 3;
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.error = 'Error al actualizar'
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.error = 'Error al crear'
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}