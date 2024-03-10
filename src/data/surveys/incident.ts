import {
  classifyAsAccident,
  classifyAsIncident,
  classifyAsSeriousIncident,
  noAskQuestion,
  noMeansAccident,
  noMeansAccidentYesMeansIncident,
  noMeansIncident,
  noMeansSeriousIncidentYesMeansIncident,
  yesAskQuestion,
  yesMeansAccidentNoMeansIncident,
  yesMeansIncident,
  yesMeansSeriousIncidentNoMeansIncident
} from '@/data/surveys/incidentSurveyShorthand'
import type { Survey } from '@/models/survey'
import { Flag, makeOption, makeQuestion, makeQuestionAction } from '@/models/survey'

const incidentSurvey: Survey = {
  identifier: 'incident',
  root: makeQuestion(
    'root',
    [
      makeOption(
        'death',
        makeQuestionAction(
          makeQuestion('within30Days', yesMeansAccidentNoMeansIncident, {
            data: { regulation: '830.2' }
          })
        ),
        { data: { category: 'injuries' } }
      ),
      makeOption(
        'hospitalization',
        makeQuestionAction(
          makeQuestion(
            'within7Days',
            [
              yesAskQuestion(
                makeQuestion('twoDaysOrLonger', yesMeansAccidentNoMeansIncident, {
                  data: { regulation: '830.2' }
                })
              ),
              noMeansIncident
            ],
            { data: { regulation: '830.2' } }
          )
        ),
        { data: { category: 'injuries' } }
      ),
      makeOption(
        'brokenBone',
        makeQuestionAction(
          makeQuestion(
            'fingerToeNose',
            [
              yesAskQuestion(
                makeQuestion('simpleFracture', noMeansAccidentYesMeansIncident, {
                  data: { regulation: '830.2' }
                })
              ),
              noMeansAccident
            ],
            { data: { regulation: '830.2' } }
          )
        ),
        { data: { category: 'injuries', regulation: '830.2' } }
      ),
      makeOption(
        'hemorrhage',
        makeQuestionAction(
          makeQuestion('severe', yesMeansAccidentNoMeansIncident, { data: { regulation: '830.2' } })
        ),
        { data: { category: 'injuries' } }
      ),
      makeOption('nerveDamage', classifyAsAccident, {
        data: { category: 'injuries', regulation: '830.2' }
      }),
      makeOption('muscleDamage', classifyAsAccident, {
        data: { category: 'injuries', regulation: '830.2' }
      }),
      makeOption('tendonDamage', classifyAsAccident, {
        data: { category: 'injuries', regulation: '830.2' }
      }),
      makeOption('internalOrganDamage', classifyAsAccident, {
        data: { category: 'injuries', regulation: '830.2' }
      }),
      makeOption(
        'burns',
        makeQuestionAction(
          makeQuestion(
            'degree',
            [
              makeOption('burnDegree.thirdDegree', classifyAsAccident, {
                data: { regulation: '830.2' }
              }),
              makeOption('burnDegree.secondDegree', classifyAsAccident, {
                data: { regulation: '830.2' }
              }),
              makeOption(
                'burnDegree.firstDegree',
                makeQuestionAction(
                  makeQuestion('over5Percent', yesMeansAccidentNoMeansIncident, {
                    data: { regulation: '830.2' }
                  })
                )
              )
            ],
            { data: { regulation: '830.2' } }
          )
        ),
        { data: { category: 'injuries' } }
      ),
      makeOption(
        'illness',
        makeQuestionAction(
          makeQuestion(
            'requiredCrewmember',
            [
              yesAskQuestion(
                makeQuestion('performNormalDuties', noMeansSeriousIncidentYesMeansIncident, {
                  data: { regulation: '830.5' }
                })
              ),
              noMeansIncident
            ],
            { data: { regulation: '830.5' } }
          )
        )
      ),

      makeOption(
        'majorDamage',
        makeQuestionAction(
          makeQuestion(
            'aircraftMajorDamage',
            [
              makeOption(
                'engineDamage',
                makeQuestionAction(
                  makeQuestion('moreThan1EngineDamaged', yesMeansAccidentNoMeansIncident, {
                    data: { regulation: '830.2' }
                  })
                )
              ),
              makeOption('bentFairings', classifyAsIncident),
              makeOption('dentedSkin', classifyAsIncident),
              makeOption(
                'skinHoles',
                makeQuestionAction(
                  makeQuestion('smallHoles', noMeansAccidentYesMeansIncident, {
                    data: { regulation: '830.2' }
                  })
                )
              ),
              makeOption(
                'rotorOrPropeller',
                makeQuestionAction(
                  makeQuestion('groundContactDamage', noMeansAccidentYesMeansIncident, {
                    data: { regulation: '830.2' }
                  })
                )
              ),
              makeOption('landingGear', classifyAsIncident),
              makeOption('flaps', classifyAsIncident),
              makeOption('engineAccessories', classifyAsIncident),
              makeOption('wingtips', classifyAsIncident),
              makeOption(
                'other',
                makeQuestionAction(
                  makeQuestion('majorRepair', yesMeansAccidentNoMeansIncident, {
                    data: { regulation: '830.2' }
                  })
                )
              )
            ],
            { multi: true }
          )
        ),
        { data: { category: 'aircraft', subtitle: 'majorDamage' } }
      ),
      makeOption(
        'engineDamage',
        makeQuestionAction(
          makeQuestion(
            'turbine',
            [
              yesAskQuestion(
                makeQuestion('contained', noMeansSeriousIncidentYesMeansIncident, {
                  data: { regulation: '830.5' }
                })
              ),
              noMeansIncident
            ],
            { data: { regulation: '830.5' } }
          )
        ),
        { data: { category: 'aircraft' } }
      ),
      makeOption(
        'fire',
        makeQuestionAction(
          makeQuestion('inFlightFire', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'aircraft' } }
      ),
      makeOption(
        'propeller',
        makeQuestionAction(
          makeQuestion('groundContactRelease', noMeansSeriousIncidentYesMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'aircraft' } }
      ),
      makeOption(
        'rotorBlades',
        makeQuestionAction(
          makeQuestion('major', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'aircraft' }, only: [Flag.HELICOPTER] }
      ),

      makeOption('flightControls', classifyAsSeriousIncident, {
        data: { category: 'failure', regulation: '830.5' }
      }),
      makeOption(
        'lossOfThrust',
        makeQuestionAction(
          makeQuestion('moreThan1EngineThrustLoss', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'failure', only: [Flag.LARGE_MULTI] } }
      ),
      makeOption(
        'electrical',
        makeQuestionAction(
          makeQuestion('electricContinuous', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5', notes: ['backupPowerSource'] }
          })
        ),
        { data: { category: 'failure' }, only: [Flag.LARGE_MULTI] }
      ),
      makeOption(
        'hydraulic',
        makeQuestionAction(
          makeQuestion('hydraulicContinuous', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'failure' }, only: [Flag.LARGE_MULTI] }
      ),
      makeOption(
        'displays',
        makeQuestionAction(
          makeQuestion('moreThanHalf', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5', notes: ['displaysDefinition'] }
          })
        ),
        { data: { category: 'failure' } }
      ),

      makeOption(
        'propertyDamage',
        makeQuestionAction(
          makeQuestion(
            'lessThan25Grand',
            [
              yesMeansIncident,
              noAskQuestion(
                makeQuestion('fmvLessThan25Grand', noMeansSeriousIncidentYesMeansIncident, {
                  data: { regulation: '830.5' }
                })
              )
            ],
            { data: { regulation: '830.5', notes: ['materialsAndLabor'] } }
          )
        ),
        { data: { subtitle: 'propertyDamage' } }
      ),
      makeOption(
        'evacuation',
        makeQuestionAction(
          makeQuestion('escapeSlidesUsed', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { only: [Flag.LARGE_MULTI] }
      ),

      makeOption(
        'collision',
        makeQuestionAction(
          makeQuestion('inFlightCollision', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'traffic' } }
      ),
      makeOption(
        'TCASRA',
        makeQuestionAction(
          makeQuestion(
            'ifr',
            [
              yesAskQuestion(
                makeQuestion('complianceNecessary', yesMeansSeriousIncidentNoMeansIncident, {
                  data: { regulation: '830.5' }
                })
              ),
              noMeansIncident
            ],
            { data: { regulation: '830.5' } }
          )
        ),
        { data: { category: 'traffic' } }
      ),

      makeOption(
        'wrongRunway',
        makeQuestionAction(
          makeQuestion('publicAirport', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'surface' }, only: [Flag.AIR_CARRIER] }
      ),
      makeOption(
        'taxiway',
        makeQuestionAction(
          makeQuestion('publicAirport', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        {
          data: { category: 'surface', subtitle: 'taxiway' },
          only: [Flag.AIR_CARRIER]
        }
      ),
      makeOption(
        'runwayIncursion',
        makeQuestionAction(
          makeQuestion('publicAirport', yesMeansSeriousIncidentNoMeansIncident, {
            data: { regulation: '830.5' }
          })
        ),
        { data: { category: 'surface' }, only: [Flag.AIR_CARRIER] }
      )
    ],
    { multi: true }
  )
}

export default incidentSurvey
