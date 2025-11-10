import type { ReactNode } from "react"

export function IconItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 select-none" aria-hidden>
        {icon}
      </span>
      <span>{children}</span>
    </li>
  )
}


