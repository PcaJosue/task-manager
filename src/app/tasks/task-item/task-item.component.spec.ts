import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { By } from "@angular/platform-browser";

import { TaskItemComponent } from "./task-item.component";

describe("TaskItemComponent", () => {
    let component: TaskItemComponent;
    let fixture: ComponentFixture<TaskItemComponent>;

    const mockTask = {
        id: "12334",
        title: "Sample Task",
        description: "This is a sample task description.",
        completed: false,
        createdAt: new Date("2023-01-01")
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TaskItemComponent,
                MatCardModule,
                MatIconModule,
                MatButtonModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskItemComponent);
        component = fixture.componentInstance;
        component.task = mockTask;
        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should apply the completed-task class when task is completed", () => {
        component.task.completed = true;
        fixture.detectChanges();

        const taskCard = fixture.debugElement.query(By.css(".task-card"));
        expect(taskCard.classes["completed-task"]).toBeTrue();
    });

    it("should display the task title and description", () => {
        const titleElement = fixture.debugElement.query(By.css(".task-title")).nativeElement;
        const descriptionElement = fixture.debugElement.query(By.css(".task-description")).nativeElement;

        expect(titleElement.textContent).toContain(mockTask.title);
        expect(descriptionElement.textContent).toContain(mockTask.description);
    });

    it("should display default text if description is not provided", () => {
        component.task.description = "";
        fixture.detectChanges();

        const descriptionElement = fixture.debugElement.query(By.css(".task-description")).nativeElement;
        expect(descriptionElement.textContent).toContain("No description provided.");
    });

    it("should display the creation date in mediumDate format", () => {
        const creationDateElement = fixture.debugElement.query(By.css(".creation-date")).nativeElement;
        const expectedDate = new Date(mockTask.createdAt).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
        );

        expect(creationDateElement.textContent).toContain(expectedDate);
    });

    it("should call onEdit when the edit button is clicked", () => {
        spyOn(component, "onEdit");

        const editButton = fixture.debugElement.query(By.css("button[aria-label=\"Edit Task\"]"));
        editButton.triggerEventHandler("click", null);

        expect(component.onEdit).toHaveBeenCalled();
    });

    it("should call onDelete when the delete button is clicked", () => {
        spyOn(component, "onDelete");

        const deleteButton = fixture.debugElement.query(By.css("button[aria-label=\"Delete Task\"]"));
        deleteButton.triggerEventHandler("click", null);

        expect(component.onDelete).toHaveBeenCalled();
    });

    it("should emit the edit event with the task data when onEdit is called", () => {
        spyOn(component.edit, "emit");

        component.onEdit();

        expect(component.edit.emit).toHaveBeenCalledWith(mockTask);
    });

    it("should emit the delete event with the task ID when onDelete is called", () => {
        spyOn(component.delete, "emit");

        component.onDelete();

        expect(component.delete.emit).toHaveBeenCalledWith(mockTask.id);
    });

    it("should emit the toggleComplete event with the updated task data when onToggleComplete is called", () => {
        spyOn(component.toggleComplete, "emit");

        component.onToggleComplete();

        const expectedTask = { ...mockTask, completed: !mockTask.completed };
        expect(component.toggleComplete.emit).toHaveBeenCalledWith(expectedTask);
    });
});
