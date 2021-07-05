import React, {Component} from 'react'
import './Benefits.scss'
import BenefitsBox from "../../components/BenefitsBox/BenefitsBox"
import {Link} from "react-router-dom"


const boxes_data = [
    {
        icon: require('assets/img/benefits/benefits_1.svg'),
        title: 'Receiving rental payments',
        description: 'We have already rented out most of our properties. Using smart contracts, the resulting rent will be distributed to token holders, minus utilities and other overhead costs. In this way, our digital tokens, which already have investment value, also become a source of passive income.'
    },
    {
        icon: require('assets/img/benefits/benefits_2.svg'),
        title: 'Availability',
        description: 'Mumba tokens accessible by anyone with an internet connection (within regulatory limits). You can buy / sell a villa in Bali being anywhere at this time. This democratize access to capital markets for companies and investors alike. Become a real estate investor from $500.'
    },
    {
        icon: require('assets/img/benefits/benefits_3.svg'),
        title: 'Increased liquidity',
        description: 'With Security tokens enabling fractional ownership and thereby lowering minimum investments, more liquidity will come into the market. As more people will be able to purchase smaller stakes, many assets that are considered to be illiquid, or not easily to (re)sell will increase their liquidity on the blockchain.'
    },
    {
        icon: require('assets/img/benefits/benefits_4.svg'),
        title: 'Mumba property management',
        description: 'Mumba outsources Property Management to local professionals. They are responsible for renting the property, collecting rental income, and maintaining or repairing the property. Through tokenization the results of any inspection of the property, including its maintenance and repair history, will be stored in the blockchain forever.'
    },
    {
        icon: require('assets/img/benefits/benefits_5.svg'),
        title: 'Legally',
        description: 'Tokens gives its holder a right of ownership and is subject to securities regulations. $100 USD per share = $100 USD per secure token. Real estate shares and Security tokens are one and the same. Tokens fully comply with the requirements of Indonesian securities legislation. Backed by the capital of the company, have real financial value.'
    },
    {
        icon: require('assets/img/benefits/benefits_6.svg'),
        title: 'Automation & transparency',
        description: 'Automating allows receiving dividend payments instantly. Automated and quick KYC and AML process. Blockchain allows a uniform method of verifying and tracking data and prevents tampering due to its immutability. It becomes the perfect infrastructure to document ownership of securities in a fully transparent way.'
    }
]


class Benefits extends Component {
    render() {

        const benefits_boxes = boxes_data.map((item, index) => {
            return <BenefitsBox key={index} icon={item.icon} title={item.title} description={item.description} />
        })

        return (
            <section className="section benefits-section">
                <div className="main-container">
                    <div className="section-title section-title--white">
                        <h2 className="section-title__inner">Benefits of tokenization</h2>
                    </div>
                    <div className="benefits-section__body">
                        { benefits_boxes }
                    </div>
                    <div className="benefits-section__footer">
                        <Link to="/token" className="t1-btn t1-btn--xl t1-btn--white-outline" onClick={ this.props.scrollToTop }>More about the token</Link>
                    </div>
                </div>
            </section>
        )
    }
}

export default Benefits