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
  currentAnswers: any[];
  currentQuestionIndex: number;
  teamAScore: number;
  teamBScore: number;
  questions: any[];
  currentTeam: string;
  isQuestionClicked: boolean = false;
  private pingAudio: HTMLAudioElement;
  private wrongAnsAudio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.currentQuestion = '';
    this.currentQuestionIndex = 0;
    this.currentAnswers = [];
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.questions = [];
    this.currentTeam = 'A'; // Start with Team A as active team
    this.pingAudio = new Audio(
      'https://www.myinstants.com/media/sounds/family-feud-good-answer.mp3'
    );
    this.wrongAnsAudio = new Audio(
      'https://www.myinstants.com/media/sounds/neg-portal2buzzer_2DIuFda.mp3'
    );
  }

  ngOnInit() {
    this.http.get<Question[]>('assets/questions.json').subscribe((data) => {
      this.questions = data;
      this.loadQuestion(this.currentQuestionIndex);
    });
  }

  loadQuestion(index: number) {
    this.currentQuestionIndex = index;
    this.currentQuestion = this.questions[index].question;
    this.currentAnswers = this.questions[index].answers.map(
      (answer: any, index: number) => ({
        value: index + 1,
        content: answer,
        flipped: false,
      })
    );
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
    this.pingAudio.load();
    this.pingAudio.play();
  }

  playWrongAnswerSound() {
    this.wrongAnsAudio.load();
    this.wrongAnsAudio.play();
  }

  nextQuestion() {
    this.isQuestionClicked = false;
    const nextIndex = this.currentQuestionIndex + 1;
    if (nextIndex < this.questions.length) {
      this.loadQuestion(nextIndex);
    }
  }

  toggleQuestion() {
    this.isQuestionClicked = !this.isQuestionClicked;
  }
}

interface Card {
  value: number;
  content: string;
  flipped: boolean;
}
