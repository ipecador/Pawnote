export type NewsSurveyResultIndividual = Readonly<{
  id: string;
  name: string;
  firstName: string;
  answered: boolean;
  selectedChoices: number[];
  textResponse: string;
}>;

export type NewsSurveyResultGroup = Readonly<{
  label: string;
  expected: number;
  received: number;
  percentage: number;
  voteCounts: number[];
  votePercents: number[];
  individuals: NewsSurveyResultIndividual[];
}>;

export type NewsSurveyQuestionResult = Readonly<{
  id: string;
  label: string;
  position: number;
  groups: NewsSurveyResultGroup[];
}>;
