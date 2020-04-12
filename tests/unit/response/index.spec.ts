import { expect } from 'chai'
import { constant, times } from 'lodash-es'
import { makeResponse, mergeAnswers } from '../support'
import {
  accidentAnswer,
  incidentAnswer,
  seriousIncidentAnswer,
  unfinishedAnswerEndingInSingleQuestion
} from './fixtures'
import Response from '@/models/response'
import { Flag, IncidentLevel, Question } from '@/models/survey'
import { AnswerNode, endNode, QuestionNode } from '@/models/response/answer'

describe('Response', () => {
  describe('isFinished', () => {
    it('returns true for a finished tree', () => {
      expect(makeResponse('incident', accidentAnswer).isFinished).to.be.true
    })

    it('returns false for an unfinished tree', () => {
      expect(makeResponse('incident', unfinishedAnswerEndingInSingleQuestion).isFinished).to.be.false
    })

    it('returns false for an unstarted survey', () => {
      expect(new Response('incident').isFinished).to.be.false
    })
  })

  describe('highestIncidentLevel', () => {
    it('returns ACCIDENT for an accident tree', () => {
      expect(makeResponse('incident', accidentAnswer).highestIncidentLevel).to.eql(IncidentLevel.ACCIDENT)
    })

    it('returns SERIOUS INCIDENT for a serious incident tree', () => {
      expect(makeResponse('incident', seriousIncidentAnswer).highestIncidentLevel).to.
        eql(IncidentLevel.SERIOUS_INCIDENT)
    })

    it('returns INCIDENT for an incident tree', () => {
      expect(makeResponse('incident', incidentAnswer).highestIncidentLevel).to.eql(IncidentLevel.INCIDENT)
    })

    it('returns null for an empty tree', () => {
      expect(new Response('incident').highestIncidentLevel).to.be.null
    })
  })

  describe('highestPossibleIncidentLevel', () => {
    let possibleAccident: QuestionNode
    let possibleSeriousIncident: QuestionNode

    beforeEach(() => {
      // injury -> death -> within 30 days?
      possibleAccident = { nodes: [{ next: endNode }] }
      // fire -> in flight?
      possibleSeriousIncident = {
        nodes: [
          ...times(12, constant(undefined)),
          { next: endNode }
        ]
      }
    })

    it('returns ACCIDENT if accident is still possible', () => {
      const answer = mergeAnswers(possibleAccident, possibleSeriousIncident)

      expect(makeResponse('incident', answer).highestPossibleIncidentLevel).to.eql(IncidentLevel.ACCIDENT)
    })

    it('returns SERIOUS INCIDENT if accident is no longer possible', () => {
      expect(makeResponse('incident', possibleSeriousIncident).highestPossibleIncidentLevel).to.
        eql(IncidentLevel.SERIOUS_INCIDENT)
    })

    it('returns INCIDENT if nothing else possible', () => {
      expect(makeResponse('incident', incidentAnswer).highestPossibleIncidentLevel).to.
        eql(IncidentLevel.INCIDENT)
    })

    it('returns ACCIDENT for an empty response', () => {
      expect(new Response('incident').highestPossibleIncidentLevel).to.eql(IncidentLevel.ACCIDENT)
    })
  })

  describe('nextQuestion', () => {
    it('returns the next Question', () => {
      const prompt = makeResponse('incident', unfinishedAnswerEndingInSingleQuestion).nextQuestion
      expect(prompt).not.to.be.null
      expect(prompt!.question).to.be.instanceOf(Question)
      expect(prompt!.answerPath).to.eql([21])
    })

    it('returns null if the response is finished', () => {
      expect(makeResponse('incident', accidentAnswer).nextQuestion).to.be.null
    })

    it('returns the next Question for each step in an answer flow', () => {
      const step1NextPath: number[] = []
      const step2: AnswerNode = { nodes: [{ next: endNode }, { next: endNode }] }
      const step2NextPath = [0]
      const step3: AnswerNode = {
        nodes: [
          { next: { nodes: [undefined, { next: endNode }] } },
          { next: endNode }
        ]
      }
      const step3NextPath = [1]
      const step4: AnswerNode = {
        nodes: [
          { next: { nodes: [undefined, { next: endNode }] } },
          { next: { nodes: [{ next: endNode }] } }
        ]
      }
      const step4NextPath = [1, 0]
      const step5: AnswerNode = {
        nodes: [
          { next: { nodes: [undefined, { next: endNode }] } },
          { next: { nodes: [undefined, { next: { nodes: [undefined, { next: endNode }] } }] } }
        ]
      }

      expect(makeResponse('incident').nextQuestion!.answerPath).to.eql(step1NextPath)
      expect(makeResponse('incident', step2).nextQuestion!.answerPath).to.eql(step2NextPath)
      expect(makeResponse('incident', step3).nextQuestion!.answerPath).to.eql(step3NextPath)
      expect(makeResponse('incident', step4).nextQuestion!.answerPath).to.eql(step4NextPath)
      expect(makeResponse('incident', step5).nextQuestion).to.be.null
    })
  })

  describe('contributingRegulations', () => {
    it('returns a list of regulations for options the user chose', () => {
      expect(makeResponse('incident', accidentAnswer).contributingRegulations).to.eql(new Set(['830.2']))
      expect(makeResponse('incident', seriousIncidentAnswer).contributingRegulations).to.eql(new Set(['830.5']))
      expect(makeResponse('incident', incidentAnswer).contributingRegulations).to.eql(new Set(['830.5']))
    })

    it('returns an empty set for an empty response tree', () => {
      expect(makeResponse('incident').contributingRegulations).to.eql(new Set<string>())
    })
  })

  describe('flags', () => {
    it('returns the list of flags that were set', () => {
      const answer: QuestionNode = { nodes: [{ next: endNode }, undefined, { next: endNode }] }
      expect(makeResponse('profile', answer).flags).to.eql(new Set([Flag.LARGE_MULTI, Flag.HELICOPTER]))
    })
  })
})
