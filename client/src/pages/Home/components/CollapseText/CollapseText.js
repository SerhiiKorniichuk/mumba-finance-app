import React, {Component} from "react"
import "./CollapseText.scss"


export class CollapseText extends Component {

    state = {
        collapse: false
    }

    componentDidMount() {
        this.getWindowWidth()
        window.addEventListener('resize', this.getWindowWidth, true)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getWindowWidth, true)
    }

    getWindowWidth = () => {
        const windowInnerWidth = window.innerWidth

        windowInnerWidth < 992
            ? this.setState({ collapse: true })
            : this.setState({ collapse: false })
    }

    showMore = () => this.setState({ collapse: false })

    render() {
        return (
            <>
                { this.state.collapse
                    ? <button className="collapse-btn" onClick={this.showMore}>Read more</button>
                    : <>{ this.props.children }</>
                }
            </>
        )
    }
}