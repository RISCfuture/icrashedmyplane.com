/* eslint-disable func-names */

import { ActionContext, Module } from 'vuex'
import {
  assign, cloneDeep, isNil, max, reduce, values
} from 'lodash-es'
import Response from '@/models/response'
import { Flag, IncidentLevel } from '@/models/survey'
import { endNode, QuestionResponseNode, walkResponseTree } from '@/models/response/answer'
import surveyOrder from '@/data/surveyOrder'

/** The object type of the root Vuex state. */

export interface RootState {

  /** The Responses the user has started or finished, keyed by the {@link Survey.identifier}. */
  responses: { [key: string]: Response };

  /** Set to true once the user has clicked the "Let's get started" button. */
  clickedContinue: boolean;
}

const defaultState: RootState = {
  responses: reduce(surveyOrder, (acc, key) => ({ ...acc, [key]: new Response(key) }), {}),
  clickedContinue: false
}

export default function createRootModule(
  initialState: Partial<RootState> = {}
): Module<RootState, RootState> {
  const fullInitialState: RootState = assign({}, defaultState, initialState)
  return {
    state(): RootState {
      return fullInitialState
    },

    getters: {

      /** Returns a method that retrieves a response by survey identifier. */
      response(state: RootState): (key: string) => Response | undefined {
        return function (key: string): Response | undefined {
          return state.responses[key]
        }
      },

      /** Returns whether the user has clicked the "Let's get started" button. */
      clickedContinue(state: RootState): boolean {
        return state.clickedContinue
      },

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
      },

      /** @return Returns all the 49 CFR regulations that contributed to the incident level. */
      allApplicableRegulations(state: RootState): Set<string> {
        return values(state.responses).reduce(
          (set, response) => new Set<string>([...set, ...response.contributingRegulations]),
          new Set<string>()
        )
      }
    },

    mutations: {
      addAnswer(
        state: RootState,
        { surveyID, answerPath, newNode }:
          { surveyID: string; answerPath: number[]; newNode: QuestionResponseNode }
      ): void {
        const response = cloneDeep(state.responses[surveyID])

        if (response.rootNode !== endNode) {
          const node = walkResponseTree(response.rootNode, answerPath)
          node.next = newNode
        } else {
          response.rootNode = newNode
        }

        state.responses = assign({}, state.responses, { [surveyID]: response })
      },

      clickContinue(state: RootState): void {
        state.clickedContinue = true
      }
    },

    actions: {

      /**
       * Sets the `clickedContinue` boolean. Called when the user clicks the "Let's get started"
       * button.
       */

      clickContinue({ commit }: ActionContext<RootState, RootState>): void {
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
