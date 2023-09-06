// Отрезать текст `text` до длины `maxLength`, добавив троеточие.
export function limitText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }

  const words = text.split(' ')

  let currentLength = text.length
  let wordIndex = words.length - 1

  while (currentLength > maxLength && wordIndex >= 0) {
    const word = words[wordIndex]
    currentLength -= word.length + 1
    wordIndex -= 1
  }

  return `${text.slice(0, currentLength)}...`
}

// Ограничить число значениями `min`, `max`.
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// Вычислить цвет для оценки фильма `score`.
// `score` - float число от 0 до 10.
export function calculateScoreColor(score) {
  // Нормализованная оценка
  const x = clamp(score / 10, 0, 1)

  // s-компонента в системе HSV
  const s = 0.8
  // v-компонента в системе HSV
  const v = 0.8

  // минимальная компонента в системе rgb
  const min = 255 * (1 - s)
  // максимальная компонента в системе rgb
  const max = 255 * v
  // диапазон значений в системе rgb
  const range = clamp(max - min, 0, 255)

  // В диапазоне [0, 0.5) :
  //  - g увеличивается от `min` до `max`
  // В диапазоне [0.5, 1] :
  //  - r уменьшается от `max` до `min`
  return {
    r: clamp(max - (x - 0.5) * 2 * range, min, max),
    g: clamp(min + x * 2 * range, min, max),
    b: min,
  }
}
