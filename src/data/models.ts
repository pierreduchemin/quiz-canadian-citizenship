import { getQuestionSet, getSeed } from "../util";

export class QuestionnaireModel {
    questionSetLength: number
    questionCount: number
    score: number
    questions: Array<QuestionModel>
    questionSet: Array<number>

    constructor() {
        this.questionSetLength = 20
        this.questionCount = 0
        this.score = 0
        this.questions = []
        this.questionSet = getQuestionSet(getSeed(this.questionSetLength), this.questionSetLength)
    }

    async setAllQuestions() {
        this.questions = await this.api<QuestionModel[]>('../data/questions_fr.json')
    }

    async api<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await (response.json() as Promise<T>);
    }
};

export type QuestionModel = {
    id: number;
    question: string;
    options: Array<string>;
    answer: string;
};
