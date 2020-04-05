import { isUndefined } from 'lodash-es'

/**
 * Possible incident levels for an incident.
 */

export enum IncidentLevel {

  /** An incident that qualifies as an accident under NTSB 830.2. */
  ACCIDENT = 2,

  /** An incident that qualifies as serious under NTSB 830.5 */
  SERIOUS_INCIDENT = 1,

  /** Any other incident. */
  INCIDENT = 0
}

export const HIGHEST_INCIDENT_LEVEL = IncidentLevel.ACCIDENT

/**
 * Flags that the user can set to true if they apply to the user's situation. Affects which
 * options are shown to the user.
 */

export enum Flag {

  /**
   * User was flying a multi-engine aircraft with a maximum certified takeoff weight greater than
   * 12,500 lbs.
   */
  LARGE_MULTI,

  /** User was engaged in air carrier operations per FAR 119. */
  AIR_CARRIER,

  /** User was operating a helicopter. */
  HELICOPTER
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataType = {[key: string]: any}

/**
 * A question that is asked of the user. Questions can be single-choice or multiple-choice, and
 * consist of two or more {@link Option}s that the user can choose among.
 */

export class Question {
  /** The identifier for this question. Must be unique to within the scope of the {@link Survey}. */
  identifier: string

  /** The options the user can choose from. */
  options: Option[]

  /** Whether the user can choose multiple options. */
  multi = false

  /** Additional data used when displaying the question. */
  data: DataType = {}

  constructor(
    identifier: string,
    options: Option[],
    { data, multi }: {data?: DataType; multi?: boolean} = {}
  ) {
    this.identifier = identifier
    this.options = options
    if (!isUndefined(data)) this.data = data
    if (!isUndefined(multi)) this.multi = multi
  }
}

/**
 * An option a user can choose from when answering a {@link Question}. Some options can be hidden
 * depending on the user's flags.
 *
 * Options link to {@link Action}s, which specify the next step that should be taken when the user
 * selects an option.
 */

export class Option {
  /** The identifier for the option. Must be unique to within the scope of the {@link Question}. */
  identifier: string

  /** The action to take when hte user chooses this option. */
  action: Action

  /**
   * The flag(s) that must be set to display this option. Otherwise this option is not displayed to
   * the user.
   */
  only?: Flag[] = []

  /** Additional data used when displaying the option. */
  data: DataType = {}

  constructor(
    identifier: string,
    action: Action,
    { only, data }: { only?: Flag[]; data?: DataType } = {}
  ) {
    this.identifier = identifier
    this.action = action
    if (!isUndefined(only)) this.only = only
    if (!isUndefined(data)) this.data = data
  }
}

/**
 * @abstract
 *
 * Actions represent "next steps" that occur when the user selects an option. Selecting an option
 * can lead to follow-up questions, or can result in leveling or flagging.
 */

export class Action {
  /**
   * If `true`, this action does not result in any further user interaction for this path in the
   * survey tree.
   */
  isTerminating = false
}

/**
 * If an {@link Option} is linked to a QuestionAction, the user will be asked a follow-up question
 * upon choosing that option.
 */

export class QuestionAction extends Action {
  /** The next question to ask. */
  question: Question

  constructor(question: Question) {
    super()
    this.question = question
  }
}

/**
 * If an {@link Option} is linked to a LevelAction, choosing that option will result in the incident
 * qualifying for a given {@link IncidentLevel} (at least).
 */

export class LevelAction extends Action {
  /** The level the incident now qualifies for upon choosing the {@link Option}. */
  level: IncidentLevel

  isTerminating = true

  constructor(level: IncidentLevel) {
    super()
    this.level = level
  }
}

/**
 * If an {@link Option} is linked to a FlagAction, choosing that option will apply a {@link Flag }to
 * the user.
 */

export class FlagAction extends Action {
  /** The flag to apply to the user. */
  flag: Flag

  isTerminating = true

  constructor(flag: Flag) {
    super()
    this.flag = flag
  }
}

/**
 * A Survey is a tree made up of {@link Question}s to ask the user, the available {@link Option}s
 * for each question, and the resulting {@link Action}s that occur when those options are chosen.
 * Answering Questions by choosing Options can result in further follow-up questions, or can result
 * in {@link IncidentLevel}s or {@link Flag}s being applied.
 *
 * Surveys are presented to the user in depth-first order. The {@link SurveyTraverser} class
 * traverses the survey depth-first. As the user answers questions, a {@link Response} is generated
 * for the survey.
 *
 * Surveys are stored in the `surveys` dictionary, keyed by their {@link .identifier}. The
 * `surveyOrder` object stores the order that the surveys should be presented to the user.
 */

export default class Survey {
  /** Unique identifier for the survey. */
  identifier: string

  /** The root of the survey tree; the first question asked of the user. */
  root: Question

  constructor(identifier: string, root: Question) {
    this.identifier = identifier
    this.root = root
  }
}

/** A node in a {@link Survey} tree. */
export type SurveyStep = Question | Option | Action
