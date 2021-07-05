import React, {Component} from 'react'
import './BenefitsBox.scss'


class BenefitsBox extends Component {
    render() {
        return (
            <div className="benefits-box">
                <div className={`box-shadow benefits-icon ${this.props.color === 'purple' ? 'benefits-icon--purple' : ''} benefits-box__icon`}>
                    { this.props.icon
                        ?
                        <img src={ this.props.icon } alt="Icon"/>
                        :
                        <span>{ this.props.index + 1 }</span>
                    }
                </div>
                <div className="benefits-info benefits-box__info">
                    { this.props.title &&
                        <h3 className="benefits-info__title">{ this.props.title }</h3>
                    }
                    { this.props.description &&
                        <p className="benefits-info__description">{ this.props.description }</p>
                    }
                </div>
            </div>
        )
    }
}

export default BenefitsBox