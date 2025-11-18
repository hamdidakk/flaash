"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { FormField } from "./form-field"
import { Building2, Users, Briefcase } from "lucide-react"
import { useSessionStore } from "@/store/session-store"

export function OnboardingForm() {
  const [organizationName, setOrganizationName] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [industry, setIndustry] = useState("")
  const updateUser = useSessionStore((state) => state.updateUser)
  const { t } = useLanguage()
  const router = useRouter()

  const handleComplete = () => {
    if (organizationName) {
      updateUser({
        organizationName,
      })
    }
    router.push("/home")
  }

  const handleSkip = () => {
    router.push("/home")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          id="org-name"
          label={t("onboarding.organizationName")}
          type="text"
          placeholder={t("onboarding.organizationPlaceholder")}
          value={organizationName}
          onChange={setOrganizationName}
          icon={<Building2 className="h-4 w-4" />}
        />
        <FormField
          id="team-size"
          label={t("onboarding.teamSize")}
          type="text"
          placeholder={t("onboarding.teamSizePlaceholder")}
          value={teamSize}
          onChange={setTeamSize}
          icon={<Users className="h-4 w-4" />}
        />
        <FormField
          id="industry"
          label={t("onboarding.industry")}
          type="text"
          placeholder={t("onboarding.industryPlaceholder")}
          value={industry}
          onChange={setIndustry}
          icon={<Briefcase className="h-4 w-4" />}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleSkip}>
          {t("onboarding.skip")}
        </Button>
        <Button onClick={handleComplete}>{t("onboarding.complete")}</Button>
      </div>
    </div>
  )
}
