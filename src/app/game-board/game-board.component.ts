import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Question {
  question: string;
  answers: string[];
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  currentQuestion: string;
  currentAnswers: any[]; // Replace with your answer data structure
  teamAScore: number;
  teamBScore: number;
  currentTeam: string; // Current active team ('A' or 'B')
  private pingAudio: HTMLAudioElement;
  
  constructor(private http: HttpClient){
    this.currentQuestion = '';
    this.currentAnswers = [];
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.currentTeam = 'A'; // Start with Team A as active team
    this.pingAudio = new Audio('assets/yes.mp3');
  }

  ngOnInit() {
    this.http.get<Question[]>('assets/questions.json').subscribe((data) => {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomQuestion = data[randomIndex];

      this.currentQuestion = randomQuestion.question;
      this.currentAnswers = randomQuestion.answers.map((answer, index) => ({
        value: index + 1,
        content: answer,
        flipped: false,
      }));
    });
  }

  flipCard(card: Card) {
    this.playPingSound();
    card.flipped = !card.flipped;

    if (card.flipped) {
      // Add the value of the flipped answer to the current team's score
      if (this.currentTeam === 'A') {
        this.teamAScore += card.value;
      } else {
        this.teamBScore += card.value;
      }
    } else {
      // Subtract the value of the unflipped answer from the current team's score
      if (this.currentTeam === 'A') {
        this.teamAScore -= card.value;
      } else {
        this.teamBScore -= card.value;
      }
    }
  }

  activateTeam(team: string) {
    // Activate the specified team
    this.currentTeam = team;
  }

  playPingSound() {
    console.log("playing")
    this.pingAudio.play();
  }
}

interface Card {
  value: number;
  content: string;
  flipped: boolean;
}
