import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { expect } from 'chai'
import { constant, times } from 'lodash-es'
import { makeResponse, mergeAnswers } from '../support'
import {
  accidentAnswer,
  unfinishedAnswerEndingInMultiQuestion
} from '../response/fixtures'
import createRootModule from '@/store/root'
import { endNode } from '@/models/response/answer'

Vue.use(Vuex)

describe('Vuex store', () => {
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

        expect(store.state.responses.incident.answerRoot).to.eql({
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
        } catch (e) {
          expect(e.message).to.eql('Path ended prematurely')
        }
      })
    })
  })
})
