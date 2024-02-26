import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokeService } from './poke.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'pokeguesserTUT';
  poke = "";
  sprite = null;
  guessed = false;
  correct = false;
  guess = "";

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
    this.fetchPoke()
  }
}
