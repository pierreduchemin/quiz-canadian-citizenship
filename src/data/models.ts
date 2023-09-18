import { getQuestionSet, getSeed, api } from "../util";

export class QuestionnaireModel {
    questionSetLength: number
    questionCount: number
    score: number
    questions: Array<QuestionModel>
    questionSet: Array<number>

    constructor(locale: string, questionSetLength: number) {
        this.questionSetLength = questionSetLength
        this.questionCount = 0
        this.score = 0
        this.questions = []
        this.questionSet = []
        
        this.initQuestions(locale)
    }

    async initQuestions(locale: string) {
        this.questions = await api<QuestionModel[]>('./questions_' + locale + '.json')
        this.questionSet = getQuestionSet(getSeed(this.questionSetLength), this.questions.length, this.questionSetLength)
    }
};

export type QuestionModel = {
    id: number;
    question: string;
    options: Array<string>;
    answer: string;
};
