import "./styles/index.scss"
import * as questions from "./data/questions.json"
import { getSeed, getQuestionSet } from './util'

const app = document.querySelector("#app")! as HTMLElement

const startButton = document.querySelector("#start")! as HTMLButtonElement

startButton.addEventListener("click", startQuiz)

const questionSetLength = 20
const questionSet = getQuestionSet(getSeed(questionSetLength), questionSetLength)

function startQuiz(event: MouseEvent) {
  event.stopPropagation()
  let questionCount = 0
  let score = 0

  displayQuestion(questionCount)

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove()
    }
    const progress = getProgressBar(questionCount, questionSetLength)
    app.appendChild(progress)
  }

  function displayQuestion(index: number) {
    clean()
    const question = questions.values[questionSet[index]]

    if (!question) {
      displayFinishMessage()
      return
    }

    const title = getTitleElement(question.question)
    app.appendChild(title)
    const answersDiv = createAnswers(question.answers)
    app.appendChild(answersDiv)

    const submitButton = getSubmitButton()
    submitButton.addEventListener("click", submit)
    app.appendChild(submitButton)
  }

  function displayFinishMessage() {
    const h1 = document.createElement("h1")
    h1.innerText = "Tu as terminé l'examen."
    const p = document.createElement("p")
    const success = (score / questionSetLength) > 0.75
    p.innerText = `Tu as eu ${score} sur ${questionSetLength} point. ` + (success ? "Tu as réussi." : "Tu as échoué.")

    app.appendChild(h1)
    app.appendChild(p)

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

    const question = questions.values[questionSet[questionCount]]
    const isCorrect = question.correct === value

    if (isCorrect) {
      score++
    }

    showFeedback(isCorrect, question.correct, value)

    const feedback = getFeedbackMessage(isCorrect, question.correct)
    app.appendChild(feedback)
    
    displayNextQuestionButton(() => {
      questionCount++
      displayQuestion(questionCount)
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
  submitButton.innerText = "Submit"
  submitButton.classList.add("submit")
  return submitButton
}

function getRestartButton() {
  const restartButton = document.createElement("button")
  restartButton.innerText = "Restart"
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
    ? "Bravo ! Tu as eu la bonne réponse."
    : `Désolé... mais la bonne réponse était ${correct}.`

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
  nextButton.innerText = `Next`
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
