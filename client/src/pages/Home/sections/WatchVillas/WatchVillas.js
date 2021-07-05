import React, {Component} from 'react'
import './WatchVillas.scss'


class WatchVillas extends Component {
    render() {
        return (
            <section className="section mini-gallery-section">
                <div className="main-container">
                    <div className="mini-gallery-section__body">
                        <div className="mini-gallery-info">
                            <div className="mini-gallery-info__head">
                                <h3 className="mini-gallery-info__title">Tokenized real estate</h3>
                            </div>
                            <div className="mini-gallery-info__body">
                                <p className="mini-gallery-info__description">
                                    The first tokenized real estate is Nayla Boutique Villa. It's tourist property on Bali with private pools, reception, wifi and room service. Click the button if you want to know more about property highlights.
                                </p>
                            </div>
                            <div className="mini-gallery-info__footer">
                                <a href="https://www.mumba.finance/ExcumNayla.pdf" className="t1-btn t1-btn--purple" target="_blank" rel="noopener noreferrer">
                                    <span>Explore more</span>
                                </a>
                            </div>
                        </div>
                        <div className="mini-gallery-preview">
                            <div className="mini-gallery-preview__box">
                                <div className="mini-gallery-preview__image">
                                    <img src={require('assets/img/watch-villas/watch_villas_1.png')} alt="SomeImage"/>
                                </div>
                            </div>
                            <div className="mini-gallery-preview__box">
                                <div className="mini-gallery-preview__image">
                                    <img src={require('assets/img/watch-villas/watch_villas_2.png')} alt="SomeImage"/>
                                </div>
                            </div>
                            <div className="mini-gallery-preview__box">
                                <div className="mini-gallery-preview__image">
                                    <img src={require('assets/img/watch-villas/watch_villas_3.png')} alt="SomeImage"/>
                                </div>
                            </div>
                            <div className="mini-gallery-preview__box">
                                <div className="mini-gallery-preview__image">
                                    <img src={require('assets/img/watch-villas/watch_villas_4.png')} alt="SomeImage"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default WatchVillas