import { defineStore } from 'pinia'
import surveyOrder from '@/data/surveyOrder'
import { cloneDeep, isNil, max, values } from 'lodash-es'
import { Flag, IncidentLevel } from '@/models/survey'
import { deserializeResponse, type SerializableResponse } from '@/models/response'
import {
  type ActionResponseNode,
  endNode,
  type QuestionResponseNode,
  walkResponseTree
} from '@/models/response/answer'

/** The object type of the root Pinia state. */
export interface QuestionnaireState {
  /** The Responses the user has started or finished, keyed by the {@link Survey.identifier}. */
  responses: Record<string, SerializableResponse>

  /** Set to true once the user has clicked the "Let's get started" button. */
  clickedContinue: boolean
}

const defaultState: QuestionnaireState = {
  responses: surveyOrder.reduce(
    (acc, key) => ({
      ...acc,
      [key]: { surveyIdentifier: key, rootNode: endNode } as SerializableResponse
    }),
    {}
  ),
  clickedContinue: false
}

const useQuestionnaireStore = defineStore('questionnaire', {
  state() {
    return cloneDeep(defaultState)
  },

  getters: {
    /** Returns a method that retrieves a response by survey identifier. */
    response: (state) => (key: string) => deserializeResponse(state.responses[key]),

    /** Returns the highest incident level based on all responses so far. */
    incidentLevel: (state) => {
      const level = max(
        values(state.responses).map(
          (response) => deserializeResponse(response).highestIncidentLevel
        )
      )
      return isNil(level) ? IncidentLevel.INCIDENT : level
    },

    /** Returns the flags that have been set for the user. */
    userFlags: (state) =>
      values(state.responses).reduce(
        (set, response) => new Set<Flag>([...set, ...deserializeResponse(response).flags]),
        new Set<Flag>()
      ),

    /** @return Returns all the 49 CFR regulations that contributed to the incident level. */
    allApplicableRegulations: (state) =>
      values(state.responses).reduce(
        (set, response) =>
          new Set<string>([...set, ...deserializeResponse(response).contributingRegulations]),
        new Set<string>()
      )
  },

  actions: {
    /**
     * Records an answer to a {@link Response} tree.
     *
     * @param surveyID The identifier for the {@link Survey} the Question belongs to.
     * @param answerPath The path to the node within the Response tree to record the answer to.
     * @param choices Which options the user chose, as an array of booleans, indexed by the
     *   {@link Option}'s index within the {@link Question.options} array.
     */
    recordAnswer(surveyID: string, answerPath: number[], choices: boolean[]) {
      const nodes: (ActionResponseNode | undefined)[] = choices.map((chosen) =>
        chosen ? { next: endNode } : undefined
      )
      const newNode: QuestionResponseNode = { nodes }

      const response = cloneDeep(this.responses[surveyID])

      if (response.rootNode !== endNode) {
        const node = walkResponseTree(response.rootNode, answerPath)
        node.next = newNode
      } else {
        response.rootNode = newNode
      }

      this.responses[surveyID] = response
    },

    /**
     * Sets the `clickedContinue` boolean. Called when the user clicks the "Let's get started"
     * button.
     */
    clickContinue() {
      this.clickedContinue = true
    }
  }
})

export default useQuestionnaireStore
