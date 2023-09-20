import Polyglot from "node-polyglot"
import locale_fr from "./data/locale_fr_CA.json"
import locale_en from "./data/locale_en_CA.json"
import "./styles/index.scss"
import { QuestionModel, QuestionnaireModel } from "./data/models"

let polyglot = new Polyglot()
polyglot.extend(locale_fr)

const app = document.querySelector("#app")! as HTMLElement

let currentLocale: string = 'fr_CA'
let currentQuestionSetLength: number = 20
let questionnaireModel: QuestionnaireModel

init()

function init() {
  questionnaireModel = new QuestionnaireModel(currentLocale, currentQuestionSetLength)

  clean()
  document.title = polyglot.t("info.app_title")

  const app = document.querySelector('#app')! as HTMLElement

  const h1: HTMLHeadingElement = document.createElement("h1")
  h1.innerText = polyglot.t("info.exam_intro")
  h1.classList.add('intro')
  h1.classList.add('big-title')
  app.appendChild(h1)

  const divLocale: HTMLDivElement = document.createElement('div')
  divLocale.innerText = polyglot.t("info.exam_locale_label")
  app.appendChild(divLocale)

  const selectLocale: HTMLSelectElement = document.createElement('select')
  selectLocale.id = 'locale'
  const frOption: HTMLOptionElement = document.createElement('option')
  frOption.value = 'fr_CA'
  frOption.innerText = 'Français'
  selectLocale.options.add(frOption)
  const enOption: HTMLOptionElement = document.createElement('option')
  enOption.value = 'en_CA'
  enOption.innerText = 'English'
  selectLocale.options.add(enOption)
  selectLocale.addEventListener("change", () => {
    updateModel()
  })
  app.appendChild(selectLocale)

  const divQuestionSetLength: HTMLDivElement = document.createElement('div')
  divQuestionSetLength.innerText = polyglot.t("info.exam_question_set_length_label")
  app.appendChild(divQuestionSetLength)

  const selectQuestionSetLength: HTMLSelectElement = document.createElement('select')
  selectQuestionSetLength.id = 'questionSetLength'
  for (let i = 10; i <= 40; i += 10) {
    const optionCount: HTMLOptionElement = document.createElement('option')
    optionCount.value = i.toString()
    optionCount.innerText = i.toString()
    selectQuestionSetLength.options.add(optionCount)
  }
  selectQuestionSetLength.addEventListener("change", () => {
    updateModel()
  })
  app.appendChild(selectQuestionSetLength)

  const buttonStart: HTMLButtonElement = document.createElement('button')
  buttonStart.id = 'start'
  buttonStart.innerText = polyglot.t("action.start")
  buttonStart.addEventListener("click", startQuiz)
  app.appendChild(buttonStart)
}

function updateModel() {
  const localeSelect = document.querySelector("#locale") as HTMLSelectElement
  if (currentLocale !== localeSelect.value) {
    currentLocale = localeSelect.value
    polyglot = new Polyglot()
    if (currentLocale === "en_CA") {
      polyglot.extend(locale_en)
    } else {
      polyglot.extend(locale_fr)
    }
    init()
  }

  const questionSetLengthSelect = document.querySelector("#questionSetLength") as HTMLSelectElement
  currentQuestionSetLength = parseInt(questionSetLengthSelect.value)
  questionnaireModel = new QuestionnaireModel(currentLocale, currentQuestionSetLength)
}

function startQuiz(event: MouseEvent) {
  event.stopPropagation()
  displayQuestion(questionnaireModel.questionCount)
}

function clean() {
  while (app.firstElementChild) {
    app.firstElementChild.remove()
  }
}

function displayQuestion(index: number) {
  clean()

  const progress = getProgressBar(questionnaireModel.questionCount, questionnaireModel.questionSetLength)
  app.appendChild(progress)

  const question: QuestionModel = questionnaireModel.questions[questionnaireModel.questionSet[index]]

  if (!question) {
    displayFinishMessage()
    return
  }

  const title = getTitleElement(question.question)
  app.appendChild(title)
  const answersDiv = createOptions(question.options)
  app.appendChild(answersDiv)

  const submitButton = getSubmitButton()
  submitButton.addEventListener("click", () => {
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
  })
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
    init()
  })
  app.appendChild(restartButton)
}

function createOptions(options: string[]) {
  const optionsDiv = document.createElement("div")

  optionsDiv.classList.add("answers")

  for (const answer of options) {
    const label = getAnswerElement(answer)
    optionsDiv.appendChild(label)
  }

  return optionsDiv
}

function getTitleElement(text: string) {
  const title = document.createElement("h3")
  title.classList.add("question-title")
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
