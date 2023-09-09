type QuestionnaireModel = {
    questions: Array<QuestionModel>;
    remainings: Array<QuestionModel>;
    currentQuestion: number;
    answeredCount: number;
    score: number;
};
var questionnaire: QuestionnaireModel = {
    questions: [],
    remainings: [],
    currentQuestion: -1,
    answeredCount: 0,
    score: 0
};

type QuestionModel = {
    id: number;
    question: string;
    answers: Array<string>;
    correct: string;
};
