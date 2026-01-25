import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule],
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(private authService: AuthService,
              private router: Router
             ) {}

  onLogin() {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (res) => {
          console.log('Token stored successfully', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials');
        }
      });
  }
}
