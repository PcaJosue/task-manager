import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("#login", () => {
        const mockEmail = "test@example.com";
        const mockResponse = { id: 1, name: "Test User", email: mockEmail };

        it("should return user data for a valid email", (done) => {
            service.login(mockEmail).subscribe({
                next: (response) => {
                    expect(response).toEqual(mockResponse);
                    done();
                },
                error: () => fail("Expected a valid response")
            });

            const req = httpMock.expectOne(`${service.baseUrl}/users/${mockEmail}`);
            expect(req.request.method).toBe("GET");
            req.flush(mockResponse);
        });

        it("should return \"User not found\" error for a 404 status", (done) => {
            service.login(mockEmail).subscribe({
                next: () => fail("Expected error response"),
                error: (error) => {
                    expect(error.message).toBe("User not found");
                    done();
                }
            });

            const req = httpMock.expectOne(`${service.baseUrl}/users/${mockEmail}`);
            req.flush("User not found", { status: 404, statusText: "Not Found" });
        });

        it("should return general error for other errors", (done) => {
            service.login(mockEmail).subscribe({
                next: () => fail("Expected error response"),
                error: (error) => {
                    expect(error.message).toBe("An error occurred");
                    done();
                }
            });

            const req = httpMock.expectOne(`${service.baseUrl}/users/${mockEmail}`);
            req.flush("Server error", { status: 500, statusText: "Server Error" });
        });
    });

    describe("#signUp", () => {
        const mockName = "New User";
        const mockEmail = "newuser@example.com";
        const mockRequestBody = { name: mockName, email: mockEmail };
        const mockResponse = { id: 2, name: mockName, email: mockEmail };

        it("should successfully create a new user", (done) => {
            service.signUp(mockName, mockEmail).subscribe({
                next: (response) => {
                    expect(response).toEqual(mockResponse);
                    done();
                },
                error: () => fail("Expected a successful response")
            });

            const req = httpMock.expectOne(`${service.baseUrl}/users`);
            expect(req.request.method).toBe("POST");
            expect(req.request.body).toEqual(mockRequestBody);
            req.flush(mockResponse);
        });

        it("should return \"Sign-up failed\" error for failed request", (done) => {
            service.signUp(mockName, mockEmail).subscribe({
                next: () => fail("Expected error response"),
                error: (error) => {
                    expect(error.message).toBe("Sign-up failed");
                    done();
                }
            });

            const req = httpMock.expectOne(`${service.baseUrl}/users`);
            req.flush("Sign-up failed", { status: 400, statusText: "Bad Request" });
        });
    });
});
