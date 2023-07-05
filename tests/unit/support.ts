import {
  find, isArray, isNil, mergeWith, zip
} from 'lodash-es'
import { ResponseNode, endNode, QuestionResponseNode } from '@/models/response/answer'
import Response from '@/models/response'

export function makeResponse(survey: string, answer?: QuestionResponseNode): Response {
  const response = new Response(survey)
  response.rootNode = answer ?? endNode
  return response
}

const answerMergeFunctor = (
  b: ResponseNode | ResponseNode[] | undefined,
  a: ResponseNode | ResponseNode[] | undefined
) => {
  if (isArray(b) && isArray(a)) {
    return zip(a, b).map(pair => find(pair, e => !isNil(e)))
  }
  return isNil(b) ? a : b
}

export function mergeAnswers(...answers: QuestionResponseNode[]): QuestionResponseNode {
  return mergeWith({}, ...answers, answerMergeFunctor) as QuestionResponseNode
}
