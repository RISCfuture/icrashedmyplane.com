import { constant, times } from 'lodash-es'
import { endNode, QuestionResponseNode } from '@/models/response/answer'

// injury -> death -> within 30 days
export const accidentAnswer: Readonly<QuestionResponseNode> = {
  nodes: [{
    next: { nodes: [{ next: endNode }] }
  }]
}

// default -> evacuation -> escape slides used
export const seriousIncidentAnswer: Readonly<QuestionResponseNode> = {
  nodes: [
    ...times(21, constant(undefined)),
    { next: { nodes: [{ next: endNode }] } }
  ]
}

// default -> evacuation -> escape slides not used
export const incidentAnswer: Readonly<QuestionResponseNode> = {
  nodes: [
    ...times(21, constant(undefined)),
    { next: { nodes: [undefined, { next: endNode }] } }
  ]
}

// default -> evacuation -> escape slides used?
export const unfinishedAnswerEndingInSingleQuestion: Readonly<QuestionResponseNode> = {
  nodes: [
    ...times(21, constant(undefined)),
    { next: endNode }
  ]
}

// aircraft -> major damage
export const unfinishedAnswerEndingInMultiQuestion: Readonly<QuestionResponseNode> = {
  nodes: [
    ...times(10, constant(undefined)),
    { next: endNode }
  ]
}

// aircraft -> major damage -> skinHoles -> small
export const answerWithNestedQuestion: Readonly<QuestionResponseNode> = {
  nodes: [
    ...times(10, constant(undefined)),
    {
      next: {
        nodes: [
          ...times(2, constant(undefined)),
          {
            next: { nodes: [{ next: endNode }] }
          }
        ]
      }
    }
  ]
}
