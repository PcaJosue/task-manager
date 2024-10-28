import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";

export const headerInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const modifiedReq = req.headers.has("Content-Type")
        ? req
        : req.clone({
            headers: req.headers.set("Content-Type", "application/json")
                .set("Accept", "application/json, text/plain, */*")
        });

    return next(modifiedReq);
};
