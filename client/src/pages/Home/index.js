import React from "react"
import { systemSetPage } from "../../store/system/actions"
import { connect } from "react-redux"
import { authSetUserId } from "../../store/auth/actions"
import '../scss/index.scss'
import Benefits from "./sections/Benefits/Benefits"
import HowItWorks from "./sections/HowItWorks/HowItWorks"
import WatchVillas from "./sections/WatchVillas/WatchVillas"
import AboutCompany from "./sections/AboutCompany/AboutCompany"
import Reliability from "./sections/Reliability/Reliability"
import Partners from "./sections/Partners/Partners"
import Advisors from "./sections/Advisors/Advisors"
import BannerT1 from "./sections/BannerT1/BannerT1"
import BannerT2 from "./sections/BannerT2/BannerT2"
import MainHome from "./sections/MainHome/MainHome"
import Property from "./sections/Property/Property"
import '../scss/media.scss'
import {toggleSingUpModalWithGTM} from "../../store/modals/actions"


class Home extends React.Component {

	componentWillMount() {
		this.props.systemSetPage("home")
	}

	toggleSignUp = () => {
		this.props.toggleSingUpModalWithGTM(!this.props.signUp)
	}

	scrollToTop = () => {
		window.scrollTo(0,0)
	}

	render() {
		return (
			<div className="home-page">
				<MainHome userId={ this.props.userId } toggleSignUp={ this.toggleSignUp } scrollToTop={ this.scrollToTop } />
				<Property />
				<Benefits scrollToTop={ this.scrollToTop } />
				<HowItWorks />
				<BannerT1 userId={ this.props.userId } toggleSignUp={ this.toggleSignUp } scrollToTop={ this.scrollToTop } />
				<AboutCompany />
				<Reliability scrollToTop={ this.scrollToTop } />
				<WatchVillas />
				<Partners />
				<Advisors />
				<BannerT2 userId={ this.props.userId } toggleSignUp={ this.toggleSignUp } scrollToTop={ this.scrollToTop } />
			</div>
		)
	}
}


const mapStateToProps = ({auth, modals}) => ({
	userId: auth.userId,
	signUp: modals.signUp
})

const mapDispatchToProps = {
	systemSetPage,
	authSetUserId,
	toggleSingUpModalWithGTM
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
