import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { headerInterceptor } from "./header.interceptor";

describe("HeaderInterceptor", () => {
    let http: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(
                    withInterceptors([headerInterceptor]) // Register the interceptor here
                ),
                provideHttpClientTesting()
            ]
        });

        http = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it("should add Content-Type and Accept headers if Content-Type is not present", () => {
        http.get("/test-url").subscribe();

        const req = httpTestingController.expectOne("/test-url");
        expect(req.request.headers.has("Content-Type")).toBeTrue();
        expect(req.request.headers.get("Content-Type")).toBe("application/json");
        expect(req.request.headers.has("Accept")).toBeTrue();
        expect(req.request.headers.get("Accept")).toBe("application/json, text/plain, */*");

        req.flush({});
    });
});
