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
      console.log("REID: " + this.authService.currentUserSig());
    });
    this.fetchPoke();
  }

  logout(): void {
    this.authService.logout();
  }
}

