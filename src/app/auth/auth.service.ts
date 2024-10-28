import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    public baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    login(email: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/${email}`).pipe(
            map((response:any) => {
                const { token } = response;
                if (token) {
                    AuthService.saveToken(token);
                }
                return response;
            }),
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
            map((response:any) => {
                const { token } = response;
                if (token) {
                    AuthService.saveToken(token);
                }
                return response;
            }),
            catchError(() => throwError(() => new Error("Sign-up failed")))
        );
    }

    static saveToken(token: string): void {
        localStorage.setItem("token", token);
    }

    // eslint-disable-next-line class-methods-use-this
    public getToken(): string | null {
        return localStorage.getItem("token");
    }

    static logout(): void {
        localStorage.removeItem("token");
    }
}
