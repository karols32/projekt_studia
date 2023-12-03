export interface Quiz {
    title: string,
    quizInfo: string,
    questions: Question[],
}

interface Question {
    formula: string,
    answers: string [],
    correctAnswer: string,
    timeSpent: number;
}