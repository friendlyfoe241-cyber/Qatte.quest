export type QuestionType = 'multiple-choice' | 'text-input';

export type Question = {
  id: string;
  type?: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: number | string;
  timeLimitSecs: number; // Time limit for this specific question
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export const QUIZZES: Quiz[] = [
  {
    id: "q_standard",
    title: "Standard Security Test",
    description: "A normal quiz to test general knowledge while the anti-cheat system monitors you.",
    questions: [
      {
        id: "q1",
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        timeLimitSecs: 15,
      },
      {
        id: "q2",
        text: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        timeLimitSecs: 15,
      },
      {
        id: "q3",
        text: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correctAnswer: 2,
        timeLimitSecs: 15,
      },
      {
        id: "q4",
        type: "text-input",
        text: "What is the chemical symbol for water?",
        options: [],
        correctAnswer: "H2O",
        timeLimitSecs: 20,
      }
    ]
  },
  {
    id: "q_speed",
    title: "Extreme Speed Round",
    description: "Very short time limits (5 seconds) to test the critical response window timer.",
    questions: [
      {
        id: "s1",
        text: "Quick! What is 7 + 8?",
        options: ["14", "15", "16", "17"],
        correctAnswer: 1,
        timeLimitSecs: 5,
      },
      {
        id: "s2",
        text: "Which color is an additive primary color?",
        options: ["Yellow", "Cyan", "Red", "Magenta"],
        correctAnswer: 2,
        timeLimitSecs: 5,
      },
      {
        id: "s3",
        text: "Fast! How many legs does a spider have?",
        options: ["6", "8", "10", "12"],
        correctAnswer: 1,
        timeLimitSecs: 5,
      }
    ]
  },
  {
    id: "q_trap",
    title: "The Honey Trap",
    description: "Questions designed to tempt you into cheating. Try copying the text or switching tabs to test the lockdown!",
    questions: [
      {
        id: "t1",
        text: "Try to copy this text: 'E=mc^2'. Does the system catch you?",
        options: ["Yes, it blocked me", "No, I copied it", "What is copying?", "I used my phone"],
        correctAnswer: 0,
        timeLimitSecs: 20,
      },
      {
        id: "t2",
        text: "Without looking at another tab, what is the exact population of Tuvalu right now?",
        options: ["11,396", "45,210", "1,200", "500,000"],
        correctAnswer: 0,
        timeLimitSecs: 20,
      },
      {
        id: "t3",
        text: "Try right-clicking to inspect element. What happens?",
        options: ["It works fine", "Context menu blocked", "Screen turns blue", "Music plays"],
        correctAnswer: 1,
        timeLimitSecs: 20,
      }
    ]
  }
];
