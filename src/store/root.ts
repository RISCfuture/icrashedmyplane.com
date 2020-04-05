/* eslint-disable func-names */

import { ActionContext } from 'vuex'
import {
  assign, cloneDeep, isNil, max, reduce, values
} from 'lodash-es'
import Response from '@/models/response'
import { Flag, IncidentLevel } from '@/models/survey'
import { endNode, QuestionNode, walkResponseTree } from '@/models/response/answer'
import surveyOrder from '@/data/surveyOrder'

/** The object type of the root Vuex state. */

export interface RootState {

  /** The Responses the user has started or finished, keyed by the {@link Survey.identifier}. */
  responses: {[key: string]: Response};

  /** Set to true once the user has clicked the "Let's get started" button. */
  clickedContinue: boolean;
}

const defaultState: RootState = {
  responses: reduce(surveyOrder, (acc, key) => ({ ...acc, [key]: new Response(key) }), {}),
  clickedContinue: false
}

export default function createRootModule(initialState: Partial<RootState> = {}) {
  const fullInitialState: RootState = assign({}, defaultState, initialState)
  return {
    state(): RootState { return fullInitialState },

    getters: {

      /** Returns a method that retrieves a response by survey identifier. */
      response(state: RootState): (key: string) => Response {
        return function (key) {
          return state.responses[key]
        }
      },

      /** Returns whether the user has clicked the "Let's get started" button. */
      clickedContinue(state: RootState): boolean { return state.clickedContinue },

      /** Returns the highest incident level based on all responses so far. */
      incidentLevel(state: RootState): IncidentLevel {
        const level = max(values(state.responses).map(response => response.highestIncidentLevel))
        return isNil(level) ? IncidentLevel.INCIDENT : level
      },

      /** Returns the flags that have been set for the user. */
      userFlags(state: RootState): Set<Flag> {
        return values(state.responses).reduce(
          (set, response) => new Set<Flag>([...set, ...response.flags]),
          new Set<Flag>()
        )
      }
    },

    mutations: {
      addAnswer(
        state: RootState,
        { surveyID, answerPath, newNode }:
          {surveyID: string; answerPath: number[]; newNode: QuestionNode}
      ) {
        const response = cloneDeep(state.responses[surveyID])

        if (response.answerRoot !== endNode) {
          const node = walkResponseTree(response.answerRoot, answerPath)
          node.next = newNode
        } else {
          response.answerRoot = newNode
        }

        state.responses = assign({}, state.responses, { [surveyID]: response })
      },

      clickContinue(state: RootState) {
        state.clickedContinue = true
      }
    },

    actions: {

      /**
       * Sets the `clickedContinue` boolean. Called when the user clicks the "Let's get started"
       * button.
       */

      clickContinue({ commit }: ActionContext<RootState, RootState>) {
        commit('clickContinue')
      },

      /**
       * Records an answer to a {@link Response} tree.
       *
       * @param surveyID The identifier for the {@link Survey} the Question belongs to.
       * @param answerPath The path to the node within the Response tree to record the answer to.
       * @param choices Which options the user chose, as an array of booleans, indexed by the
       * {@link Option}'s index within the {@link Question.options} array.
       * @return A promise that resolves once the action is complete.
       */

      recordAnswer(
        { commit }: ActionContext<RootState, RootState>,
        { surveyID, answerPath, choices }: {
          surveyID: string;
          answerPath: number[];
          choices: boolean[];
        }
      ): Promise<void> {
        try {
          const nodes = choices.map(chosen => (chosen ? { next: endNode } : undefined))
          commit('addAnswer', { surveyID, answerPath, newNode: { nodes } })
        } catch (error) {
          return Promise.reject(error)
        }
        return Promise.resolve()
      }
    }
  }
}
