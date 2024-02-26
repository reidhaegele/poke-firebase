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
  title = 'PokeGuesser';
  poke = "";
  sprite = null;
  guess = "";
  guessed = false;
  correct = false;

  @ViewChild("myinput") myInputField!: ElementRef;
  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
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
    this.myInputField.nativeElement.focus();
  }

  onKey(event: any) {this.guess = event.target.value;}

  async guessPoke(poke: string) {
    try {
      this.guessed = true
      if (this.guess.toLowerCase() === poke) {
        this.correct = true
      }
      else {
        this.correct = false
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.fetchPoke()
  }
}
