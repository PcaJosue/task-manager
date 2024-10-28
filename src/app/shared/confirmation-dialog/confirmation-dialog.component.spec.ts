import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

describe("ConfirmationDialogComponent", () => {
    let component: ConfirmationDialogComponent;
    let fixture: ComponentFixture<ConfirmationDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

    const mockDialogData = { message: "Are you sure you want to proceed?" };

    beforeEach(async () => {
        const dialogRef = jasmine.createSpyObj("MatDialogRef", ["close"]);

        await TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule, ConfirmationDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should display the correct message", () => {
        const messageElement = fixture.debugElement.query(By.css("p")).nativeElement;
        expect(messageElement.textContent).toContain(mockDialogData.message);
    });

    it("should call onCancel when the cancel button is clicked", () => {
        spyOn(component, "onCancel").and.callThrough();
        const cancelButton = fixture.debugElement.query(By.css("button[mat-button]"));
        cancelButton.triggerEventHandler("click", null);

        expect(component.onCancel).toHaveBeenCalled();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it("should call onConfirm when the confirm button is clicked", () => {
        spyOn(component, "onConfirm").and.callThrough();
        const confirmButton = fixture.debugElement.query(By.css("button[mat-raised-button]"));
        confirmButton.triggerEventHandler("click", null);

        expect(component.onConfirm).toHaveBeenCalled();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });
});
