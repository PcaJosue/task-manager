import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { of } from "rxjs";

import { Task } from "../models/task.model";
import { TaskService } from "../task.service";
import { TaskListComponent } from "./task-list.component";

describe("TaskListComponent", () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;
    let taskService: jasmine.SpyObj<TaskService>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        taskService = jasmine.createSpyObj("TaskService", ["createTask", "updateTask", "deleteTask", "getTasks"]);
        dialog = jasmine.createSpyObj("MatDialog", ["open"]);

        TestBed.configureTestingModule({
            imports: [MatButtonModule, MatDialogModule, TaskListComponent],
            providers: [
                { provide: TaskService, useValue: taskService },
                { provide: MatDialog, useValue: dialog },
            ]
        }).compileComponents();

        taskService.getTasks.and.returnValue(of([]));

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;

        spyOn(component, "loadTasks").and.callThrough();
        fixture.detectChanges();
    });

    describe("openTaskForm", () => {
        it("should add a task when dialog is closed with a result", () => {
            const mockTask = { id: "3", title: "New Task", completed: false } as Task;
            dialog.open.and.returnValue({ afterClosed: () => of(mockTask) } as any);
            spyOn(component, "addTask");

            component.openTaskForm();

            expect(component.addTask).toHaveBeenCalledWith(mockTask);
        });

        it("should not add a task when dialog is closed with null", () => {
            dialog.open.and.returnValue({ afterClosed: () => of(null) } as any);
            spyOn(component, "addTask");

            component.openTaskForm();

            expect(component.addTask).not.toHaveBeenCalled();
        });
    });

    describe("deleteTask", () => {
        it("should call deleteTask on the service when dialog is confirmed", () => {
            const taskId = "1";

            taskService.deleteTask.and.returnValue(of(undefined));

            dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);

            component.loadTasks = jasmine.createSpy().and.callFake(() => {});

            component.deleteTask(taskId);

            expect(taskService.deleteTask).toHaveBeenCalledWith(taskId);
            expect(component.loadTasks).toHaveBeenCalled();
        });

        it("should not call deleteTask on the service when dialog is canceled", () => {
            const taskId = "1";
            dialog.open.and.returnValue({ afterClosed: () => of(false) } as any);

            component.deleteTask(taskId);

            expect(taskService.deleteTask).not.toHaveBeenCalled();
        });
    });

    describe("addTask", () => {
        it("should call loadTasks after adding a task", () => {
            const newTask = { id: "4", title: "Task 4", completed: false } as Task;
            taskService.createTask.and.returnValue(of(newTask));

            component.addTask(newTask);

            expect(taskService.createTask).toHaveBeenCalledWith(newTask);
            expect(component.loadTasks).toHaveBeenCalled();
        });
    });

    describe("updateTask", () => {
        it("should call loadTasks after updating a task", () => {
            const updatedTask = { id: "1", title: "Updated Task", completed: true } as Task;
            taskService.updateTask.and.returnValue(of(updatedTask));

            component.updateTask(updatedTask);

            expect(taskService.updateTask).toHaveBeenCalledWith(updatedTask);
            expect(component.loadTasks).toHaveBeenCalled();
        });
    });

    describe("toggleComplete", () => {
        it("should toggle completed status and call updateTask", () => {
            const task = { id: "2", title: "Task 2", completed: false } as Task;
            const updatedTask = { ...task, completed: !task.completed };
            spyOn(component, "updateTask");

            component.toggleComplete(task);

            expect(component.updateTask).toHaveBeenCalledWith(updatedTask);
        });
    });
});
