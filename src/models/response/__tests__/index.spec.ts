import { beforeEach, describe, expect, it } from 'vitest'
import { constant, times } from 'lodash-es'
import { makeResponse, mergeAnswers } from '@cypress/support/answerUtils'
import {
  accidentAnswer,
  incidentAnswer,
  seriousIncidentAnswer,
  unfinishedAnswerEndingInSingleQuestion
} from '@cypress/fixtures/answers'
import { Flag, IncidentLevel, isQuestion } from '@/models/survey'
import { endNode, type QuestionResponseNode, type ResponseNode } from '../answer'
import { Response } from '../index'

describe('Response', () => {
  describe('isFinished', () => {
    it('returns true for a finished tree', () => {
      expect(makeResponse('incident', accidentAnswer).isFinished).toEqual(true)
    })

    it('returns false for an unfinished tree', () => {
      expect(makeResponse('incident', unfinishedAnswerEndingInSingleQuestion).isFinished).toEqual(
        false
      )
    })

    it('returns false for an unstarted survey', () => {
      expect(new Response('incident').isFinished).toEqual(false)
    })
  })

  describe('highestIncidentLevel', () => {
    it('returns ACCIDENT for an accident tree', () => {
      expect(makeResponse('incident', accidentAnswer).highestIncidentLevel).toEqual(
        IncidentLevel.ACCIDENT
      )
    })

    it('returns SERIOUS INCIDENT for a serious incident tree', () => {
      expect(makeResponse('incident', seriousIncidentAnswer).highestIncidentLevel).toEqual(
        IncidentLevel.SERIOUS_INCIDENT
      )
    })

    it('returns INCIDENT for an incident tree', () => {
      expect(makeResponse('incident', incidentAnswer).highestIncidentLevel).toEqual(
        IncidentLevel.INCIDENT
      )
    })

    it('returns null for an empty tree', () => {
      expect(new Response('incident').highestIncidentLevel).toBeNull()
    })
  })

  describe('highestPossibleIncidentLevel', () => {
    let possibleAccident: QuestionResponseNode
    let possibleSeriousIncident: QuestionResponseNode

    beforeEach(() => {
      // injury -> death -> within 30 days?
      possibleAccident = { nodes: [{ next: endNode }] }
      // fire -> in flight?
      possibleSeriousIncident = {
        nodes: [...times(12, constant(undefined)), { next: endNode }]
      }
    })

    it('returns ACCIDENT if accident is still possible', () => {
      const answer = mergeAnswers(possibleAccident, possibleSeriousIncident)

      expect(makeResponse('incident', answer).highestPossibleIncidentLevel).toEqual(
        IncidentLevel.ACCIDENT
      )
    })

    it('returns SERIOUS INCIDENT if accident is no longer possible', () => {
      expect(
        makeResponse('incident', possibleSeriousIncident).highestPossibleIncidentLevel
      ).toEqual(IncidentLevel.SERIOUS_INCIDENT)
    })

    it('returns INCIDENT if nothing else possible', () => {
      expect(makeResponse('incident', incidentAnswer).highestPossibleIncidentLevel).toEqual(
        IncidentLevel.INCIDENT
      )
    })

    it('returns ACCIDENT for an empty response', () => {
      expect(new Response('incident').highestPossibleIncidentLevel).toEqual(IncidentLevel.ACCIDENT)
    })
  })

  describe('nextQuestion', () => {
    it('returns the next Question', () => {
      const prompt = makeResponse('incident', unfinishedAnswerEndingInSingleQuestion).nextQuestion
      expect(prompt).not.toBeNull()
      expect(isQuestion(prompt!.question)).toEqual(true)
      expect(prompt!.answerPath).toEqual([21])
    })

    it('returns null if the response is finished', () => {
      expect(makeResponse('incident', accidentAnswer).nextQuestion).toBeNull()
    })

    it('returns the next Question for each step in an answer flow', () => {
      const step1NextPath: number[] = []
      const step2: ResponseNode = { nodes: [{ next: endNode }, { next: endNode }] }
      const step2NextPath = [0]
      const step3: ResponseNode = {
        nodes: [{ next: { nodes: [undefined, { next: endNode }] } }, { next: endNode }]
      }
      const step3NextPath = [1]
      const step4: ResponseNode = {
        nodes: [
          { next: { nodes: [undefined, { next: endNode }] } },
          { next: { nodes: [{ next: endNode }] } }
        ]
      }
      const step4NextPath = [1, 0]
      const step5: ResponseNode = {
        nodes: [
          { next: { nodes: [undefined, { next: endNode }] } },
          { next: { nodes: [undefined, { next: { nodes: [undefined, { next: endNode }] } }] } }
        ]
      }

      expect(makeResponse('incident').nextQuestion!.answerPath).toEqual(step1NextPath)
      expect(makeResponse('incident', step2).nextQuestion!.answerPath).toEqual(step2NextPath)
      expect(makeResponse('incident', step3).nextQuestion!.answerPath).toEqual(step3NextPath)
      expect(makeResponse('incident', step4).nextQuestion!.answerPath).toEqual(step4NextPath)
      expect(makeResponse('incident', step5).nextQuestion).toBeNull()
    })
  })

  describe('contributingRegulations', () => {
    it('returns a list of regulations for options the user chose', () => {
      expect(makeResponse('incident', accidentAnswer).contributingRegulations).toEqual(
        new Set(['830.2'])
      )
      expect(makeResponse('incident', seriousIncidentAnswer).contributingRegulations).toEqual(
        new Set(['830.5'])
      )
      expect(makeResponse('incident', incidentAnswer).contributingRegulations).toEqual(
        new Set(['830.5'])
      )
    })

    it('returns an empty set for an empty response tree', () => {
      expect(makeResponse('incident').contributingRegulations).toEqual(new Set<string>())
    })
  })

  describe('flags', () => {
    it('returns the list of flags that were set', () => {
      const answer: QuestionResponseNode = {
        nodes: [{ next: endNode }, undefined, { next: endNode }]
      }
      expect(makeResponse('profile', answer).flags).toEqual(
        new Set([Flag.LARGE_MULTI, Flag.HELICOPTER])
      )
    })
  })
})
