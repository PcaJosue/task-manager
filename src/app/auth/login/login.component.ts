import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    imports: [
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgOptimizedImage
    ],
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.loginForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    onLogin(): void {
        if (this.loginForm.invalid) return;

        const { email } = this.loginForm.value;
        this.authService.login(email).subscribe({
            next: () => this.router.navigate(["/tasks"]),
            error: (err) => this.handleLoginError(err)
        });
    }

    private handleLoginError(err: Error): void {
        if (err.message === "User not found") {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: { message: "Email not found. Would you like to sign up instead?" }
            });

            dialogRef.afterClosed().subscribe((confirmed) => {
                if (confirmed) this.router.navigate(["/signup"]);
            });
        } else {
            this.snackBar.open("Login failed. Please try again.", "Close", { duration: 3000 });
        }
    }
}
