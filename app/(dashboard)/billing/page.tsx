"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Download, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function BillingPage() {
  const { t } = useLanguage()
  const [currentPlan] = useState("pro")

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "29",
      description: "Perfect for small projects",
      features: ["1,000 documents", "10,000 queries/month", "5 GB storage", "Email support", "Basic analytics"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "99",
      description: "For growing businesses",
      features: [
        "10,000 documents",
        "100,000 queries/month",
        "50 GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom models",
        "API access",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited documents",
        "Unlimited queries",
        "Unlimited storage",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "On-premise deployment",
      ],
    },
  ]

  const invoices = [
    { id: "INV-001", date: "2025-01-01", amount: "99.00", status: "paid" },
    { id: "INV-002", date: "2024-12-01", amount: "99.00", status: "paid" },
    { id: "INV-003", date: "2024-11-01", amount: "99.00", status: "paid" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t("billing.title")} description={t("billing.description")} />

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.currentPlan")}</CardTitle>
          <CardDescription>{t("billing.currentPlanDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Pro Plan</h3>
                <Badge>{t("alerts.status.active")}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">$99/month • Renews on Feb 1, 2025</p>
            </div>
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              {t("billing.managePayment")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("billing.availablePlans")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.popular ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge variant="default">
                      <Zap className="mr-1 h-3 w-3" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price === "Custom" ? plan.price : `$${plan.price}`}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={currentPlan === plan.id ? "outline" : "default"}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id
                    ? t("billing.currentPlan")
                    : plan.price === "Custom"
                      ? t("billing.contactSales")
                      : t("billing.upgrade")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.billingHistory")}</CardTitle>
          <CardDescription>{t("billing.billingHistoryDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount}</p>
                    <Badge variant="secondary" className="text-xs">
                      {t(`billing.status.${invoice.status}`)}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
