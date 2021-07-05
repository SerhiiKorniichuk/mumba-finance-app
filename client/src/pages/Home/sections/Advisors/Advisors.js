import React, {Component} from 'react'
import './Advisors.scss'
import CirclePreviewBox from '../../components/CirclePreviewBox/CirclePreviewBox'


const boxes_data = [
    {
        image: require('assets/img/advisors/advisors_1.png'),
        link: 'https://id.linkedin.com/in/shintabubu',
        text: 'Shinta Dhanuwardoyo'
    },
    {
        image: require('assets/img/advisors/advisors_2.png'),
        link: 'https://www.business.stankeviciusmgm.com/',
        text: 'Paulius Stankevicius'
    },
    {
        image: require('assets/img/advisors/advisors_3.png'),
        link: 'http://www.mumba.finance/Ayla_Aldjufrie.pdf',
        text: 'Ayla Aldjufrie'
    },
    {
        image: require('assets/img/advisors/advisors_4.png'),
        link: 'http://www.mumba.finance/Julastina_Muktiwati.pdf',
        text: 'Julastina Muktiwati'
    }
]


class Advisors extends Component {
    render() {

        const circle_preview_boxes = boxes_data.map((item, index) => {
            return <CirclePreviewBox key={index} image={item.image} link={item.link} text={item.text} />
        })

        return (
            <section className="section partners-section">
                <div className="main-container">
                    <div className="section-title section-title--white">
                        <h2 className="section-title__inner">Our advisors</h2>
                    </div>
                    <div className="partners-section__body">
                        { circle_preview_boxes }
                    </div>
                </div>
            </section>
        )
    }
}

export default Advisors