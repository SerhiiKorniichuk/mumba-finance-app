import React, {useState} from 'react'
import './Accordion.scss'


function Accordion(props) {

    const [collapsed, setCollapsed] = useState(false)

    const toggleAccordion = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div className={`accordion ${collapsed ? '_active' : ''}`}>
            <div className="accordion__head" onClick={toggleAccordion}>
                <h3 className="accordion__title">{ props.title }</h3>
                <div className="accordion-toggle-btn" />
            </div>
            <div className="accordion__body">
                { props.body.map((item, index) => (
                    <div key={index} className="accordion__content">
                        { item.subTitle && <h3 className="accordion__mini-title">{ item.subTitle }</h3> }
                        { item.content && item.content.map(( item, index ) => (
                            <div key={index} className="accordion__box">
                                { typeof item === 'string' &&
                                <p key={index} className="accordion__paragraph" dangerouslySetInnerHTML={{__html: item}} />
                                }
                                { typeof item === 'object' && (
                                    <>
                                        { item.listDefault && (
                                            <ul key={index} className="accordion__ul">
                                                { item.listDefault.map((listItem, index) => (
                                                    <li
                                                        key={index}
                                                        className="accordion__li"
                                                        dangerouslySetInnerHTML={{__html: listItem}}
                                                    />
                                                ))}
                                            </ul>
                                        )}
                                        { item.listWithNumbers && (
                                            <div className="accordion__indexes-box">
                                                { item.listWithNumbers.map((listItem, index) => (
                                                    <p
                                                        key={index}
                                                        className="accordion__paragraph"
                                                        dangerouslySetInnerHTML={{__html: `${index + 1}. ${listItem}`}}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Accordion