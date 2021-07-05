import React, {Component} from 'react'
import './BannerT1.scss'
import MiniOfferBox from "../../components/MiniOfferBox/MiniOfferBox";
import {Link} from "react-router-dom";


class BannerT1 extends Component {
    render() {
        return (
            <section className="section banner-t1-section">
                <div className="main-container">
                    <div className="banner-t1-section__body">
                        <div className="banner-t1-section__bubbles banner-t1-section__bubbles--sm">
                            <img src={require("assets/img/banner-t1/banner-bg-item-sm.svg")} alt="Bubbles" />
                        </div>
                        <div className="banner-t1-section__bubbles banner-t1-section__bubbles--xl">
                            <img src={require("assets/img/banner-t1/banner-bg-item-xl.svg")} alt="Bubbles" />
                        </div>
                        <div className="banner-t1-section__btn-box">
                            <h2 className="banner-t1-section__title">Mumba Token [MBM]</h2>
                            { this.props.userId
                                ?
                                <Link
                                    to="/dashboard"
                                    className="t1-btn t1-btn--xl t1-btn--green banner-t1-section__desk-btn"
                                    onClick={ this.props.scrollToTop }
                                >
                                    <span>Buy Token</span>
                                </Link>
                                :
                                <button
                                    className="t1-btn t1-btn--xl t1-btn--green banner-t1-section__desk-btn"
                                    onClick={ this.props.toggleSignUp }
                                >
                                    <span>Buy Token</span>
                                </button>
                            }
                        </div>
                        <div className="banner-t1-section__offers-boxes">
                            <MiniOfferBox
                                title="You will receive"
                                mainText="15%"
                                description="Annual profitability from token"
                            />
                            <MiniOfferBox
                                title="Token value"
                                mainText="$100"
                                description="Minimal investment amount $500"
                            />
                        </div>
                        { this.props.userId
                            ?
                            <Link
                                to="/dashboard"
                                className="t1-btn t1-btn--xl t1-btn--green banner-t1-section__mob-btn"
                                onClick={ this.props.scrollToTop }
                            >
                               <span>Buy Token</span>
                            </Link>
                            :
                            <button
                                className="t1-btn t1-btn--xl t1-btn--green banner-t1-section__mob-btn"
                                onClick={ this.props.toggleSignUp }
                            >
                                <span>Buy Token</span>
                            </button>
                        }
                    </div>
                </div>
            </section>
        )
    }
}

export default BannerT1