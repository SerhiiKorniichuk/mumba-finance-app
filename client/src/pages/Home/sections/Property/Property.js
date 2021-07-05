import React, {Component} from 'react'
import './Property.scss'
import PictureWithFigure from "../../components/PictureWithFigure/PictureWithFigure";


class Property extends Component {
    render() {
        return (
            <section className="section property-section">
                <div className="main-container">
                    <div className="property-section__body">
                        <div className="property-add-block property-add-block--right-align">
                            <PictureWithFigure image={require('assets/img/property/property_1.jpg')} />
                            <h3 className="property-add-block__title">Property</h3>
                            <p className="property-add-block__description">
                                Real estate is generally the best investment option. Real estate has been considered a profitable investment for many years with impressive returns, including the possibility of generating passive and stable income.
                            </p>
                        </div>

                        <div className="property-main-block">
                            <div className="property-main-block__bubbles">
                                <img src={require('assets/img/property/property-bubbles-bg.svg')} alt="Bubbles" />
                            </div>
                            <div className="property-main-block__body">
                                <h2 className="property-main-block__title">Mumba token</h2>
                                <p className="property-main-block__description">
                                    The new generation of real estate investment based on blockchain technology. Combining the traditional real estate assets with blockchain technology, Mumba token has the volume of real estate assets, velocity and security of blockchain technologies. For the first time investors around the globe can buy the anywhere real estate market through fully-compliant, fractional, tokenized ownership.
                                </p>
                            </div>
                        </div>

                        <div className="property-add-block property-add-block--left-align">
                            <PictureWithFigure image={require('assets/img/property/property_2.jpg')} />
                            <h3 className="property-add-block__title">Blockchain</h3>
                            <p className="property-add-block__description">
                                Blockchain is the next step for technological innovations for the real estate industry. Property transactions in minutes at minimal cost. Decentralization and automation, no middlemen. Reliability, transparency and immutability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Property