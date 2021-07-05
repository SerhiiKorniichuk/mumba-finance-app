import React, {Component} from 'react'
import './Reliability.scss'
import {Link} from "react-router-dom"
import {CollapseText} from "../../components/CollapseText/CollapseText"


class Reliability extends Component {
    render() {
        return (
            <section className="section section--gray reliability-section">
                <div className="main-container">
                    <div className="section-title">
                        <h2 className="section-title__inner">It's fully reliable</h2>
                    </div>
                    <div className="reliability-section__body">
                        <div className="reliability-image-box">
                            <div className="reliability-image-box__inner">
                                <img src={require('assets/img/reliability/reliability_1_xl.jpg')} alt="SomeImage"/>
                            </div>
                            <div className="info-tag">
                                <div className="box-shadow info-tag__inner">
                                    <span>1 token = 1 share</span>
                                </div>
                            </div>
                        </div>
                        <div className="reliability-info-box">
                            <div className="reliability-info-box__body">
                                <p className="reliability-info-box__description">
                                    As Mumba token represents similar functions as REITs, the regulatory framework is also similar but less difficult and cheaper on fees because of digitalization. Since 2007, real estate investment trusts (REITs) have been regulated in Indonesia using the tool known as "Real Estate Investment Funds in the form of Collective Investment Contracts" (Dana Investasi Real Estat Berbentuk Kontrak Investasi Kolektif) (DIREs). DIREs are permitted to raise funds from investors for subsequent investment in real estate assets, real estate-related assets (including securities issued by a real estate company) and/or cash and cash equivalents.
                                </p>
                                <CollapseText>
                                    <p className="reliability-info-box__description">
                                        Tokenization is one way to securitize real assets. To securitize an asset means to divide it into shares that you can buy. In the same way, to “tokenize” an asset is to divide it into shares, or “tokens”, that represent a predefined share of the underlying asset. They are therefore often called “security tokens”. These tokens are secured through the immutability of blockchain technology, and they’re tradeable via crypto exchanges or Alternative Trading Systems (ATS). The initial sale of a security token is typically called a security token offering (STO). An STO is not the same thing as an initial coin offering (ICO). ICOs offer investors a token, but this token doesn’t necessarily represent ownership in the underlying asset or company. In many cases, the tokens sold are called “utility tokens” because they only have value on the company’s platform. Buyers are therefore “investing” to support the project and with the hope that, as the platform grows, the value of the tokens will increase. STOs are distinct from ICOs because the tokens sold (security tokens) <span className="bold">represent ownership in a real asset.</span> STO investors know the real value of the underlying asset they’re buying and benefit from any future price appreciation in the asset.
                                    </p>
                                </CollapseText>
                            </div>
                            <div className="reliability-info-box__footer">
                                <Link to="/how_it_works" className="t1-btn t1-btn--green" onClick={ this.props.scrollToTop }>How it works</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Reliability