import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { expect } from 'chai'
import { constant, times } from 'lodash-es'
import { makeResponse, mergeAnswers } from '../support'
import { accidentAnswer, seriousIncidentAnswer, unfinishedAnswerEndingInMultiQuestion } from '../response/fixtures'
import createRootModule from '@/store/root'
import { endNode } from '@/models/response/answer'

Vue.use(Vuex)

describe('Vuex store', () => {
  describe('getters', () => {
    describe('allApplicableRegulations', () => {
      it('returns the complete list of regulations that apply to the user', () => {
        let store = new Store(createRootModule({
          responses: { incident: makeResponse('incident', accidentAnswer) }
        }))
        expect(store.getters.allApplicableRegulations).to.eql(new Set(['830.2']))

        store = new Store(createRootModule({
          responses: {
            incident: makeResponse('incident', mergeAnswers(accidentAnswer, seriousIncidentAnswer))
          }
        }))
        expect(store.getters.allApplicableRegulations).to.eql(new Set(['830.2', '830.5']))

        store = new Store(createRootModule({
          responses: { incident: makeResponse('incident', seriousIncidentAnswer) }
        }))
        expect(store.getters.allApplicableRegulations).to.eql(new Set(['830.5']))
      })

      it('returns an empty set for an empty store', () => {
        const store = new Store(createRootModule())
        expect(store.getters.allApplicableRegulations).to.eql(new Set([]))
      })
    })
  })

  describe('actions', () => {
    describe('recordAnswer', () => {
      it('adds the choices and new unfinished answers to the state', async () => {
        const store = new Store(createRootModule({
          responses: {
            incident: makeResponse('incident', mergeAnswers(
              accidentAnswer,
              unfinishedAnswerEndingInMultiQuestion
            ))
          }
        }))

        await store.dispatch('recordAnswer', {
          surveyID: 'incident',
          answerPath: [10],
          choices: [false, true, true]
        })

        expect(store.state.responses.incident.rootNode).to.eql({
          nodes: [
            { next: { nodes: [{ next: endNode }] } },
            ...times(9, constant(undefined)),
            {
              next: {
                nodes: [
                  undefined,
                  { next: endNode },
                  { next: endNode }
                ]
              }
            }
          ]
        })
      })

      it('raises an error if the options have been selected', async () => {
        const store = new Store(createRootModule({
          responses: {
            incident: makeResponse('incident', mergeAnswers(
              accidentAnswer,
              {
                nodes: [
                  ...times(10, constant(undefined)),
                  { next: { nodes: [undefined, undefined, undefined] } }
                ]
              }
            ))
          }
        }))

        try {
          await store.dispatch('recordAnswer', {
            surveyID: 'incident',
            answerPath: [10],
            choices: [false, true, true]
          })
          expect.fail() // should have thrown an error by now
        } catch (e: unknown) {
          expect((<Error>e).message).to.eql('Path ended prematurely')
        }
      })
    })
  })
})
