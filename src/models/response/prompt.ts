import type { Question, SurveyNode } from '@/models/survey'
import { isOption } from '@/models/survey'

/**
 * A Question to ask the user, along with the contextual information about that question needed to
 * display it and record its answer.
 */

export default interface Prompt {
  /** The identifier for the {@link Survey} linked to the {@link Response} this is a path for. */
  surveyID: string

  /**
   * The path within the {@link Response} tree to record the answer, once the answer is given.
   * Answer paths are arrays of numbers, each number representing an index in a {@link QuestionNode}
   * to follow. Answer paths must be complete; in other words, they must end at a leaf node.
   */
  answerPath: number[]

  /** The question to ask the user. */
  question: Question

  /** The parent nodes in the survey leading to this Question. */
  questionPath: SurveyNode[]
}

export function answerPathFromQuestionPath(questionPath: SurveyNode[]): number[] {
  const answerPath: number[] = []

  questionPath.forEach((step, index) => {
    if (isOption(step)) {
      const question = questionPath[index - 1] as Question
      const choiceIndex = question.options.findIndex(
        (option) => option.identifier === step.identifier
      )
      answerPath.push(choiceIndex)
    }
  })

  return answerPath
}
