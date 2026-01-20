import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm  implements OnInit{
  task: Task = {title: '', completed: false};
  isEditMode: boolean = false;
  taskId: number | null = null;

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
    this.taskService.getTaskById(id).subscribe({
      next: (data) => {
        this.task = data;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit():void {
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.task).subscribe({
        next: () => this.router.navigate(['/tasks'])
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => this.router.navigate(['/tasks'])
      });
    }
  }

}
