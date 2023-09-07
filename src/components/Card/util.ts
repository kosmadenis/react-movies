export function getScoreColor(score?: number): string {
  if (score === undefined) {
    return '#00000033'
  }

  if (score <= 3) {
    return '#E90000'
  }

  if (score <= 5) {
    return '#E97E00'
  }

  if (score <= 7) {
    return '#E9D100'
  }

  return '#66E900'
}
