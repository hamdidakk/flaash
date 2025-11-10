export function PromptsChips({ prompts, disabled, onPick }: { prompts: string[]; disabled?: boolean; onPick: (q: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-6 pb-6 pt-1">
      {prompts.map((q) => (
        <button
          key={q}
          type="button"
          className="h-auto rounded-lg bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200 disabled:opacity-50"
          onClick={() => onPick(q)}
          disabled={disabled}
        >
          {q}
        </button>
      ))}
    </div>
  )
}


