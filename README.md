# Angular - Spring Boot - Basic

It's a simple full stack project with Angular frontend and Java - Sprign Boot backend. You can use it as a template for your own projects.

## Development environment configuration

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

I've had a problem with Angular versions, so I've ran: `npm install @angular/material@12.0.2 --force` and add proper css file in `anguar.json`.
```javascript
            "styles": [
              "./node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
              "src/styles.css"
            ],
```

You can run it.

```
ng serve --open
```

Create Spring Boot project with Spring Web and Spring Security dependencies. You can use https://start.spring.io/.

<img src="https://github.com/leliw/asb-basic/blob/main/images/SpringInitializr-basic.png?raw=true" />

Save backend.zip in parent folder for both projects and unzip it.

```bash
unzip backend.zip
```

You can run it.

```bash
cd backend
mvn spring-boot:run
```

When you open http://localhost:8080/ you will see the login form. User name is "user" and password is generatted and it was printed in log in console. After login you will see the "Whitelabel Error Page".

```
Using generated security password: 7e1f5805-99b4-4aba-af2e-db2e10deb8b9
```

## Development environment

In production use there will be one server, but in development two separate serwers are more convenient. As you can see before, there are two saparate servers working on ports 4200 (Angular) and 8080 (Spring Boot). In that case there is a problem with CORS (Cross-Origin Resource Sharing) and CSRF (Cross-site request forgery) protection. It is possible to configure Spring Boot Server to bypass these protections, but for me it is easier to use NGINX serwer in Docker container as a proxy.

There are configured three diffrent locations:
* / - Angular code and resources
* /api - resorces served by Spring Boot
* /sso - authorization methods - in this case also served by Spring Boot

For development process you should run Angular serwer and Spring Boot serwer as previous and NGINX in docker.

__In this and next steps you have to get porper files from repository!__ 

```bash
cd nginx-dev
docker build -t leliw:nginx-angular-dev .
docker run -p 80:80 -d --name nginx-angular-dev leliw:nginx-angular-dev
```

If Angular serwer still working, you will see Angular default page on http://localhost/.

## Angular environment properties

Add these paths to environment properties (`frontend/src/environments/environment.ts` and `environment.prod.ts`).

```typescript
export const environment = {
  production: false,
  apiUrl: '/api',
  ssoUrl: '/sso'  
};
```

## Angular login form and authentication service

### Frontend

All sources of Angular application are located in fornted/src/app and it is basic path for rest files.
* Copy app.source.ts
* Add construtor to app.component.ts
```typescript
constructor(public appService : AppService, public router : Router) {}
```
* Change app.component.html
```html
<app-login *ngIf="appService.authenticated === false || router.url === '/login'"></app-login>
<app-nav *ngIf="appService.authenticated === true"></app-nav>
<div *ngIf="appService.authenticated !== true && appService.authenticated !== false">Wait a moment ...</div>
```
* Copy login component `frontend/src/apps/login' and add it to app.module.ts as well as other required modules
```typescript
...
import { LoginComponent } from './login/login.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppService } from './app.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [AppService],
...
```
On http://localhost:4200/ or http://localhost/ you should see "Wait a moment ..."  (backend still not responding).

### Backend

* Add authentication method `user(Principal user)`
* Change logout URI (default is `/logout`)
* All URI started with `/api` and `/sso` require authentication and the rest doesn't (Angular static sources)
* Configure CSRF protection for Angular and disable it for `/login` and `/logout`
* CORS default protections is left without changes
```java
	@GetMapping("/sso/user")
	@ResponseBody
	public Principal user(Principal user) {
		return user;
	}
	
	@Configuration
	@EnableWebSecurity
	protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.httpBasic()
			.and()
				.logout()
				.logoutUrl("/sso/logout")
			.and()
				.authorizeRequests().antMatchers("/sso", "/api").authenticated()
				.anyRequest().permitAll()
			.and()
				.csrf()
				.ignoringAntMatchers ("/login","/logout")
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
		}
	}

```
After restarting both servers (backend and frontend) you should see login form and be able to login.

### Frontend logout, routing and simple navigation

* Add routing path
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent }  
];
```
* Add logout() method in nav.component.ts
```typescript
  constructor(private breakpointObserver: BreakpointObserver,
    public appService: AppService) {}

  logout() {
    this.appService.logout();
  }
```
* Add logout icon (nav.component.html)
```html
      <span>frontend</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Logout">
        <mat-icon aria-hidden="false" aria-label="Logout" (click)="logout()">logout</mat-icon>
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```
* Menu links doesn't work so good, but when they are routerLinks it looks better (nav.component.html)
```html
    <mat-nav-list>
      <mat-nav-list>
        <a mat-list-item routerLink="/home">Home</a>
        <a mat-list-item href="#" *ngIf="appService.authenticated">Link</a>
      </mat-nav-list>
    </mat-nav-list>
```
* There is also a problem with browser login form, so disable it (app.modules.ts)
```typescript
@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
    
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest'),
      withCredentials: true
    });
    return next.handle(xhr).pipe(
      map((event: HttpEvent<any>) => event), // pass further respone
      catchError((error: HttpErrorResponse) => {
          // here will be catched error from response, just check if its 401
          if (error && error.status == 401)
            this.router.navigate(['login']);
          return throwError(error);
      }));
  }
}

...

  ],
  providers: [AppService, { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
