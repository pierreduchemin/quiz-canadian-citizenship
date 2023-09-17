import Polyglot from "node-polyglot"
import locale_fr from "./data/locale_fr_CA.json"
import "./styles/index.scss"
import { QuestionModel, QuestionnaireModel } from "./data/models"

const polyglot = new Polyglot()
polyglot.extend(locale_fr)

const app = document.querySelector("#app")! as HTMLElement

const questionnaireModel = new QuestionnaireModel('fr_CA')

init()

function init() {
  document.title = polyglot.t("info.app_title")

  const introText = document.querySelector("#intro")! as HTMLHeadingElement
  introText.innerText = polyglot.t("info.exam_intro")

  const startButton = document.querySelector("#start")! as HTMLButtonElement
  startButton.innerText = polyglot.t("action.start")
  startButton.addEventListener("click", startQuiz)
}

function startQuiz(event: MouseEvent) {
  event.stopPropagation()
  displayQuestion(questionnaireModel.questionCount)
}

function clean() {
  while (app.firstElementChild) {
    app.firstElementChild.remove()
  }
  const progress = getProgressBar(questionnaireModel.questionCount, questionnaireModel.questionSetLength)
  app.appendChild(progress)
}

function displayQuestion(index: number) {
  clean()
  const question: QuestionModel = questionnaireModel.questions[questionnaireModel.questionSet[index]]

  if (!question) {
    displayFinishMessage()
    return
  }

  const title = getTitleElement(question.question)
  app.appendChild(title)
  const answersDiv = createAnswers(question.options)
  app.appendChild(answersDiv)

  const submitButton = getSubmitButton()
  submitButton.addEventListener("click", submit)
  app.appendChild(submitButton)
}

function displayFinishMessage() {
  const progress = document.querySelector("progress")
  progress?.remove()

  const h1 = document.createElement("h1")
  h1.innerText = polyglot.t("info.exam_finished")

  const success = (questionnaireModel.score / questionnaireModel.questionSetLength) > 0.75
  const p = document.createElement("p")
  const p2 = document.createElement("p")
  p.innerText = polyglot.t("info.exam_score", { "score": questionnaireModel.score, "questionSetLength": questionnaireModel.questionSetLength })
  p2.innerText = success ? polyglot.t("info.exam_success") : polyglot.t("info.exam_fail")

  app.appendChild(h1)
  app.appendChild(p)
  app.appendChild(p2)

  const restartButton = getRestartButton()
  restartButton.addEventListener("click", () => {
    location.reload()
  })
  app.appendChild(restartButton)
}

function submit() {
  const selectedAnswer = app.querySelector('input[name="answer"]:checked') as HTMLInputElement | null
  const value = selectedAnswer?.value
  if (!value) {
    return
  }
  disableAllAnswers()


  const question: QuestionModel = questionnaireModel.questions[questionnaireModel.questionSet[questionnaireModel.questionCount]]
  const isCorrect = question.answer === value

  if (isCorrect) {
    questionnaireModel.score++
  }

  showFeedback(isCorrect, question.answer, value)

  const feedback = getFeedbackMessage(isCorrect, question.answer)
  app.appendChild(feedback)
  
  displayNextQuestionButton(() => {
    questionnaireModel.questionCount++
    displayQuestion(questionnaireModel.questionCount)
  })
}

function createAnswers(answers: string[]) {
  const answersDiv = document.createElement("div")

  answersDiv.classList.add("answers")

  for (const answer of answers) {
    const label = getAnswerElement(answer)
    answersDiv.appendChild(label)
  }

  return answersDiv
}

function getTitleElement(text: string) {
  const title = document.createElement("h3")
  title.innerText = text
  return title
}

function formatId(text: string) {
  return text.replace(/\s/gi, "-").replace(/\"/gi, "'").toLowerCase()
}

function getAnswerElement(text: string) {
  const label = document.createElement("label")
  label.innerText = text
  const input = document.createElement("input")
  const id = formatId(text)
  input.id = id
  label.htmlFor = id
  input.setAttribute("type", "radio")
  input.setAttribute("name", "answer")
  input.setAttribute("value", text)
  label.appendChild(input)
  return label
}

function getSubmitButton() {
  const submitButton = document.createElement("button")
  submitButton.innerText = polyglot.t("action.submit")
  submitButton.classList.add("submit")
  return submitButton
}

function getRestartButton() {
  const restartButton = document.createElement("button")
  restartButton.innerText = polyglot.t("action.restart")
  return restartButton
}

function showFeedback(isCorrect: boolean, correct: string, answer: string) {
  const correctAnswerId = formatId(correct)
  
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  )! as HTMLLabelElement

  const selectedAnswerId = formatId(answer)
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  )! as HTMLLabelElement

  correctElement.classList.add("correct")
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect")
}

function getFeedbackMessage(isCorrect: boolean, correct: string) {
  const paragraph = document.createElement("p")
  paragraph.innerText = isCorrect
    ? polyglot.t("info.exam_good_answer")
    : polyglot.t("info.exam_bad_answer", { correct })

  return paragraph
}

function getProgressBar(value: number, max: number) {
  const progress = document.createElement("progress")
  progress.classList.add("progress")
  progress.classList.add("is-canadian-red")
  progress.setAttribute("max", max.toString())
  progress.setAttribute("value", value.toString())
  return progress
}

function displayNextQuestionButton(callback: () => void) {
  app.querySelector("button")!.remove()

  const nextButton = document.createElement("button")
  nextButton.innerText = polyglot.t("action.next")
  app.appendChild(nextButton)

  nextButton.addEventListener("click", () => {
    callback()
  })
}

function disableAllAnswers() {
  const radioInputs = document.querySelectorAll('input[type="radio"]')

  for (const radio of radioInputs) {
    (radio as HTMLInputElement).disabled = true
  }
}
