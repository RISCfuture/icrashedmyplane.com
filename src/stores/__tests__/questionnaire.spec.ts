import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import useQuestionnaireStore from '../questionnaire'
import { makeResponse } from '@cypress/support/answerUtils'
import {
  accidentAnswer,
  seriousIncidentAnswer,
  unfinishedAnswerEndingInMultiQuestion
} from '@cypress/fixtures/answers'
import { mergeAnswers } from '@cypress/support/answerUtils'
import { endNode } from '@/models/response/answer'
import { cloneDeep, constant, times } from 'lodash-es'

describe('Questionnaire store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('allApplicableRegulations', () => {
    it('returns the complete list of regulations that apply to the user', () => {
      const store = useQuestionnaireStore()
      store.$reset()

      store.$patch({ responses: { incident: makeResponse('incident', cloneDeep(accidentAnswer)) } })
      expect(store.allApplicableRegulations).to.eql(new Set(['830.2']))

      store.$patch({
        responses: {
          incident: makeResponse(
            'incident',
            mergeAnswers(accidentAnswer, cloneDeep(seriousIncidentAnswer))
          )
        }
      })
      expect(store.allApplicableRegulations).to.eql(new Set(['830.2', '830.5']))

      store.$patch({
        responses: { incident: makeResponse('incident', cloneDeep(seriousIncidentAnswer)) }
      })
      expect(store.allApplicableRegulations).to.eql(new Set(['830.5']))
    })
  })

  describe('recordAnswer', () => {
    it('adds the choices and new unfinished answers to the state', async () => {
      const store = useQuestionnaireStore()
      store.$reset()

      store.$patch({
        responses: {
          incident: makeResponse(
            'incident',
            mergeAnswers(accidentAnswer, unfinishedAnswerEndingInMultiQuestion)
          )
        }
      })

      store.recordAnswer('incident', [10], [false, true, true])

      expect(store.responses.incident.rootNode).to.eql({
        nodes: [
          { next: { nodes: [{ next: endNode }] } },
          ...times(9, constant(undefined)),
          {
            next: {
              nodes: [undefined, { next: endNode }, { next: endNode }]
            }
          }
        ]
      })
    })

    it('raises an error if the options have been selected', async () => {
      const store = useQuestionnaireStore()
      store.$reset()

      store.$patch({
        responses: {
          incident: makeResponse(
            'incident',
            mergeAnswers(accidentAnswer, {
              nodes: [
                ...times(10, constant(undefined)),
                { next: { nodes: [undefined, undefined, undefined] } }
              ]
            })
          )
        }
      })

      try {
        store.recordAnswer('incident', [10], [false, true, true])
        expect.fail() // should have thrown an error by now
      } catch (e: unknown) {
        expect((e as Error).message).to.eql('Path ended prematurely')
      }
    })
  })
})
