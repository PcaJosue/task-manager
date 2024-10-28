import { Component, Inject, OnInit } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { Task } from "../models/task.model";

@Component({
    selector: "app-task-form",
    standalone: true,
    templateUrl: "./task-form.component.html",
    styleUrls: ["./task-form.component.scss"],
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule
    ]
})
export class TaskFormComponent implements OnInit {
    taskForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TaskFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Task | null
    ) {
        this.taskForm = this.fb.group({
            title: ["", [Validators.required, Validators.minLength(3)]],
            description: ["", Validators.maxLength(250)],
            completed: [false]
        });
    }

    ngOnInit(): void {
        if (this.data) {
            this.taskForm.patchValue(this.data);
        }
    }

    onSave(): void {
        if (this.taskForm.valid) {
            const updatedTask = { ...this.data, ...this.taskForm.value };
            this.dialogRef.close(updatedTask);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
