import React from 'react'
import './FAQBlock.scss'
import Accordion from "../Accordion/Accordion"


function FAQBlock(props) {

    const faq_items_list = props.data && props.data.map((item, index) => {
        if (item && item.title && item.body) {
            return (
                <div key={index} className="faq-block__item">
                    <Accordion title={item.title} body={item.body} />
                </div>
            )
        }
        return null
    })

    return (
        <div className="faq-block" id={props.id ? props.id : ''}>
            { props.title && <h2 className="faq-block__title">{ props.title }</h2> }
            <div className="faq-block__body">
                { faq_items_list }
            </div>
        </div>
    )
}

export default FAQBlock