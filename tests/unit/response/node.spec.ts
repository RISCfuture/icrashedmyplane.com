import { expect } from 'chai'
import { mergeAnswers } from '../support'
import {
  accidentAnswer, answerWithNestedQuestion
} from './fixtures'
import { endNode, QuestionNode, walkResponseTree } from '@/models/response/answer'

describe('walkResponseTree', () => {
  let answer: QuestionNode

  beforeEach(() => {
    answer = mergeAnswers(accidentAnswer, answerWithNestedQuestion)
  })

  it('walks the tree', () => {
    expect(walkResponseTree(answer, [10, 2, 0])).to.eql({ next: endNode })
  })

  it('throws an error given an invalid path', () => {
    expect(() => walkResponseTree(answer, [10, 2])).to.
      throw('Path ended prematurely')
    expect(() => walkResponseTree(accidentAnswer, [100])).to.
      throw('Invalid index for Question node')
    expect(() => walkResponseTree(answerWithNestedQuestion, [10, 2, 0, 1])).to.
      throw('Walked past the end of the tree')
  })
})
