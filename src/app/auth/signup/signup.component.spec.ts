import {
    ComponentFixture, TestBed,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { of } from "rxjs";

import { AuthService } from "../auth.service";
import { SignUpComponent } from "./signup.component";

describe("SignUpComponent", () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let snackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        authService = jasmine.createSpyObj("AuthService", ["signUp"]);
        router = jasmine.createSpyObj("Router", ["navigate"]);
        snackBar = jasmine.createSpyObj("MatSnackBar", ["open"]);

        TestBed.configureTestingModule({
            imports: [
                SignUpComponent,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatSnackBarModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: MatSnackBar, useValue: snackBar },
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize the form with empty fields", () => {
        expect(component.signUpForm.get("name")?.value).toBe("");
        expect(component.signUpForm.get("email")?.value).toBe("");
    });

    it("should mark the form as invalid if fields are empty or invalid", () => {
        component.signUpForm.setValue({ name: "", email: "" });
        expect(component.signUpForm.invalid).toBeTrue();

        component.signUpForm.setValue({ name: "A", email: "invalidemail" });
        expect(component.signUpForm.invalid).toBeTrue();
    });

    it("should mark the form as valid if fields are filled correctly", () => {
        component.signUpForm.setValue({ name: "John Doe", email: "johndoe@example.com" });
        expect(component.signUpForm.valid).toBeTrue();
    });

    it("should call AuthService signUp on valid form submission", () => {
        authService.signUp.and.returnValue(of({}));
        component.signUpForm.setValue({ name: "John Doe", email: "johndoe@example.com" });

        component.onSignUp();

        expect(authService.signUp).toHaveBeenCalledWith("John Doe", "johndoe@example.com");
    });

    it("should show success and navigate on successful sign-up", () => {
        authService.signUp.and.returnValue(of({}));
        component.signUpForm.setValue({ name: "John Doe", email: "johndoe@example.com" });

        component.onSignUp();
        expect(router.navigate).toHaveBeenCalledWith(["/tasks"]);
    });

    it("should disable the submit button if the form is invalid", () => {
        component.signUpForm.setValue({ name: "", email: "" });
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css("button[type=\"submit\"]")).nativeElement;
        expect(button.disabled).toBeTrue();
    });

    it("should enable the submit button if the form is valid", () => {
        component.signUpForm.setValue({ name: "John Doe", email: "johndoe@example.com" });
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css("button[type=\"submit\"]")).nativeElement;
        expect(button.disabled).toBeFalse();
    });
});
