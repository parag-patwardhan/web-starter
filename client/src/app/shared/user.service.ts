import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'

@Injectable()
export class UserService {
  private redirectUrl: string = ''
  private loggedInUserRoles: string[] = []

  /** Mock HTTP service as we do not have a server running yet. Delete this after the server is set up */
  private mockHttp: any = {
    post: function(url, body, headers) {
      return Observable.of({
        json: () => { return {
        resultShort: 'success',
        user: {
          jwt: 'Dummy JWT key',
          firstName: 'FirstName',
          lastName: 'LastName',
          roles: ['admin', 'user']
        }
      }}})
    }
  }

  /** Constructor */
  constructor(private http: Http,
              private router: Router) {
  }

  /**
   * Perform login and save the token if successful
   */
  login(username, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json')

    return this.mockHttp
      .post(
        'http://localhost:4001/login', 
        { username: username,
          password: password }, 
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        if (res.resultShort === 'success') {
          localStorage.setItem('userJWT', res.user.jwt)
          localStorage.setItem('isUserLoggedIn', 'true')
          localStorage.setItem('firstName', res.user.firstName)
          localStorage.setItem('lastName', res.user.lastName)
          this.loggedInUserRoles = []
          res.user.roles.forEach((role) => this.loggedInUserRoles.push(role.role))
          // Save to localStorage in case the page is refreshed
          localStorage.setItem('loggedInUserRoles', JSON.stringify(this.loggedInUserRoles))
        }
        return res
      })
  }
  
  logout() {
    localStorage.setItem('userJWT', '')
    localStorage.setItem('isUserLoggedIn', 'false')
    localStorage.setItem('firstName', '')
    localStorage.setItem('lastName', '')
    localStorage.setItem('loggedInUserRoles', '')
    this.loggedInUserRoles = []
    this.redirectUrl = ''
    this.router.navigate(['/login'])
  }

  isLoggedIn() {
    return localStorage.getItem('isUserLoggedIn') === 'true'
  }

  getToken() {
    return localStorage.getItem('userJWT')
  }

  /**
   * Returns true if the currently logged in user has the specified role. (false if no user is currently logged in)
   */
  userHasRole(role:string): boolean {
    // If this.loggedInUserRoles is empty, the user may have refreshed the browser page. Try loading roles from localStorage
    if (this.loggedInUserRoles.length === 0) {
      this.loggedInUserRoles = JSON.parse(localStorage.getItem('loggedInUserRoles'))
    }
    return this.loggedInUserRoles.includes(role)
  }

  /**
   * Returns the first name of the logged in user (if any)
   */
  getFirstName(): string {
    return localStorage.getItem('firstName')
  }

  /**
   * Returns the last name of the logged in user (if any)
   */
  getLastName(): string {
    return localStorage.getItem('lastName')
  }

  /** Returns the roles of the logged in user */
  getRoles(): string[] {
    // If this.loggedInUserRoles is empty, the user may have refreshed the browser page. Try loading roles from localStorage
    if (this.loggedInUserRoles.length === 0) {
      this.loggedInUserRoles = JSON.parse(localStorage.getItem('loggedInUserRoles'))
    }
    return this.loggedInUserRoles
  }
}
