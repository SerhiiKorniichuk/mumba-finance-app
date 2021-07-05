import React, {Component} from 'react'
import './HowItWorks.scss'
import BenefitsBox from "../../components/BenefitsBox/BenefitsBox";


const boxes_data = [
    {
        icon: '',
        title: '',
        description: 'You register on the site and pass verification (KYC, AML).'
    },
    {
        icon: '',
        title: '',
        description: 'You are buying digital securities with fiat — USD, IDR or crypto — BTC, ETH.'
    },
    {
        icon: '',
        title: '',
        description: 'Mumba invests in real estate in Indonesia.'
    },
    {
        icon: '',
        title: '',
        description: 'The management company finds tenants, collects rental income, and maintains the property.'
    },
    {
        icon: '',
        title: '',
        description: 'You receive your dividends, and the value of real estate also rises.'
    },
    {
        icon: '',
        title: '',
        description: 'After lock up period you will can sell or trade your digital securities at any time on regulated exchanges or peer-to-peer.'
    }
]


class HowItWorks extends Component {
    render() {

        let benefits_boxes = boxes_data.map((item, index) => {
            return <BenefitsBox key={index} index={index} color={'purple'} icon={item.icon} title={item.title} description={item.description} />
        })

        return (
            <section className="section how-it-work-section">
                <div className="main-container">
                    <div className="section-title">
                        <h2 className="section-title__inner">How it work</h2>
                    </div>
                    <div className="how-it-work-section__body">
                        { benefits_boxes }
                    </div>
                </div>
            </section>
        );
    }
}

export default HowItWorks