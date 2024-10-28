import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";

import { AuthService } from "../auth.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let snackBar: jasmine.SpyObj<MatSnackBar>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        authService = jasmine.createSpyObj("AuthService", ["login"]);
        router = jasmine.createSpyObj("Router", ["navigate"]);
        snackBar = jasmine.createSpyObj("MatSnackBar", ["open"]);
        dialog = jasmine.createSpyObj("MatDialog", ["open"]);

        TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatSnackBarModule,
                MatDialogModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: MatSnackBar, useValue: snackBar },
                { provide: MatDialog, useValue: dialog }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    describe("Form Initialization", () => {
        it("should initialize form with an empty email and be invalid", () => {
            expect(component.loginForm.get("email")?.value).toBe("");
            expect(component.loginForm.invalid).toBeTrue();
        });
    });

    describe("Form Submission", () => {
        it("should navigate to /tasks on successful login", () => {
            authService.login.and.returnValue(of({}));
            component.loginForm.get("email")?.setValue("valid@example.com");

            component.onLogin();

            expect(router.navigate).toHaveBeenCalledWith(["/tasks"]);
        });

        it("should not proceed with login if form is invalid", () => {
            component.loginForm.get("email")?.setValue(""); // Leave form invalid
            component.onLogin();

            expect(authService.login).not.toHaveBeenCalled();
        });
    });

    describe("Validation Errors", () => {
        it("should display error message when email is invalid", () => {
            component.loginForm.get("email")?.setValue("invalid-email");
            component.loginForm.get("email")?.markAsTouched();
            fixture.detectChanges();

            const errorElement = fixture.debugElement.query(By.css("mat-error"));
            expect(errorElement).toBeTruthy();
            expect(errorElement.nativeElement.textContent).toContain("Please enter a valid email");
        });

        it("should not display error message when email is valid", () => {
            component.loginForm.get("email")?.setValue("valid@example.com");
            component.loginForm.get("email")?.markAsTouched();
            fixture.detectChanges();

            const errorElement = fixture.debugElement.query(By.css("mat-error"));
            expect(errorElement).toBeNull();
        });
    });

    describe("Error Handling", () => {
        it("should open dialog on 'User not found' error", () => {
            authService.login.and.returnValue(throwError({ message: "User not found" }));
            dialog.open.and.returnValue({ afterClosed: () => of(false) } as any);

            component.loginForm.get("email")?.setValue("valid@example.com");
            component.onLogin();

            expect(dialog.open).toHaveBeenCalled();
        });

        it("should show snackbar on generic login error", () => {
            authService.login.and.returnValue(throwError({ message: "Generic error" }));

            component.loginForm.get("email")?.setValue("valid@example.com");
            component.onLogin();

            expect(snackBar.open).toHaveBeenCalledWith("Login failed. Please try again.", "Close", { duration: 3000 });
        });
    });

    describe("Dialog Confirmation", () => {
        it("should navigate to /signup if user confirms dialog after 'User not found' error", () => {
            authService.login.and.returnValue(throwError({ message: "User not found" }));
            dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);

            component.loginForm.get("email")?.setValue("valid@example.com");
            component.onLogin();

            expect(router.navigate).toHaveBeenCalledWith(["/signup"]);
        });

        it("should not navigate if user cancels dialog after 'User not found' error", () => {
            authService.login.and.returnValue(throwError({ message: "User not found" }));
            dialog.open.and.returnValue({ afterClosed: () => of(false) } as any);

            component.loginForm.get("email")?.setValue("valid@example.com");
            component.onLogin();

            expect(router.navigate).not.toHaveBeenCalledWith(["/signup"]);
        });
    });

    describe("Button States", () => {
        it("should disable the login button if the form is invalid", () => {
            component.loginForm.get("email")?.setValue("");
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css(".login-button")).nativeElement;
            expect(button.disabled).toBeTrue();
        });

        it("should enable the login button if the form is valid", () => {
            component.loginForm.get("email")?.setValue("valid@example.com");
            fixture.detectChanges();

            const button = fixture.debugElement.query(By.css(".login-button")).nativeElement;
            expect(button.disabled).toBeFalse();
        });
    });
});
