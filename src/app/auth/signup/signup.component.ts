import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { AuthService } from "../auth.service";

@Component({
    selector: "app-signup",
    standalone: true,
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
    imports: [
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NgOptimizedImage
    ],
})
export class SignUpComponent {
    signUpForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.signUpForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(2)]],
            email: ["", [Validators.required, Validators.email]],
        });
    }

    onSignUp() {
        if (this.signUpForm.valid) {
            const { name, email } = this.signUpForm.value;
            this.authService.signUp(name, email).subscribe({
                next: () => {
                    this.snackBar.open("Sign-up successful! Redirecting...", "Close", { duration: 3000 });
                    this.router.navigate(["/tasks"]);
                },
                error: () => {
                    this.snackBar.open("Sign-up failed. Please try again.", "Close", { duration: 3000 });
                },
            });
        }
    }
}
