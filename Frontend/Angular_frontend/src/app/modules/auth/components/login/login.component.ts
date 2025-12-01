import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value
    ).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.error = 'Usuario o contraseña incorrectos';
        console.error('Login error:', error);
      }
    });
  }

  private redirectBasedOnRole(): void {
    const userRole = this.authService.getUserRole();
    switch (userRole) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'staff':
        this.router.navigate(['/staff']);
        break;
      case 'student':
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
