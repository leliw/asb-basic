import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Principal {
    name: string;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class AppService {
  
    authenticated = false;
  
    constructor(private http: HttpClient) {
        this.http.get<Principal>(environment.ssoUrl + '/user').subscribe(response => {
            if (response != null && response['name']) {
                this.authenticated = true;
            } else {
                this.authenticated = false;
            }
            console.log(this.authenticated);
        });
    }
  
    authenticate(credentials: { username: string; password: string; }, callback: () => any) {
        const headers = new HttpHeaders(credentials ? {
            authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});
        this.http.get<Principal>(environment.ssoUrl + '/user', { headers: headers }).subscribe(response => {
            if (response['name']) {
                this.authenticated = true;
            } else {
                this.authenticated = false;
            }
            console.log(this.authenticated);
            return callback && callback();
        });
    }
  
    logout() {
        this.http.post(environment.ssoUrl + '/logout', {}).subscribe();
        this.authenticated = false;
        console.log(this.authenticated);
    }
  
  }