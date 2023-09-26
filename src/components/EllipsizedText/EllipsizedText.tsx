import React from 'react'
import { Skeleton } from 'antd'
import { debounce } from 'lodash-es'

interface Props {
  className?: string
  text: string
}

interface State {
  ellipsizedText?: string
}

const DEBOUNCE_DELAY = 1000

const EllipsizedText = class extends React.Component<Props, State> {
  ref = React.createRef<HTMLParagraphElement>()

  resizeObserver = new ResizeObserver(
    debounce(
      () => {
        const ellipsizedText = this.ellipsize()
        this.setState({ ellipsizedText })
      },
      DEBOUNCE_DELAY,
      { leading: true }
    )
  )

  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  override componentDidMount() {
    const element = this.ref.current

    if (!element) {
      return
    }

    this.resizeObserver.observe(element)
  }

  override componentDidUpdate(prevProps: Props) {
    const { className, text } = this.props
    if (prevProps.className !== className || prevProps.text !== text) {
      const ellipsizedText = this.ellipsize()
      this.setState({ ellipsizedText })
    }
  }

  override componentWillUnmount() {
    this.resizeObserver.disconnect()
  }

  ellipsize(): string {
    const element = this.ref.current

    let { text } = this.props

    if (!element) {
      return text
    }

    const elementText = element.textContent

    element.textContent = text

    if (element.scrollHeight <= element.clientHeight) {
      element.textContent = elementText
      return text
    }

    let words = text.split(' ')

    for (;;) {
      text = text.slice(0, -(words[words.length - 1].length + 1))
      words = words.slice(0, -1)

      element.textContent = `${text}…`

      const { scrollHeight, clientHeight } = element
      if (scrollHeight <= clientHeight) {
        break
      }

      if (words.length === 0) {
        break
      }
    }

    element.textContent = elementText

    return `${text}…`
  }

  override render() {
    const { text, className } = this.props
    const { ellipsizedText } = this.state

    if (!text) {
      return null
    }

    return (
      <div
        className={className}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <Skeleton
          style={{ position: 'absolute' }}
          active
          loading={!ellipsizedText}
        />
        <p
          ref={this.ref}
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
            margin: '0',
            padding: '0',
          }}
        >
          {ellipsizedText}
        </p>
      </div>
    )
  }
}

export default EllipsizedText
