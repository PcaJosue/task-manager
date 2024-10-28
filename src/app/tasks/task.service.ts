import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";
import { Task } from "./models/task.model";

@Injectable({
    providedIn: "root"
})
export class TaskService {
    private readonly apiUrl = `${environment.apiUrl}tasks`;

    constructor(private http: HttpClient) {}

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTask(updatedTask: Task): Observable<Task> {
        const url = `${this.apiUrl}/${updatedTask.id}`;
        return this.http.put<Task>(url, updatedTask);
    }

    deleteTask(taskId: string): Observable<void> {
        const url = `${this.apiUrl}/${taskId}`;
        return this.http.delete<void>(url);
    }
}
