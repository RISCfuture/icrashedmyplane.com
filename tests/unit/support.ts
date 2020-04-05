import {
  find, isArray, isNil, mergeWith, zip
} from 'lodash-es'
import { AnswerNode, endNode, QuestionNode } from '@/models/response/answer'
import Response from '@/models/response'

export function makeResponse(survey = 'incident', answer?: QuestionNode): Response {
  const response = new Response(survey)
  response.answerRoot = answer ?? endNode
  return response
}

const answerMergeFunctor = (
  b: AnswerNode | AnswerNode[] | undefined,
  a: AnswerNode | AnswerNode[] | undefined
) => {
  if (isArray(b) && isArray(a)) {
    return zip(a, b).map(pair => find(pair, e => !isNil(e)))
  }
  return isNil(b) ? a : b
}

export function mergeAnswers(...answers: QuestionNode[]): QuestionNode {
  return mergeWith({}, ...answers, answerMergeFunctor)
}
