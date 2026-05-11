import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-topbar',
  imports: [ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {

  private authService = inject(AuthService);

private router = inject(Router);

   @Output() toggleSidebar = new EventEmitter<void>();

  onToggle() {
    this.toggleSidebar.emit();
  }

  logout() {

  this.authService
    .logout()
    .then(() => {

      this.router.navigate(['/login']);
    })
    .catch(error => {

      console.error(error);
    });
}

}
