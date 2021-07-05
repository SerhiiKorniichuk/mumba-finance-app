import React, {Component} from 'react'
import './AboutCompany.scss'
import PictureWithFigure from "../../components/PictureWithFigure/PictureWithFigure";


class AboutCompany extends Component {
    render() {
        return (
            <section className="section about-section">
                <div className="main-container">
                    <div className="section-title">
                        <h2 className="section-title__inner">About company</h2>
                    </div>
                    <div className="about-section__body">
                        <PictureWithFigure image={require('assets/img/about/about_1.jpg')} />
                        <div className="about-section__info">
                            <p className="about-section__description">
                                We created this company to give everyone in the world the opportunity to invest in real estate and receive passive income. To give liquidity, transparency and availability for experienced investors. To make this possible we tokenized real estate, we created digital securities — MumbaToken. The Mumba team includes both experienced IT and blockchain technology experts, as well as real estate market experts in Indonesia. Indonesia was chosen because it is the most promising investment destination in the ASEAN region. The growth of real estate prices is particularly impressive on the island of Bali, where the rate of growth is setting world records. Become a new generation investor you too!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default AboutCompany