import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { AuthService } from "../../auth/auth.service";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { Task } from "../models/task.model";
import { TaskService } from "../task.service";
import { TaskFormComponent } from "../task-form/task-form.component";
import { TaskItemComponent } from "../task-item/task-item.component";

@Component({
    selector: "app-task-list",
    standalone: true,
    templateUrl: "./task-list.component.html",
    styleUrls: ["./task-list.component.scss"],
    imports: [MatButtonModule, MatIconModule, TaskItemComponent]
})
export class TaskListComponent {
    tasks: Task[] = [];

    constructor(
        private taskService: TaskService,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.loadTasks();
    }

    loadTasks(): void {
        this.taskService.getTasks().subscribe((tasks) => { this.tasks = tasks; });
    }

    openTaskForm(task?: Task): void {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            width: "400px",
            data: task || null
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                if (result) {
                    if (task) {
                        this.updateTask(result);
                    } else {
                        this.addTask(result);
                    }
                }
            });
    }

    addTask(task: Task): void {
        this.taskService.createTask(task).subscribe(() => this.loadTasks());
    }

    updateTask(task: Task): void {
        this.taskService.updateTask(task).subscribe(() => this.loadTasks());
    }

    deleteTask(taskId: string): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: "350px",
            data: {
                message: "Are you sure you want to delete this task?"
            }
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.taskService.deleteTask(taskId).subscribe(() => this.loadTasks());
            }
        });
    }

    toggleComplete(task: Task): void {
        const updatedTask = { ...task, completed: !task.completed };
        this.updateTask(updatedTask);
    }

    logout() {
        AuthService.logout();
        this.router.navigate([""]);
    }
}
