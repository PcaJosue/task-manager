import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { TaskFormComponent } from "./task-form.component";

describe("TaskFormComponent", () => {
    let component: TaskFormComponent;
    let fixture: ComponentFixture<TaskFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TaskFormComponent,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatCheckboxModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: jasmine.createSpyObj("MatDialogRef", ["close"]) },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize form with empty values and be invalid", () => {
        const titleControl = component.taskForm.get("title");
        const descriptionControl = component.taskForm.get("description");
        const completedControl = component.taskForm.get("completed");

        expect(titleControl?.value).toBe("");
        expect(descriptionControl?.value).toBe("");
        expect(completedControl?.value).toBeFalse();
        expect(component.taskForm.invalid).toBeTrue();
    });

    it("should show error message when title is invalid", () => {
        const titleControl = component.taskForm.get("title");
        titleControl?.setValue("ab");
        titleControl?.markAsTouched();
        fixture.detectChanges();

        const errorElement = fixture.debugElement.query(By.css("mat-error"));
        expect(errorElement).toBeTruthy();
        expect(errorElement.nativeElement.textContent).toContain("Title is required and must be at least 3 characters");
        expect(component.taskForm.invalid).toBeTrue();
    });

    it("should enable the save button only when the form is valid", () => {
        const button = fixture.debugElement.query(By.css("button[type=\"submit\"]")).nativeElement;

        expect(button.disabled).toBeTrue();

        component.taskForm.get("title")?.setValue("Valid Title");
        fixture.detectChanges();

        expect(button.disabled).toBeFalse();
    });

    it("should call onSave method when form is submitted", () => {
        spyOn(component, "onSave");

        component.taskForm.get("title")?.setValue("Valid Title");
        fixture.detectChanges();

        const form = fixture.debugElement.query(By.css("form"));
        form.triggerEventHandler("ngSubmit", null);

        expect(component.onSave).toHaveBeenCalled();
    });

    it("should call onCancel when the cancel button is clicked", () => {
        spyOn(component, "onCancel");

        const cancelButton = fixture.debugElement.query(By.css("button[type=\"button\"]"));
        cancelButton.triggerEventHandler("click", null);

        expect(component.onCancel).toHaveBeenCalled();
    });

    it("should close the dialog when onCancel is called", () => {
        const mockDialogRef = TestBed.inject(MatDialogRef);

        component.onCancel();

        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it("should not close the dialog if the form is invalid in onSave", () => {
        const mockDialogRef = TestBed.inject(MatDialogRef);
        component.taskForm.get("title")?.setValue(""); // invalid title
        component.onSave();

        expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it("should close the dialog with updated task data on valid form submission in onSave", () => {
        const mockDialogRef = TestBed.inject(MatDialogRef);
        component.taskForm.get("title")?.setValue("Updated Task Title");
        component.taskForm.get("description")?.setValue("Updated description");

        component.onSave();

        const expectedData = {
            ...component.data,
            ...component.taskForm.value
        };
        expect(mockDialogRef.close).toHaveBeenCalledWith(expectedData);
    });
    it("should patch form values if data is provided", () => {
        const mockData = {
            id: "1234",
            title: "Edit Task",
            description: "Task description",
            completed: true,
            createdAt: new Date()
        };
        component.data = mockData;
        component.ngOnInit();

        expect(component.taskForm.value).toEqual(
            { title: mockData.title, description: mockData.description, completed: mockData.completed }
        );
    });
});
