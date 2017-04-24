import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'as-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private emailAddress: String = ''
  private password: String = ''
  private showLoginError: boolean = false

  /** Constructor */
  constructor(private userService: UserService,
    private router: Router) {
    }

  /** On Init */
  ngOnInit() {
    this.emailAddress = ''
    this.password = ''
    this.showLoginError = false
  }

  /**
   * Submit username/password to login service
   */
  performLogin() {
    this.showLoginError = false
    this.userService.login(this.emailAddress, this.password).subscribe((result) => {
      // Reset password field first
      this.password = ''
      this.showLoginError = (result.resultShort !== 'success')
      if (result.resultShort === 'success') {
        this.router.navigate(['/'])
      }
    },
    (err) => {
      this.password = ''
      this.showLoginError = true
    })
  }
}
