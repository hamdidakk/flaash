export function TalkToIAIcon({ caption, ctaLabel, ctaHref = "/chat" }: { caption?: string; ctaLabel?: string; ctaHref?: string }) {
  return (
    <div className="relative bg-[#0c0f1a] md:bg-gradient-to-br from-[#0d101b] to-[#111729] rounded-2xl p-12 flex flex-col items-center justify-center shadow-lg text-white">
      <div className="ia-halo pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 blur-xl opacity-50" />
      <div className="relative flex flex-col items-center justify-center">
        <div className="ia-outer-ring w-32 h-32 md:w-48 md:h-48 border-4 border-blue-400/70 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)]">
          <div className="w-16 h-16 md:w-24 md:h-24 border-2 border-blue-300/70 rounded-full" />
        </div>
        <div className="ia-base-ring mt-6 w-24 h-12 md:w-32 md:h-16 border-4 border-blue-400/70 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
      </div>
      {caption ? (
        <p className="relative z-10 mt-6 max-w-md text-center text-sm text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">{caption}</p>
      ) : null}
      {ctaLabel ? (
        <a
          href={ctaHref}
          className="relative z-10 mt-4 inline-block rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-400 hover:to-purple-400"
        >
          {ctaLabel}
        </a>
      ) : null}
    </div>
  )
}


