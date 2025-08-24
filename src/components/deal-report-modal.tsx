"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RankedDeal, InvestmentReportOutput } from "@/lib/types"
import { DollarSign, LineChart, ShieldAlert, TrendingUp } from "lucide-react"

interface DealReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: InvestmentReportOutput
  deal: RankedDeal
}

export default function DealReportModal({
  isOpen,
  onClose,
  report,
  deal,
}: DealReportModalProps) {
  if (!report) return null

  const { keyMetrics, reportSummary, riskFactors, potentialReturns } = report

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            AI Investment Report
          </DialogTitle>
          <DialogDescription>{deal.address}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{reportSummary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NOI</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${keyMetrics.noi.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Annual Net Operating Income</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cap Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keyMetrics.capRate}%</div>
                <p className="text-xs text-muted-foreground">Capitalization Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash on Cash</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keyMetrics.cashOnCashReturn}%</div>
                 <p className="text-xs text-muted-foreground">Return on Investment</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{riskFactors}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Potential Returns
                  </CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-sm text-muted-foreground">{potentialReturns}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
