"use server";

import { generateInvestmentReport, type GenerateInvestmentReportInput } from "@/ai/flows/generate-investment-report";

export async function createReport(dealData: GenerateInvestmentReportInput) {
  try {
    const reportData = await generateInvestmentReport(dealData);
    return { success: true, report: reportData };
  } catch (error) {
    console.error("Error generating report:", error);
    return { success: false, error: "Failed to generate report." };
  }
}
