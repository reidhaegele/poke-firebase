import { Component } from '@angular/core';
import { RegisterComponent } from '../../components/register/register.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {

}
