import type { RankDealsOutput } from '@/ai/flows/deal-ranking';
import type { GenerateInvestmentReportInput, GenerateInvestmentReportOutput } from '@/ai/flows/generate-investment-report';

export type RankedDeal = RankDealsOutput['rankedDeals'][0];
export type InvestmentReportInput = GenerateInvestmentReportInput;
export type InvestmentReportOutput = GenerateInvestmentReportOutput;
