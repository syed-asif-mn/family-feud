import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

interface Question {
  question: string;
  answers: string[];
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
  animations: [
    trigger('clickAnimation', [
      state('initial', style({ transform: 'scale(0.5)' })),
      state('clicked', style({ transform: 'scale(3)' })),
      transition('initial => clicked', animate('300ms ease-out')),
      transition('clicked => initial', animate('300ms ease-in')),
    ]),
  ],
})
export class GameBoardComponent implements OnInit {
  currentQuestion: string;
  currentAnswers: any[];
  currentQuestionIndex: number;
  teamAScore: number;
  teamBScore: number;
  questions: any[];
  currentTeam: string;
  multiplier: number = 1;
  isQuestionClicked: boolean = false;
  private pingAudio: HTMLAudioElement;
  private wrongAnsAudio: HTMLAudioElement;
  private introAudio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.currentQuestion = '';
    this.currentQuestionIndex = 0;
    this.currentAnswers = [];
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.questions = [];
    this.currentTeam = 'A'; // Start with Team A as active team
    this.pingAudio = new Audio(
      'https://archive.org/download/famfeud2023/Family%20Feud%20Music%20Cues%20%26%20Sound%20Effects%20Collection%20%282023%29.rar/Sound%20Effects%2FFamily%20Feud%20Sound%20Effects%20-%202.%20Fast%20Money%20-%203.%20Ding.wav'
    );
    this.wrongAnsAudio = new Audio(
      'https://archive.org/download/famfeud2023/Family%20Feud%20Music%20Cues%20%26%20Sound%20Effects%20Collection%20%282023%29.rar/Sound%20Effects%2FFamily%20Feud%20Sound%20Effects%20-%201.%20Main%20Game%20-%203.%20Strike.wav'
    );
    this.introAudio = new Audio(
      'https://archive.org/download/tvtunes_29930/Family%20Feud%20-%201994.mp3'
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
        value: answer.value,
        content: answer.content,
        flipped: false,
        index: index + 1,
      })
    );
  }

  flipCard(card: Card) {
    this.playPingSound();
    card.flipped = !card.flipped;

    if (card.flipped) {
      // Add the value of the flipped answer to the current team's score
      if (this.currentTeam === 'A') {
        this.teamAScore += card.value * this.multiplier;
      } else if (this.currentTeam === 'B') {
        this.teamBScore += card.value * this.multiplier;
      }
    } else {
      // Subtract the value of the unflipped answer from the current team's score
      if (this.currentTeam === 'A') {
        this.teamAScore -= card.value * this.multiplier;
      } else if (this.currentTeam === 'B') {
        this.teamBScore -= card.value * this.multiplier;
      }
    }
  }

  activateTeam(team: string) {
    // Activate the specified team
    this.currentTeam = team;
  }

  playPingSound() {
    this.pingAudio.volume = 0.5; 
    this.pingAudio.load();
    this.pingAudio.play();
  }

  playWrongAnswerSound() {
    this.wrongAnsAudio.volume = 0.5; 
    this.wrongAnsAudio.load();
    this.wrongAnsAudio.play();
  }

  playIntro() {
    this.introAudio.volume = 0.5; 
      this.introAudio.load();
      this.introAudio.play();
    
      setTimeout(() =>{
        this.introAudio.pause();
        this.introAudio.currentTime = 0;
     }, 19 * 1000);
  }

  nextQuestion() {
    this.multiplier += 1;
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
  index: number;
}
