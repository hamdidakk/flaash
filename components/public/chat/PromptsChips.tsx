export function PromptsChips({ prompts, disabled, onPick }: { prompts: string[]; disabled?: boolean; onPick: (q: string) => void }) {
  return (
    <div className="public-prompts">
      {prompts.map((q) => (
        <button
          key={q}
          type="button"
          className="public-prompts__chip"
          onClick={() => onPick(q)}
          disabled={disabled}
        >
          {q}
        </button>
      ))}
    </div>
  )
}


