import React, {Component} from 'react'
import './MainHome.scss'
import {Link} from "react-router-dom"


class MainHome extends Component {
    render() {
        return (
            <section className="section main-home-section">
                <div className="main-container">
                    <div className="main-home-section__body">
                        <div className="main-home-section__background">
                            <img src={require("assets/img/main-home/main-home-bg-full.png")} alt="Background" />
                        </div>
                        <div className="main-home-section__info">
                            <h1 className="main-home-section__title">Mumba platform</h1>
                            <p className="main-home-section__description">
                                Become a new generation investor! Get the opportunity to buy/sell real estate from anywhere in a few minutes, because the liquidity of the property has increased hundreds of times. There is no need to manage objects, we take care of everything, and your dividends will be accrued automatically instant.
                            </p>
                            <div className="main-home-section__btn-box">
                                <a href="https://docs.google.com/presentation/d/1dxyvx-ZQgLJ9OXyXrd9Ku3aOBV-ZRNXlXIvjQ9wYBaY/edit#slide=id.gbcb4b8cd80_2_7" className="t1-btn t1-btn--purple-outline" target="_blank" rel="noopener noreferrer">Pitch Deck</a>
                                { this.props.userId
                                    ? <Link to="/dashboard" className="t1-btn t1-btn--purple" onClick={ this.props.scrollToTop }>Buy Token</Link>
                                    : <button className="t1-btn t1-btn--purple" onClick={ this.props.toggleSignUp }>Buy Token</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default MainHome