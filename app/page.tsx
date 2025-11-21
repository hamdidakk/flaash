import { RagHome } from "@/components/rag/RagHome"
import { RagAppShell } from "@/components/rag/RagAppShell"

export default function RootPage() {
  return (
    <RagAppShell>
      <RagHome />
    </RagAppShell>
  )
}
