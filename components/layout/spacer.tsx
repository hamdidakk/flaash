interface SpacerProps {
  size?: 2 | 4 | 6 | 8 | 12 | 16
}

export function Spacer({ size = 4 }: SpacerProps) {
  const sizeClasses = {
    2: "h-2",
    4: "h-4",
    6: "h-6",
    8: "h-8",
    12: "h-12",
    16: "h-16",
  }

  return <div className={sizeClasses[size]} />
}
