export class QuestionnaireModel {
    questionSetLength: number = 20;
    questionCount: number = 0
    score!: number;
    questions: Array<QuestionModel> = [];
};

type QuestionModel = {
    id: number;
    question: string;
    answers: Array<string>;
    correct: string;
};
