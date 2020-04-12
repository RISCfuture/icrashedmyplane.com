import {
  classifyAsAccident, classifyAsSeriousIncident, noAskQuestion, noMeansIncident, noMeansAccident,
  noMeansAccidentYesMeansIncident, noMeansSeriousIncidentYesMeansIncident, yesAskQuestion,
  yesMeansIncident, yesMeansAccidentNoMeansIncident, yesMeansSeriousIncidentNoMeansIncident,
  classifyAsIncident
} from '@/data/surveys/incidentSurveyShorthand'
import Survey, {
  Flag, Option, Question, QuestionAction
} from '@/models/survey'

const incidentSurvey = new Survey('incident',
  new Question('root', [
    new Option('death',
      new QuestionAction(
        new Question('within30Days',
          yesMeansAccidentNoMeansIncident,
          { data: { regulation: '830.2' } })
      ),
      { data: { category: 'injuries' } }),
    new Option('hospitalization',
      new QuestionAction(
        new Question('within7Days', [
          yesAskQuestion(new Question('twoDaysOrLonger',
            yesMeansAccidentNoMeansIncident,
            { data: { regulation: '830.2' } })),
          noMeansIncident],
        { data: { regulation: '830.2' } })
      ),
      { data: { category: 'injuries' } }),
    new Option('brokenBone',
      new QuestionAction(
        new Question('fingerToeNose', [
          yesAskQuestion(new Question('simpleFracture',
            noMeansAccidentYesMeansIncident,
            { data: { regulation: '830.2' } })),
          noMeansAccident],
        { data: { regulation: '830.2' } })
      ),
      { data: { category: 'injuries' } }),
    new Option('hemmorhage',
      new QuestionAction(
        new Question('severe',
          yesMeansAccidentNoMeansIncident,
          { data: { regulation: '830.2' } })
      ),
      { data: { category: 'injuries' } }),
    new Option('nerveDamage', classifyAsAccident, { data: { category: 'injuries' } }),
    new Option('muscleDamage', classifyAsAccident, { data: { category: 'injuries' } }),
    new Option('tendonDamage', classifyAsAccident, { data: { category: 'injuries' } }),
    new Option('internalOrganDamage', classifyAsAccident, { data: { category: 'injuries' } }),
    new Option('burns',
      new QuestionAction(
        new Question('degree', [
          new Option('burnDegree.thirdDegree', classifyAsAccident),
          new Option('burnDegree.secondDegree', classifyAsAccident),
          new Option('burnDegree.firstDegree',
            new QuestionAction(
              new Question('over5Percent',
                yesMeansAccidentNoMeansIncident,
                { data: { regulation: '830.2' } })
            ))],
        { data: { regulation: '830.2' } })
      ),
      { data: { category: 'injuries' } }),
    new Option('illness',
      new QuestionAction(
        new Question('requiredCrewmember', [
          yesAskQuestion(new Question('performNormalDuties',
            noMeansSeriousIncidentYesMeansIncident,
            { data: { regulation: '830.5' } })),
          noMeansIncident],
        { data: { regulation: '830.5' } })
      )),

    new Option('majorDamage', new QuestionAction(
      new Question('aircraftMajorDamage', [
        new Option('engineDamage',
          new QuestionAction(
            new Question('moreThan1EngineDamaged',
              yesMeansAccidentNoMeansIncident,
              { data: { regulation: '830.2' } })
          )),
        new Option('bentFairings', classifyAsIncident),
        new Option('dentedSkin', classifyAsIncident),
        new Option('skinHoles',
          new QuestionAction(
            new Question('smallHoles',
              noMeansAccidentYesMeansIncident,
              { data: { regulation: '830.2' } })
          )),
        new Option('rotorOrPropeller',
          new QuestionAction(
            new Question('groundContactDamage',
              noMeansAccidentYesMeansIncident,
              { data: { regulation: '830.2' } })
          )),
        new Option('landingGear', classifyAsIncident),
        new Option('flaps', classifyAsIncident),
        new Option('engineAccessories', classifyAsIncident),
        new Option('wingtips', classifyAsIncident),
        new Option('other',
          new QuestionAction(
            new Question('majorRepair',
              yesMeansAccidentNoMeansIncident,
              { data: { regulation: '830.2' } })
          ))
      ],
      { multi: true })
    ),
    { data: { category: 'aircraft', subtitle: 'majorDamage' } }),
    new Option('engineDamage',
      new QuestionAction(
        new Question('turbine',
          [
            yesAskQuestion(new Question('contained',
              noMeansSeriousIncidentYesMeansIncident,
              { data: { regulation: '830.5' } })),
            noMeansIncident
          ],
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'aircraft' } }),
    new Option('fire',
      new QuestionAction(
        new Question('inFlightFire',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'aircraft' } }),
    new Option('propeller',
      new QuestionAction(
        new Question('groundContactRelease',
          noMeansSeriousIncidentYesMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'aircraft' } }),
    new Option('rotorBlades',
      new QuestionAction(
        new Question('major',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'aircraft' }, only: [Flag.HELICOPTER] }),

    new Option('flightControls', classifyAsSeriousIncident, { data: { category: 'failure' } }),
    new Option('lossOfThrust',
      new QuestionAction(
        new Question('moreThan1EngineThrustLoss',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'failure', only: [Flag.LARGE_MULTI] } }),
    new Option('electrical',
      new QuestionAction(
        new Question('electricContinuous',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5', notes: ['backupPowerSource'] } })
      ),
      { data: { category: 'failure' }, only: [Flag.LARGE_MULTI] }),
    new Option('hydraulic',
      new QuestionAction(
        new Question('hydraulicContinuous',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'failure' }, only: [Flag.LARGE_MULTI] }),
    new Option('displays',
      new QuestionAction(
        new Question('moreThanHalf',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5', notes: ['displaysDefinition'] } })
      ),
      { data: { category: 'failure' } }),

    new Option('propertyDamage',
      new QuestionAction(
        new Question('lessThan25Grand', [
          yesMeansIncident,
          noAskQuestion(new Question('fmvLessThan25Grand',
            noMeansSeriousIncidentYesMeansIncident,
            { data: { regulation: '830.5' } }))
        ],
        { data: { regulation: '830.5', notes: ['materialsAndLabor'] } })
      ), { data: { subtitle: 'propertyDamage' } }),
    new Option('evacuation',
      new QuestionAction(
        new Question('escapeSlidesUsed',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { only: [Flag.LARGE_MULTI] }),

    new Option('collision',
      new QuestionAction(
        new Question('inFlightCollision',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'traffic' } }),
    new Option('TCASRA',
      new QuestionAction(
        new Question('ifr', [
          yesAskQuestion(new Question('complianceNecessary',
            yesMeansSeriousIncidentNoMeansIncident,
            { data: { regulation: '830.15' } })),
          noMeansIncident
        ],
        { data: { regulation: '830.15' } })
      ),
      { data: { category: 'traffic' } }),

    new Option('wrongRunway',
      new QuestionAction(
        new Question('publicAirport',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'surface' }, only: [Flag.AIR_CARRIER] }),
    new Option('taxiway',
      new QuestionAction(
        new Question('publicAirport',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'surface', subtitle: 'taxiway' }, only: [Flag.AIR_CARRIER] }),
    new Option('runwayIncursion',
      new QuestionAction(
        new Question('publicAirport',
          yesMeansSeriousIncidentNoMeansIncident,
          { data: { regulation: '830.5' } })
      ),
      { data: { category: 'surface' }, only: [Flag.AIR_CARRIER] })
  ],
  { multi: true }))

export default incidentSurvey
