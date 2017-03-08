import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { isNil } from 'lodash'

const leavingSpringConfig = {
    stiffness: 60,
    damping: 15
}
export class WaterSurface extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mouse: [],
            now: 't' + 0
        }

    }

    handleMouseMove(e) {
        // Make sure the state is queued and not batched.
        const { clientX, clientY } = e
        this.setState(() => {
            return {
                mouse: [clientX - 25, clientY - 50],
                now: 't' + Date.now(),
            }
        })
    }

    handleTouchMove(e) {
        e.preventDefault()
        this.handleMouseMove(e.touches[0])
    }

    willEnter(styleCell) {
        return {
            x: styleCell.style.x.val,
            y: styleCell.style.y.val,
            opacity: 1,
            scale: 4,
        }
    }

    render() {
        const { mouse: [mouseX, mouseY], now } = this.state
        const styles = isNil(mouseX)
        ? []
        : [{
            key: now,
            style: {
                opacity: spring(0),
                scale: spring(1),
                x: spring(mouseX),
                y: spring(mouseY),
            }
        }]
        return (
            <TransitionMotion styles={styles} willEnter={this.willEnter}>
                {(circles) =>
                    <div
                        onClick={this.handleMouseMove.bind(this)}
                        className="watersurface">
                        {circles.map(({ key, style: { opacity, scale, x, y } }) =>
                            <div
                                key={key}
                                className="watersurface-ball"
                                style={{
                                    opacity: opacity,
                                    scale: scale,
                                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                                    WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                                }}
                            />
                        )}
                    </div>
                }
            </TransitionMotion>
        )
    }
}
