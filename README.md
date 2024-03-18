# Pokéguesser
![image](https://github.com/reidhaegele/poke-firebase/assets/37484165/9ef0a60f-e33c-4a70-96e7-0c5cdf85ec02)

Pokémon guessing game!

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.1.

Credit to [Chris Achinga](https://dev.to/chrisachinga/how-to-fetch-data-from-an-api-in-angular-4p37) for API tutorial example.
Credit to [MonsterlessonsAcademy](https://www.youtube.com/watch?v=586O934xrhQ) for Firebase Auth tutorial.

## Tutorial
Author: Reid Haegele

Prerequisites:
- git clone the [original repository](https://github.com/reidhaegele/pokeguesser.git)
- Create an account on [Firebase](https://firebase.google.com/)

#### Angular Fire
In the vscode terminal, run the following:
> ng add @angular/fire

> The package @angular/fire@17.0.1 will be installed and executed.
Would you like to proceed?

Say yes.

> What features would you like to setup?

Deselect hosting. Select Authentication.

> Which Firebase account would you like to use?

Add your Firebase account and sign in through using the link.

> Please select a project:

Select [CREATE NEW PROJECT]

> Please specify a unique project id (cannot be modified afterward) [6-30 characters]:

Type in "GDSC-[your name and last initial]-pokeguesser". Be sure to replace your name with your actual name and initial. This is because your project ID must be uniqe from all Firebase projects which can be challenging.

> What would you like to call your project? (gdsc-[[your name and last initial]]-pokeguesser)

Just hit enter to keep the default name.

> Please select an app:

Select [CREATE NEW APP] and hit enter.

Now, check your configuration file src\app\app.config.ts to ensure that Angular Fire was set up correctly. It should have 
![image](https://github.com/reidhaegele/poke-firebase/assets/37484165/e8d2aee4-5875-4426-bb66-00a69bbebb8f)

I hid my information simply so that you would not attempt to copy it. However, do not worry about pushing this information to a public repository. This information is simply identifying your project and won't allow people to charge costs to your Firebase account. To ensure you are using Firebase safely, look at the [official docs](https://firebase.google.com/docs/rules).

#### Paging
To allow for account creation and signing in, we will need more pages. to begin, we will separate our application into pages and route to these pages.
Before that, create a folder in the app directory called "components". Then, run the following commands:
> ng g c components/login

> ng g c components/register

> ng g c components/navbar

Create a folder in the app directory called "pages". Then, run the following commands:
> ng g c pages/home

> ng g c pages/create-account

> ng g c pages/signin

in the `src/app/routes.ts` file, replace everything with the following:
```ts
import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: 'register', component: CreateAccountComponent},
    { path: 'login', component: SigninComponent },
    { path: '', component: HomeComponent },
];
```

------

We are moving the home page to a new component.

In the `src/app/app.component.html` file, copy everything from `src/app/app.component.html` and paste it into `src/app/pages/home.component.html`. Put the following into `src/app/app.component.html`:
```html
<div>
  <app-navbar></app-navbar>
  <!-- content -->
  <router-outlet></router-outlet>

</div>
```

Copy everything from `src/app/app.component.ts` and paste it into `src/app/pages/home.component.ts`.
In `src/app/app.component.ts`, delete everything inside the export class AppComponent function and remove the OnInit. Remove the PokeService import. Add an import for the Navbar Component.
```ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pokeguesserTUT';

}
```

Delete everything in the `src/app/app.component.css` file

------

Create two files, `user.interface.ts` and `auth.service.ts`.
Put the following in user.interface.ts:
```ts
export interface UserInterface {
    email: string;
    username: string;
}
```
Put the following in `auth.service.ts`:
```ts
import { Injectable, inject, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { UserInterface } from "./user.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth)
    user$ = user(this.firebaseAuth)
    currentUserSig = signal<UserInterface | null | undefined>(undefined)

    register(email: string, username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password,).then(response => updateProfile(response.user, {displayName: username}))
        return from(promise)
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password,).then(() => {});
        return from(promise)
    }

    logout(): Observable<void> {
        const promise = signOut(this.firebaseAuth)
        return from(promise)
    }
}
```

------

In the navbar component, replace the .css, .html, and .ts files with the following code respectively:
.css:
```css
.content {
    border-bottom: 1px solid #000000;
    width: 100%;
    font-family: 'joystix';
    font-size: 2.5rem;
}
.navbar {
    padding: 15px 15px;
    display: flex;
    justify-content: space-between;
}
.start {
    display: flex;
    align-items: center;
}
.start a {
    font-size: larger;
    font-weight: bold;
    text-decoration: none;
    color: #000000;
    text-decoration: none;
}

.end {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    font-size: 1.5rem;
}
.end a {
    color: #000000;
    text-decoration: none;
}
```
.html:
```html
<div class="content">
    <nav class="navbar">
        <div class="start">
            <a routerLink="/">PokeGuesser</a>
        </div>
        @if (authService.currentUserSig() == null) {
        <div class="end">
            <a routerLink="/register">Register</a>|
            <a routerLink="/login">Login</a>
        </div>
        }
        @else {
        <div class="end">
            {{authService.currentUserSig()?.username}}-
            <a (click)="logout()">Logout</a>
        </div>
        }
    </nav>
</div>
```
.ts:
```ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  logout(): void {
    this.authService.logout();
  }
}
```

------

In the login component, replace the .css, .html, and .ts files with the following code respectively:
.css:
```css
.content {
    width: 100%;
    font-family: 'joystix';
    font-size: 1rem;
}
input[type="text"] {
    font-family: 'joystix';
    font-size: 0.75rem;
}
.error {
    color: red;
}
button {
    font-family: 'joystix';
}
```
.html:
```html
<div class="content">
  <h1>Login</h1>

  @if (errorMessage) {
    <div class="error">{{ errorMessage }}</div>
  }

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div>
      <input type="text" placeholder="Email" formControlName="email" />
    </div>
    <div>
      <input type="password" placeholder="Password" formControlName="password" />
    </div>
    <div>
      <button type="submit">Sign In</button>
    </div>
  </form>
</div>
```
.ts:
```ts
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService)
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({next: () => {
      this.router.navigateByUrl('/')
    }, error: (err) => {
      this.errorMessage = err.code
    }})
  }
}
```

------

In the register component, replace the .css, .html, and .ts files with the following code respectively:
.css:
```css
.content {
    width: 100%;
    font-family: 'joystix';
    font-size: 1rem;
}
input[type="text"] {
    font-family: 'joystix';
    font-size: 0.75rem;
}
.error {
    color: red;
}
button {
    font-family: 'joystix';
}
```
.html:
```html
<div class="content">
  <h1>Register</h1>

  @if (errorMessage) {
    <div>{{ errorMessage }}</div>
  }

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div>
      <input type="text" placeholder="Username" formControlName="username" />
    </div>
    <div>
      <input type="text" placeholder="Email" formControlName="email" />
    </div>
    <div>
      <input type="password" placeholder="Password" formControlName="password" />
    </div>
    <div>
      <button type="submit">Sign Up</button>
    </div>
  </form>
</div>
```
.ts:
```ts
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService)
  router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email, rawForm.username, rawForm.password).subscribe({next: () => {
      this.router.navigateByUrl('/')
    }, error: (err) => {
      this.errorMessage = err.code
    }})
  }
}
```

------

In the pages/create-account component, replace the .html, and .ts files with the following code respectively:
.html:
```html
<app-register></app-register>
```
.ts:
```ts
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
```

------

In the pages/signin component, replace the .html, and .ts files with the following code respectively:
.html:
```html
<app-login></app-login>
```
.ts:
```ts
import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

}
```

------

In the pages/home component, replace the .css, .html, and .ts files with the following code respectively:
.css:
```css
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2.5rem;
    background-color: #e3e3e3;
    font-family: 'joystix';
}
nav {
    display: flex;
    width: 100%;
    font-size: 3.5rem;
    justify-content: flex-start;
}
.navbar {
    width: 100%;
    font-size: 1.5rem;
    display: flex;
    justify-content: space-between;
}
.links {
    padding-left: 40px;
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.button-group {
    display: flex;
    justify-content: space-evenly;
}
button {
    background-color: #2c2c2c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 2.2rem;
    margin: 1rem;
    font-family: 'joystix';
}
button:hover {
    opacity: 90%;
}
input[type="text"] {
    font-family: 'joystix';
    font-size: 1.5rem;
}
```

.html:
```html
<div class="container">
    <!-- content -->
    <div class="content">
      <h4>Guess that Pokemon!</h4>
      <div>
        <img width="300px" [src]="sprite">
      </div>
      <div>
        <input [value]="guess" #pokeGuess pokeGuessField type="text" class="guess-input" (keyup.enter)="decideEnter(poke)" (keyup)="onKey($event)" placeholder="pikachu" autofocus cdkTrapFocus>
        <div class="button-group">
          <div>
            <button (click)="fetchPoke()">New</button>
          </div>
          <div>
            <button (click)="guessPoke(poke)">
              {{ guessed ? "Checked" : "Check" }}
            </button>
          </div>
        </div>
      </div>
      <p>{{ guessed ? (correct ? ("Correct - " + poke) : ("Incorrect - " + poke)) : "" }}</p>
    </div>
  </div>
```

.ts:
```ts
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PokeService } from './poke.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'pokeguesserTUT';
  poke = "";
  sprite = null;
  guessed = false;
  correct = false;
  guess = "";

  authService = inject(AuthService);

  @ViewChild("pokeGuess") pokeGuessField!: ElementRef;
  ngAfterViewInit() {
    this.pokeGuessField.nativeElement.focus();
  }

  constructor(private pokeService: PokeService) {}
  fetchPoke(): void {
    this.guess = ""
    this.guessed = false
    this.correct = false
    this.pokeService.getPoke().subscribe((data: any) => {
      this.poke = data.name;
      this.sprite = data.sprites.front_default
    });
    this.pokeGuessField.nativeElement.focus();
  }

  onKey(event: any) {this.guess = event.target.value;}

  guessPoke(poke: string) {
    this.guessed = true
    this.correct = this.guess.toLowerCase() === poke
  }

  decideEnter(poke: string): void {
    if (this.guessed) {
      this.fetchPoke()
    }
    else {
      this.guessPoke(poke)
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUserSig.set(null);
      }
    });
    this.fetchPoke();
  }

  logout(): void {
    this.authService.logout();
  }
}
```

------

Move the `poke.service.ts` file into the pages/home directory.
