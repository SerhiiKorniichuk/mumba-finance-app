import React, {Component} from 'react'
import './BannerT2.scss'
import MiniOfferBox from "../../components/MiniOfferBox/MiniOfferBox"
import {Link} from "react-router-dom"


class BannerT2 extends Component {
    render() {
        return (
            <section className="section banner-t2-section">
                <div className="main-container">
                    <div className="banner-t2-section__body">
                        <div className="banner-t2-section__bubbles banner-t2-section__bubbles--xl">
                            <img src={require("assets/img/banner-t2/banner-bg-item-xl.svg")} alt="Bubbles" />
                        </div>
                        <div className="banner-t2-section__head">
                            <h2 className="banner-t2-section__title">Mumba Token [MBM]</h2>
                        </div>
                        <div className="banner-t2-section__offers-boxes">
                            <MiniOfferBox
                                title="You will receive"
                                mainText="15%"
                                description="Annual profitability from token"
                            />
                            <div className="banner-t2-section__btn-box">
                                { this.props.userId
                                    ?
                                    <Link
                                        to="/dashboard"
                                        className="t1-btn t1-btn--xl t1-btn--green"
                                        onClick={ this.props.scrollToTop }
                                    >
                                        <span>Buy Token</span>
                                    </Link>
                                    :
                                    <button
                                        className="t1-btn t1-btn--xl t1-btn--green"
                                        onClick={ this.props.toggleSignUp }
                                    >
                                        <span>Buy Token</span>
                                    </button>
                                }
                                <Link
                                    to="/token"
                                    className="banner-t2-section__btn-subtitle"
                                    onClick={ this.props.scrollToTop }
                                >
                                    <span>More about the token</span>
                                </Link>
                            </div>
                            <MiniOfferBox
                                title="Token value"
                                mainText="$100"
                                description="Minimal investment amount $500"
                            />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default BannerT2