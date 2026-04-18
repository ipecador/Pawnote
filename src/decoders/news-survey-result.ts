import type {
  NewsSurveyQuestionResult,
  NewsSurveyResultGroup,
  NewsSurveyResultIndividual,
} from "~/models";
import { decodeDomain } from "./domain";

const decodeIndividual = (raw: any): NewsSurveyResultIndividual => ({
  id: raw.N,
  name: raw.L,
  firstName: raw.prenom ?? "",
  answered: raw.repondu ?? false,
  selectedChoices: raw.domaineReponse
    ? decodeDomain(raw.domaineReponse.V).map((i) => i - 1)
    : [],
  textResponse: raw.texteReponse ?? "",
});

const decodeGroup = (raw: any, individuals: NewsSurveyResultIndividual[]): NewsSurveyResultGroup => ({
  label: raw.L,
  expected: raw.nbAttendue ?? 0,
  received: raw.nbRecue ?? 0,
  percentage: raw.pourcentageRecue ?? 0,
  // Pronote 1-indexes these by choice position; slot 0 is padding.
  voteCounts: (raw.valeurCumul ?? []).slice(1),
  votePercents: (raw.percentCumul ?? []).slice(1),
  individuals,
});

export const decodeNewsSurveyResults = (data: any): NewsSurveyQuestionResult[] => {
  return data.listeQuestions.V.map((question: any) => {
    const respondents = question.listeRepondant?.V ?? [];
    const cumuls = respondents.filter((r: any) => r.estCumul);
    const groups = cumuls.map((cumul: any) => {
      const individuals = respondents
        .filter((r: any) => !r.estCumul && r.NumeroArticlePere === cumul.NumeroArticleLigne)
        .map(decodeIndividual);
      return decodeGroup(cumul, individuals);
    });
    return {
      id: question.N,
      label: question.L,
      position: question.P,
      groups,
    };
  });
};
