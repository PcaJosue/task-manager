import { CommonModule, DatePipe } from "@angular/common";
import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";

import { Task } from "../models/task.model";

@Component({
    selector: "app-task-item",
    standalone: true,
    templateUrl: "./task-item.component.html",
    styleUrls: ["./task-item.component.scss"],
    imports: [
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        DatePipe,
        CommonModule
    ]
})
export class TaskItemComponent {
    @Input() task!: Task;
    @Output() edit = new EventEmitter<Task>();
    @Output() delete = new EventEmitter<string>();
    @Output() toggleComplete = new EventEmitter<Task>();

    onEdit(): void {
        this.edit.emit(this.task);
    }

    onDelete(): void {
        this.delete.emit(this.task.id);
    }

    onToggleComplete(): void {
        const updatedTask = { ...this.task, completed: !this.task.completed };
        this.toggleComplete.emit(updatedTask);
    }
}
