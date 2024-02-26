# Pokéguesser
![image](https://github.com/reidhaegele/pokeguesser/assets/37484165/0be6c3b3-5f2f-445f-96e7-63944d16117b)

Pokémon guessing game!

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.1.
Credit to [Chris Achinga](https://dev.to/chrisachinga/how-to-fetch-data-from-an-api-in-angular-4p37) for API tutorial example

## Tutorial
Author: Reid Haegele
#### Prerequisites:
- [Install NodeJS](https://nodejs.org/en/download)
- [Install vscode](https://code.visualstudio.com/download)
- [Install Git](https://git-scm.com/downloads)

#### Create new project
First, open vscode. Then, open the terminal in vscode by doing terminal->new terminal or with keyboard shortcut: 
> ctrl + shift + `

Once in the terminal, install the Angular command line utility:
> npm install -g @angular/cli

Use the Angular CLI to generate a new Angular project. First, open vscode.
> ng new pokeguesser

- If an error occurs stating "cannot be loaded because running scripts is disabled on this system", then open Powershell and run the following command: `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser`. Make sure to say Yes to All.
- If asked about sending usage data to the Angular team, do either yes or no (your preference)
- If asked `Which stylesheet format would you like to use?` use css.
- If asked `Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)?` say no (n).

Navigate into the newly created project directory:
> cd pokeguesser

Open the folder in the current vscode window (-r reuses current window). NOTE: Include the period in the below command
> code -r .

Go to extensions and search for Angular Language Service. Install the extension.

You now are looking at a freshly generated Angular project. The core of this app is the src/app/ directory. Let's quickly brief some core Angular concepts by watching [this video](https://youtu.be/Ata9cSC2WpM?si=A-OpyxyiajeymxQc) from Fireship.

Let's check out the app by running the local development server. Open the vscode terminal back up and run:
> ng serve

Open the [localhost link](http://localhost:4200/)

Not too shabby for a Hello World!

#### Fetch from an API
We are creating a Pokémon guessing game. Since there are hundreds of Pokémon, we are going to use [PokéAPI](https://pokeapi.co/) to fetch the name and sprite image of our Pokémon. To start, we will create a service to handle our interaction with the API.

Stop the server, if running, with `ctrl + c` in the terminal.

In the src/app/ directory, create a new file called `poke.service.ts`:

![image](https://github.com/reidhaegele/pokeguesser/assets/37484165/5e7b696f-56e3-48b9-a6f9-2dfc111fde47)

We will be limiting the api to the original 151 gen1 Pokémon by randomly generating a number between 1 and 151. You can expand this up to 1025 Pokémon just by changing 151 in `Math.floor(Math.random() * 151)` below.
Inside of `poke.service.ts`, paste in the following code:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PokeService {
  url = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  getPoke(): Observable<any> {
    return this.http.get(this.url + Math.floor(Math.random() * 151), { headers: { Accept: 'application/json' } });
  }
}
```

This PokeService is a service that we can inject into other components. By specifying `@Injectable({providedIn: 'root'})`, we are stating that a [Singleton](https://refactoring.guru/design-patterns/singleton) of PokeService is created and accessible by the entire application. This is because all injected services need a provider, so we create one instance and provide it to the whole application. This leads us to our next issue, the HttpClient. 

app.config.ts
------
We use an injected HttpClient service in our PokeService. However, we have not specified a Provider. If we never specify a provider, we will recieve a provider undefined error later on. Let's establish the HttpClient provider now. in `app.config.ts`, add the following import:
```ts
import { HttpClientModule } from '@angular/common/http';
```
Change the existing @angular/core` import to include importProvidersFrom:
```ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
```
Then modify the providers list to include HttpClientModule:
```ts
providers: [provideRouter(routes), importProvidersFrom(HttpClientModule)]
```

app.component.ts
------
Inside of the `app.component.ts` file:
Add the following import (The pokémon API service you just created):
```ts
import { PokeService } from './poke.service';
```
Inside the `export class AppComponent` curly braces add:
variables poke and sprite:
```ts
poke = "";
sprite = null;
```
and a constructor for the pokémon API service:
```ts
constructor(private pokeService: PokeService) {}
```
and finally a `fetchPoke` function to grab a Pokémon from the API:
```ts
fetchPoke(): void {
    this.pokeService.getPoke().subscribe((data: any) => {
      this.poke = data.name;
      this.sprite = data.sprites.front_default
    });
  }
```

Now, edit `app.component.html` by deleting everything currently in the file. Replace it with:
```html
<div>
  <!-- Navbar -->
  <div>
    <nav>
      <div>
        <a>PokeGuesser</a>
      </div>
    </nav>
  </div>

  <!-- content -->
  <div>
    <h4>Guess that Pokemon!</h4>
    <div>
      <img width="300px" [src]="sprite">
    </div>
    <input type="text" placeholder="pikachu">
    <div>
      <div>
        <button (click)="fetchPoke()">New</button>
      </div>
      <div>
        <button>Check</button>
      </div>
    </div>
  </div>
</div>
```

Check out the app with `ng serve`!
It should now be able to fetch a random Pokémon from the PokéAPI and display its sprite image. Be sure to hit the "new" button a few times to try it out. Next, we will add the guessing and checking functionality.

#### Guess and Check Functionality
Back in the `app.component.ts` file, initialize three new variables in `export class AppComponent`:
```ts
  guessed = false;
  correct = false;
  guess = "";
```
Add a guess function under your variables in `export class AppComponent`:
```ts
  guessPoke(poke: string) {
    this.guessed = true
    this.correct = this.guess.toLowerCase() === poke
  }
```
And add an onKey function in `export class AppComponent`:
```ts
onKey(event: any) {this.guess = event.target.value;}
```
Finally, modify the existing fetchPoke function in `export class AppComponent` to reset those variables each time a new Pokémon is fetched:
```ts
fetchPoke(): void {
    this.guess = ""
    this.guessed = false
    this.correct = false
    this.pokeService.getPoke().subscribe((data: any) => {
      this.poke = data.name;
      this.sprite = data.sprites.front_default
    });
  }
```

In the app.component.html, we need to do the following:
Modify the input tag to include two additional attributes:
```html
<input [value]="guess" (keyup)="onKey($event)" type="text" placeholder="pikachu">
```
Modify the check button to include a function call:
```html
<button (click)="guessPoke(poke)">
  {{ guessed ? "Checked" : "Check" }}
</button>
```
Add an indicator for correct or incorrect at the end of the last div. Refer to the full html below:
```html
<p>{{ guessed ? (correct ? ("Correct - " + poke) : ("Incorrect - " + poke)) : "" }}</p>
```
The full app.component.html should now look like this:
```html
<div>
  <!-- Navbar -->
  <div>
    <nav>
      <div>
        <a>PokeGuesser</a>
      </div>
    </nav>
  </div>

  <!-- content -->
  <div>
    <h4>Guess that Pokemon!</h4>
    <div>
      <img width="300px" [src]="sprite">
    </div>
    <input [value]="guess" (keyup)="onKey($event)" type="text" placeholder="pikachu">
    <div>
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
```

#### Tidying Up - Back End
app.component.ts
------
Modify the existing import from @angular/core to include three more imports:
```ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
```
Modify the `export class AppComponent` to implement `OnInit`:
```ts
export class AppComponent implements OnInit {
```
Add the `ngOnInit` function inside of the `export class AppComponent` function to ensure a Pokémon is fetched the first time the page is loaded:
```ts
  ngOnInit(): void {
    this.fetchPoke()
  }
```
Add the `ngAfterViewInit` function inside of the `export class AppComponent` function to ensure the input field is automatically focused.
```ts
  @ViewChild("pokeGuess") pokeGuessField!: ElementRef;
  ngAfterViewInit() {
    this.pokeGuessField.nativeElement.focus();
  }
```
Add the following line to the `fetchPoke` function to ensure the input field is automatically focused after hitting the _New_ button:
```ts
this.pokeGuessField.nativeElement.focus();
```
Add the following function inside of the `export class AppComponent` function to ensure that when the `enter` key is pressed, either the guess is checked or a new Pokémon is fetched.
```ts
  decideEnter(poke: string): void {
    if (this.guessed) {
      this.fetchPoke()
    }
    else {
      this.guessPoke(poke)
    }
  }
```

#### Tidy Up - Front End
In your project, create a new **folder** in src/assets called font. Then, download this arcade font [joystix](https://www.dafont.com/joystix.font). Open the downloads folder in file explorer and find `joystix.zip`. Extract the files from the zip. Open the newly created joystix folder. Rename `joystix monospace.otf` to `joystix.otf` Drag the `joystix.otf` file into the src/assets/font/ folder.

In the global css file `src/styles.css`, add the following:
```css
html {
    background-color: #e3e3e3;
}
@font-face {
    font-family: 'joystix';
    src: url(assets/font/joystix.otf) format("opentype");
}
```

app.component.html
------
In src/app/app.component.html, once again modify the input line to add a few more attributes:
```html
<input [value]="guess" #pokeGuess pokeGuessField type="text" class="guess-input" (keyup.enter)="decideEnter(poke)" (keyup)="onKey($event)" placeholder="pikachu" autofocus cdkTrapFocus>
```

app.component.css
------
In src/app/app.component.css, add the following css classes:
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
    font-size: 3.5rem;
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
input[type="text"]
{
    font-family: 'joystix';
    font-size: 1.5rem;
}
```

app.component.html
------
In src/app/app.component.html, replace the existing code with the following in order to add the css class selectors:
```html
<div class="container">
  <!-- Navbar -->
  <div>
    <nav>
      <div>
        <a>PokeGuesser</a>
      </div>
    </nav>
  </div>

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

That is it! Congratulations on your new Pokémon Guessing Game!
