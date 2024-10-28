import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { environment } from "../../environments/environment";
import { Task } from "./models/task.model";
import { TaskService } from "./task.service";

describe("TaskService", () => {
    let service: TaskService;
    let httpTestingController: HttpTestingController;
    const apiUrl = `${environment.apiUrl}tasks`;

    const mockTask: Task = {
        id: "123",
        title: "Sample Task",
        description: "Sample Description",
        completed: false,
        createdAt: new Date("2023-01-01")
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TaskService]
        });
        service = TestBed.inject(TaskService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it("should fetch tasks with GET request", () => {
        const mockTasks: Task[] = [mockTask];

        service.getTasks().subscribe((tasks) => {
            expect(tasks).toEqual(mockTasks);
        });

        const req = httpTestingController.expectOne(apiUrl);
        expect(req.request.method).toEqual("GET");

        req.flush(mockTasks);
    });

    it("should create a new task with POST request", () => {
        service.createTask(mockTask).subscribe((task) => {
            expect(task).toEqual(mockTask);
        });

        const req = httpTestingController.expectOne(apiUrl);
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual(mockTask);

        req.flush(mockTask);
    });

    it("should update an existing task with PUT request", () => {
        const updatedTask: Task = { ...mockTask, title: "Updated Task Title" };

        service.updateTask(updatedTask).subscribe((task) => {
            expect(task).toEqual(updatedTask);
        });

        const req = httpTestingController.expectOne(`${apiUrl}/${updatedTask.id}`);
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual(updatedTask);

        req.flush(updatedTask);
    });

    it("should delete a task with DELETE request", () => {
        const taskId = mockTask.id;

        service.deleteTask(taskId).subscribe((response) => {
            expect(response).toBeNull();
        });

        const req = httpTestingController.expectOne(`${apiUrl}/${taskId}`);
        expect(req.request.method).toEqual("DELETE");

        req.flush(null);
    });
});
