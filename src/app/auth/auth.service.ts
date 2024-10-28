import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    public baseUrl = "https://your-api-url.com";

    constructor(private http: HttpClient) {}

    login(email: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/${email}`).pipe(
            map((response) => response),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 404) {
                    return throwError(() => new Error("User not found"));
                }
                return throwError(() => new Error("An error occurred"));
            })
        );
    }

    signUp(name: string, email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/users`, { name, email }).pipe(
            catchError(() => throwError(() => new Error("Sign-up failed")))
        );
    }
}
