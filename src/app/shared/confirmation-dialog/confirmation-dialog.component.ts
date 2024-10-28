import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-confirmation-dialog",
    standalone: true,
    templateUrl: "./confirmation-dialog.component.html",
    styleUrls: ["./confirmation-dialog.component.scss"],
    imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }
    ) {}

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
