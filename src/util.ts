export function selectQuestion(remainings: Array<QuestionModel>): number {
  if (remainings.length === 0) {
    throw Error("Not able to select a question in an empty array");
  }
  const index = Math.floor(Math.random() * remainings.length);
  remainings.splice(index, 1);
  return index;
}
