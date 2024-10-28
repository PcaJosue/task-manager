import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./auth/login/login.component").then((m) => m.LoginComponent),
    },
    {
        path: "signup",
        loadComponent: () => import("./auth/signup/signup.component").then((m) => m.SignUpComponent),
    },
    {
        path: "logout",
        loadComponent: () => import("./auth/login/login.component").then((m) => m.LoginComponent),
    },
    {
        path: "tasks",
        loadComponent: () => import("./tasks/task-list/task-list.component").then(
            (m) => m.TaskListComponent
        ),
    },
];
