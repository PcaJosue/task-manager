import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { AuthService } from "../../auth/auth.service";
import { authInterceptor } from "./auth.interceptor";

class MockAuthService {
    // eslint-disable-next-line class-methods-use-this
    public getToken(): string | null {
        return "test-token";
    }
}

describe("AuthInterceptor", () => {
    let http: HttpClient;
    let httpTestingController: HttpTestingController;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(
                    withInterceptors([authInterceptor])
                ),
                provideHttpClientTesting(),
                { provide: AuthService, useClass: MockAuthService }
            ]
        });

        http = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it("should add Authorization header if token is available", () => {
        spyOn(authService, "getToken").and.returnValue("test-token");

        http.get("/test-url").subscribe();

        const req = httpTestingController.expectOne("/test-url");
        expect(req.request.headers.has("Authorization")).toBeTrue();
        expect(req.request.headers.get("Authorization")).toBe("Bearer test-token");

        req.flush({});
    });

    it("should not add Authorization header if token is not available", () => {
        spyOn(authService, "getToken").and.returnValue(null);

        http.get("/test-url").subscribe();

        const req = httpTestingController.expectOne("/test-url");
        expect(req.request.headers.has("Authorization")).toBeFalse();

        req.flush({});
    });
});
