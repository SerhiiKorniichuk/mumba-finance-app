import React, {Component} from 'react'
import './MiniOfferBox.scss'


class MiniOfferBox extends Component {
    render() {
        return (
            <div className="mini-offer-box">
                <div className="mini-offer-box__body">
                    <h3 className="mini-offer-box__title">{ this.props.title }</h3>
                    <span className="mini-offer-box__main-text">{ this.props.mainText }</span>
                    <span className="mini-offer-box__description">{ this.props.description }</span>
                </div>
            </div>
        )
    }
}

export default MiniOfferBox