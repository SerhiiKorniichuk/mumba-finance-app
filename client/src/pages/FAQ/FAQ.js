import React from 'react'
import './FAQ.scss'
import { HashLink } from 'react-router-hash-link'
import FAQBlock from "./components/FAQBlock/FAQBlock"
import {BASIC_DATA} from "./data/basics"
import {PROPERTIES_DATA} from "./data/properties"
import {BLOCK_AND_CRYPT_DATA} from "./data/block_and_crypt"


function FAQ() {
    return (
        <section className="section faq-section">
            <div className="main-container">
                <div className="section-title">
                    <h2 className="section-title__inner">FAQ</h2>
                </div>
                <div className="faq-section__anchors">
                    <HashLink to="/faq#faq_basic_block" className="t1-btn t1-btn--purple-outline">
                        <span>Basic</span>
                    </HashLink>
                    <HashLink to="/faq#faq_properties_block" className="t1-btn t1-btn--purple-outline">
                        <span>Properties</span>
                    </HashLink>
                    <HashLink to="/faq#faq_block_and_crypt_block" className="t1-btn t1-btn--purple-outline">
                        <span>Blockchain & Cryptocurrency</span>
                    </HashLink>
                </div>
                <div className="faq-section__body">
                    <FAQBlock id="faq_basic_block" title="Basic" data={BASIC_DATA} />
                    <FAQBlock id="faq_properties_block" title="Properties" data={PROPERTIES_DATA} />
                    <FAQBlock id="faq_block_and_crypt_block" title="Blockchain & Cryptocurrency" data={BLOCK_AND_CRYPT_DATA} />
                </div>
            </div>
        </section>
    )
}

export default FAQ