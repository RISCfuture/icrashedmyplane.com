/* eslint-disable import/no-cycle */

import {
  isArray, isNull, isUndefined
} from 'lodash-es'
import Survey, {
  Flag, FlagAction,
  HIGHEST_INCIDENT_LEVEL,
  IncidentLevel, LevelAction, Question, SurveyStep
} from '@/models/survey'
import surveys from '@/data/surveys'
import {
  EndNode,
  endNode,
  QuestionNode
} from '@/models/response/answer'
import Prompt, { answerPathFromQuestionPath } from '@/models/response/prompt'
import ResponseTraverser, { beyondEndNode } from '@/models/response/traverser'

/**
 * A Response contains a tree representing all of the answers the user has given so far to a
 * {@link Survey}. Answers are stored as a tree of {@link QuestionNode}s joined together by
 * {@link ActionNode}s. Each time the user answers a {@link Question}, a QuestionNode is added to
 * the tree. The QuestionNode contains an array of ActionNodes, one of each {@link Option} the user
 * chose for that question. The ActionNodes link to QuestionNodes for follow-on questions, or to
 * {@link .endNode} at the end of a line of questions.
 *
 * Responses are finished if every question is answered (excluding questions that are not asked
 * because they are outside of the response tree). A response is "effectively finished" when there
 * is no future question that can be asked that would change the final incident level.
 *
 * Response trees can be traversed simultaneously with the corresponding Survey tree using
 * {@link ResponseTraverser}. Responses must always be traversed depth-first, as that is the order
 * used when the user is presented the survey.
 */

export default class Response {
  /** The identifier for the corresponding {@link Survey} this is a response to. */
  surveyIdentifier: string

  /**
   * The root node for the response tree. An unstarted response has {@link .endNode} as its root
   * node.
   */

  answerRoot: QuestionNode | EndNode = endNode

  /**
   * Creates a new Response for a Survey.
   * @param surveyID The identifier for the {@link Survey}.
   */

  constructor(surveyID: string) {
    this.surveyIdentifier = surveyID
  }

  /** @return The corresponding Survey. */
  get survey(): Survey {
    return surveys[this.surveyIdentifier]
  }

  /** @return Whether the user has answered at least one question in this Response. */
  get isStarted(): boolean {
    return this.answerRoot !== endNode
  }

  /**
   * @return Whether the user has answered all the questions in the Survey (excluding questions that
   * were not asked because they are outside of the response tree).
   */

  get isFinished(): boolean {
    if (!this.isStarted) return false

    let finished = true

    new ResponseTraverser(this).traverse({
      visitAction(action, node) {
        // if node is beyondEndNode, that means we are beyond the end of a path in the answer tree,
        // which means this is an action that the user still COULD hit
        if (node === beyondEndNode && action.isTerminating) {
          finished = false
          return false
        }

        return true
      }
    })

    return finished
  }

  /**
   * @return The highest incident level assigned by a {@link LevelAction} from a question the user
   * has already answered. In other words, the highest incident level this Response has qualified
   * for based on the questions answered.
   */

  get highestIncidentLevel(): IncidentLevel | null {
    let currentHighestLevel: IncidentLevel | null = null

    new ResponseTraverser(this).traverse({
      visitAction(action, node) {
        if (node === endNode && action instanceof LevelAction) {
          // found a level action the user did hit; update current highest level
          if (isNull(currentHighestLevel)) currentHighestLevel = action.level
          if (currentHighestLevel < action.level) currentHighestLevel = action.level
          // if we are already at the highest possible level, no need to keep traversing
          return currentHighestLevel < HIGHEST_INCIDENT_LEVEL
        }

        return true
      }
    })

    return currentHighestLevel
  }

  /**
   * @return The highest incident level assigned by a {@link LevelAction} from a question the user
   * can still answer. In other words, the highest incident level this Response could qualify
   * for based on the questions that haven't been asked yet but could still be asked.
   */

  get highestPossibleIncidentLevel(): IncidentLevel {
    let currentHighestLevel = IncidentLevel.INCIDENT

    new ResponseTraverser(this).traverse({
      visitAction(action, node) {
        if (node === beyondEndNode) {
          // this is a potential path the user could still visit

          if (action instanceof LevelAction) {
            // found a level action the user could hit; update current highest possible level
            if (isNull(currentHighestLevel)) currentHighestLevel = action.level
            if (currentHighestLevel < action.level) currentHighestLevel = action.level
            // if we are already at the highest possible level, no need to keep traversing
            return currentHighestLevel < HIGHEST_INCIDENT_LEVEL
          }

          return true
        }

        return true
      }
    })

    return currentHighestLevel
  }

  /**
   * @return `true` if it's not possible for any future question to raise the incident level higher
   * than {@link .highestIncidentLevel}.
   */

  get isEffectivelyFinished(): boolean {
    return this.isFinished
      || (!isNull(this.highestIncidentLevel)
        && this.highestIncidentLevel >= this.highestPossibleIncidentLevel)
  }

  /**
   * @return Information about the next {@link Question} to ask the user, or `null` if the response
   * is finished.
   */

  get nextQuestion(): Prompt | null {
    let questionPath: SurveyStep[] | null = null

    new ResponseTraverser(this).traverse({
      visitQuestion(question, node): boolean {
        // this is a path the user didn't go down, skip it
        if (isUndefined(node)) return true

        if (node === beyondEndNode) {
          // this is a path the user hasn't gone down yet, and the first unanswered Question we've
          // encountered -- start the questionPath and stop traversing
          questionPath = []
          return false
        }

        // this is a Question the user has already answered; keep traversing
        return true
      },

      /* The methods above change questionPath from null to an empty array once the next prompt has
      been found. As the stack unrolls, these `around...` methods push their objects onto the front
      of the questionPath, thus building backwards the path leading up to the next prompt. */

      aroundVisitOption(option, index, node, run) {
        if (!run()) {
          if (isArray(questionPath)) questionPath.unshift(option)
        }
      },

      aroundVisitQuestion(question, node, run) {
        if (!run()) {
          if (isArray(questionPath)) questionPath.unshift(question)
        }
      },

      aroundVisitAction(action, node, run) {
        if (!run()) {
          if (isArray(questionPath)) questionPath.unshift(action)
        }
      }
    })

    if (!questionPath) return null

    return {
      question: <Question>(<SurveyStep[]>questionPath).pop(),
      questionPath,
      surveyID: this.surveyIdentifier,
      answerPath: answerPathFromQuestionPath(questionPath)
    }
  }

  /**
   * @return The set of flags that were set to true by {@link FlagAction}s linked to options the
   * user chose. In other words, the flags that are true based on the user's responses.
   */

  get flags(): Set<Flag> {
    const flags = new Set<Flag>()

    new ResponseTraverser(this).traverse({
      visitAction(action, node) {
        if (!(action instanceof FlagAction)) return true
        if (node !== endNode) return true // user didn't visit this action
        flags.add(action.flag)
        return true
      }
    })

    return flags
  }
}
