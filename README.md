# Angular - Spring Boot - Basic

It's a simple full stack project with Angular frontend and Java - Sprign Boot backend. You can use it as a template for your own projects.

## Development environment concfiguration

Install node from https://nodejs.org/.

```
$ node --version
v14.17.0
```

Upgrade npm and install Angular CLI

```
$ npm install -g npm
$ npm install -g @angular/cli
```

Check ng command

```
$ ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 12.0.3
Node: 14.17.0
Package Manager: npm 7.15.1
OS: win32 x64

Angular:
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1200.3 (cli-only)
@angular-devkit/core         12.0.3 (cli-only)
@angular-devkit/schematics   12.0.3 (cli-only)
@schematics/angular          12.0.3 (cli-only)
```

## Generate standard projects

Create parent folder for both projects.

```
mkdir my_project
cd my_project
```
Create Angular project with two example components.

```
ng new frontend --routing
cd frontend
ng add @angular/material
ng generate @angular/material:navigation nav
ng generate @angular/material:dashboard home
```

You can run it.

```
ng serve --open
```

Create Spring Boot project with Spring Web and Spring Security dependencies. You can use https://start.spring.io/.

<img src="https://github.com/leliw/asb-basic/blob/main/images/SpringInitializr-basic.png?raw=true" />

Save backend.zip in parent folder for both projects and unzip it.

```
unzip backend.zip
```

You can run it.

```
cd backend
mvn spring-boot:run
```

When you open http://localhost:8080/ you will see the login form. User name is "user" and password is generatted and it was 
printed in log in console. After login you will see the "Whitelabel Error Page".

```
Using generated security password: 7e1f5805-99b4-4aba-af2e-db2e10deb8b9
```
