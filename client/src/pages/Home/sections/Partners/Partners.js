import React, {Component} from 'react'
import './Partners.scss'
import CirclePreviewBox from '../../components/CirclePreviewBox/CirclePreviewBox'


const boxes_data = [
    {
        image: require('assets/img/partners/partners_1.png'),
        link: 'https://www.hujanholding.com/',
        text: 'Hujan Asset Management Ltd'
    },
    {
        image: require('assets/img/partners/partners_2.jpg'),
        link: 'https://www.mumba.finance/Ayla_Associates.pdf',
        text: 'Ayla & Associates'
    },
    {
        image: require('assets/img/partners/partners_3.png'),
        link: 'https://gpbtcentre.net/wp',
        text: 'Global Property Bank & Technology Centre'
    },
    {
        image: require('assets/img/partners/partners_4.png'),
        link: 'https://bnbprofits.com/',
        text: 'bnbprofits'
    },
    {
        image: require('assets/img/partners/partners_5.jpeg'),
        link: 'https://worldwomenleadingchange.com/',
        text: 'World Women Leading Change'
    },
    {
        image: require('assets/img/partners/partners_6.png'),
        link: '',
        text: 'Amerak Global'
    }
]


class Partners extends Component {
    render() {

        const circle_preview_boxes = boxes_data.map((item, index) => {
            return <CirclePreviewBox key={index} image={item.image} link={item.link} text={item.text} />
        })

        return (
            <section className="section partners-section">
                <div className="main-container">
                    <div className="section-title section-title--white">
                        <h2 className="section-title__inner">Our partners</h2>
                    </div>
                    <div className="partners-section__body">
                        { circle_preview_boxes }
                    </div>
                </div>
            </section>
        )
    }
}

export default Partners