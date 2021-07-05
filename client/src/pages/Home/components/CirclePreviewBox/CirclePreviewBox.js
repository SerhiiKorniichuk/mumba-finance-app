import React, {Component} from 'react'
import './CirclePreviewBox.scss'


class CirclePreviewBox extends Component {
    render() {

        const link = this.props.link ? this.props.link : '#'

        return (
            <div className="circle-preview-box">
                <a href={ link } className="box-shadow circle-preview-box__image" target="_blank" rel="noopener noreferrer">
                    { this.props.image && <img src={ this.props.image } alt="SomePicture" /> }
                </a>
                <div className="circle-preview-box__text">
                    <a href={ link } className="circle-preview-box__link" target="_blank" rel="noopener noreferrer">{ this.props.text }</a>
                </div>
            </div>
        )
    }
}

export default CirclePreviewBox