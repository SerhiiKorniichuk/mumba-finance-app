import React from "react";
import { Button, Card, Container, CardBody, Row, Col } from "reactstrap";
import { SITE_NAME } from "../../Config";
import CardImg from "reactstrap/es/CardImg";
import "./Styles.scss";
import { systemSetPage } from "../../store/system/actions";
import { connect } from "react-redux";
import { authSetUserId } from "../../store/auth/actions";
import CountDownTimer from "../../components/CountDownTimer/CountDownTimer";

class Home extends React.Component {
	componentWillMount() {
		this.props.systemSetPage("home")
		this.setState()
	}
	openSingUpPopup = () => {
		const singUpBtn = document.getElementById("singUpBtn");
		if (singUpBtn) {
			document.getElementById("singUpBtn").click();
		}
	}
	render() {
		return (
			<>
				{/* <div className="position-relative">
                    <section className="section section-lg bg-gradient-purple">
                        <Container className="py-lg-md d-flex">
                            <div className="col px-0">
                                <Row>
                                    <Col lg="12">
                                        <h1 className="display-3 text-white uppercase-text">
											{SITE_NAME} token
                                        </h1>
                                        <h4 className="display-5 text-white">
											The new generation of real estate investment based on blockchain technology.
											Combining the traditional real estate assets with blockchain technology, Mumba token has the volume of real estate assets and velocity, security of blockchain technologies.
                                        </h4>
                                        <div className="btn-wrapper mt-4">
                                            <a href="https://docs.google.com/presentation/d/1j7cgQZb3OlPtSxMHfaRomk7QU3LOAAD_Jqn6sC81QEk/edit?usp=sharing" className="mb-3 mb-sm-0 btn btn-white" color="white" target="_blank">
                                                <a href="https://docs.google.com/presentation/d/1j7cgQZb3OlPtSxMHfaRomk7QU3LOAAD_Jqn6sC81QEk/edit?usp=sharing" className="btn-inner--text" target="_blank">View pitch deck</a>
                                            </a>
                                            {!this.props.authData.auth.userId 
												? 	<Button className="mb-3 mb-sm-0 ml-1" color="success" onClick={this.openSingUpPopup}>
														<span className="btn-inner--text">Sing up</span>
													</Button>

												: 	false
											}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Container>

                        <div className="separator separator-bottom separator-skew">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="fill-white"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </section>
                </div> */}

				<section className='section bg-gradient-blue'>
					<Container>
						<Row className='text-center justify-content-center'>
							<Col lg='10'>
								<h2 className='display-3 text-white'>BENEFITS</h2>
							</Col>
						</Row>
						<Row className='row-grid mt-5'>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col lg='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary'>
											<img src={require('assets/img/benefit/benefit_1.svg')} alt='Icon' />
										</div>
									</Col>
									<Col lg='10' className='text-center text-lg-left'>
										<h5 className='text-white mt-3'>RECEIVING RENTAL PAYMENTS</h5>
										<p className='text-white mt-3'>
											We have already rented out most of our properties. 
											Using smart contracts, the resulting rent will be distributed to token holders, minus utilities and other overhead costs. 
											In this way, our digital tokens, which already have investment value, also become a source of passive income.
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col lg='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary'>
											<img src={require('assets/img/benefit/benefit_2.svg')} alt='Icon' />
										</div>
									</Col>
									<Col lg='10' className='text-center text-lg-left'>
										<h5 className='text-white mt-3'>INCREASED LIQUIDITY</h5>
										<p className='text-white mt-3'>
											With Securities Tokens enabling fractional ownership and thereby lowering minimum investments, more liquidity will come into the market. 
											As more people will be able to purchase smaller stakes, many assets that are considered to be illiquid, or not easily to (re)sell will increase their liquidity on the blockchain.
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col lg='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary'>
											<img src={require('assets/img/benefit/benefit_3.svg')} alt='Icon' />
										</div>
									</Col>
									<Col lg='10' className='text-center text-lg-left'>
										<h5 className='text-white mt-3'>LEGALLY</h5>
										<p className='text-white mt-3'>
											Tokens gives its holder a right of ownership and is subject to securities regulations. $100 USD per share = $100 USD per secure token. 
											Real estate shares and securities tokens are one and the same. Tokens fully comply with the requirements of Indonesian securities legislation. 
											Backed by the capital of the company, have real financial value. 
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col lg='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary'>
											<img src={require('assets/img/benefit/benefit_4.svg')} alt='Icon' />
										</div>
									</Col>
									<Col lg='10' className='text-center text-lg-left'>
										<h5 className='text-white mt-3'>AVAILABILITY</h5>
										<p className='text-white mt-3'>
											Mumba tokens accessible by anyone with an internet connection (within regulatory limits). 
											You can buy / sell a villa in Bali being anywhere at this time. 
											This democratize access to capital markets for companies and investors alike. 
											Become a real estate investor from $500.
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col lg='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary'>
											<img src={require('assets/img/benefit/benefit_5.svg')} alt='Icon' />
										</div>
									</Col>
									<Col lg='10' className='text-center text-lg-left'>
										<h5 className='text-white mt-3'>MUMBA PROPERTY MANAGEMENT</h5>
										<p className='text-white mt-3'>
											Mumba outsources Property Management to local professionals. 
											They are responsible for renting the property, collecting rental income, and maintaining or repairing the property. 
											Through tokenization the results of any inspection of the property, including its maintenance and repair history, will be stored in the blockchain forever.
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col lg='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary'>
											<img src={require('assets/img/benefit/benefit_6.svg')} alt='Icon' />
										</div>
									</Col>
									<Col lg='10' className='text-center text-lg-left'>
										<h5 className='text-white mt-3'>AUTOMATION & TRANSPARENCY</h5>
										<p className='text-white mt-3'>
											Automating allows receiving dividend payments instantly. Automated and quick KYC and AML process. 
											Blockchain allows a uniform method of verifying and tracking data and prevents tampering due to its immutability. 
											It becomes the perfect infrastructure to document ownership of securities in a fully transparent way. 
										</p>
									</Col>
								</Row>
							</Col>
						</Row>
					</Container>
				</section>

				<section className='section bg-gradient-white'>
					<Container>
						<Row className='text-center justify-content-center'>
							<Col lg='10'>
								<h2 className='display-3 '>HOW IT WORKS</h2>
							</Col>
						</Row>
						<Row className='row-grid mt-5 justify-content-center'>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>1</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											Investors must pass KYC (Known Your Customer) and AML
											(Anti Money Laundering) checks
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>2</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											Investors in the digital securities can be made in fiat or
											cryptocurrencies
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>3</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											Investors receives MBM with all associated rights
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>4</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											{SITE_NAME} invests in residential real estate in
											Indonesia
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>5</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											Investors will receive their quartely dividend in either
											USD or Bitcoin.
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>6</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											Investors can sell or trade their digital securities at
											any time on regulated exchanges or peer-to-peer
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-blue shadow rounded-circle text-primary'>
											<span className='text-white display-4'>7</span>
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<p className='m-0'>
											At termination, investor will receive the potential
											capital gains resulting from the property disposals
										</p>
									</Col>
								</Row>
							</Col>
							<Col lg='6' className='mt-3 mb-3'></Col>
						</Row>
					</Container>
				</section>

				<section className='section section-lg watch-villas-section'>
					<Container>
						<Row className='row-grid align-items-center'>
							<Col className='order-md-2' md='6'>
								<Row>
									<Col>
										<img
											alt='...'
											className='img-fluid img'
											src={require("assets/img/photos/square1.png")}
										/>
									</Col>
									<Col>
										<img
											alt='...'
											className='img-fluid img'
											src={require("assets/img/photos/square2.png")}
										/>
									</Col>
								</Row>
								<br />
								<Row>
									<Col>
										<img
											alt='...'
											className='img-fluid img'
											src={require("assets/img/photos/square3.png")}
										/>
									</Col>
									<Col>
										<img
											alt='...'
											className='img-fluid img'
											src={require("assets/img/photos/square4.png")}
										/>
									</Col>
								</Row>
							</Col>
							<Col className='order-md-1' md='6'>
								<div className='pr-md-5'>
									<h3>TOKENIZED REAL ESTATE</h3>
									<p>
										The first tokenized real estate is Nayla Boutique Villa. 
										It's tourist property on Bali with private pools, reception, wifi and room service. 
										Click the button if you want to know more about property highlights.
									</p>
								</div>
								<div className='btn-wrapper'>
									<a href='http://www.mumba.finance/ExcumNayla.pdf' target='_blank' className='t1-btn t1-btn--purple'>
										<span className='t1-btn__inner'>Explore more</span>
									</a>

									{/* <Button
										className='mb-3 mb-sm-0'
										color='success'
										href='http://www.mumba.finance/ExcumNayla.pdf'
										target='_blank'
									>
										<span className='btn-inner--text'>Explore more</span>
									</Button> */}
								</div>
							</Col>
						</Row>
					</Container>
				</section>

				<section
					className='section section-lg bg-gradient-purple'
					id='teams_section'
				>
					<Container>
						<Row className='text-center justify-content-center'>
							<Col lg='10'>
								<h2 className='display-3 text-white'>OUR PARTNERS</h2>
							</Col>
						</Row>
						<Row className='row-grid mt-5'>
							<Col lg='12'>
								<Row className='justify-content-center'>
									<Col
										lg='6'
										md='8'
										sm='10'
										xs='11'
										className='text-center mb-5 pr-lg-5 pr-md-0'
									>
										<Row className='align-items-center'>
											<Col>
												<a href='https://www.hujanholding.com/' target='_blank'>
													<img
														alt='Image'
														className='img-fluid shadow shadow rounded-circle img'
														src={require("assets/img/1.png")}
													/>
												</a>
											</Col>
											<Col>
												<a href='https://www.hujanholding.com/' target='_blank'>
													<h5 className='text-white'>
														Hujan Asset Management Ltd
													</h5>
												</a>
											</Col>
										</Row>
									</Col>
									<Col
										lg='6'
										md='8'
										sm='10'
										xs='11'
										className='text-center mb-5 pl-lg-5 pl-md-0'
									>
										<Row className='align-items-center'>
											<Col>
												<a
													href='http://www.mumba.finance/Ayla_Associates.pdf'
													target='_blank'
												>
													<img
														alt='Image'
														className='img-fluid shadow shadow rounded-circle img'
														src={require("assets/img/2.jpg")}
													/>
												</a>
											</Col>
											<Col>
												<a
													href='http://www.mumba.finance/Ayla_Associates.pdf'
													target='_blank'
												>
													<h5 className='text-white'>Ayla & Associates</h5>
												</a>
											</Col>
										</Row>
									</Col>
								</Row>
								<Row className='justify-content-center'>
									<Col
										lg='6'
										md='8'
										sm='10'
										xs='11'
										className='text-center mb-5 pr-lg-5 pr-md-0'
									>
										<Row className='align-items-center'>
											<Col>
												<a href='https://gpbtcentre.net/wp/' target='_blank'>
													<img
														alt='Image'
														className='img-fluid shadow shadow rounded-circle img'
														src={require("assets/img/3.png")}
													/>
												</a>
											</Col>
											<Col>
												<a href='https://gpbtcentre.net/wp/' target='_blank'>
													<h5 className='text-white'>
														Global Property Bank & Technology Centre
													</h5>
												</a>
											</Col>
										</Row>
									</Col>
									<Col
										lg='6'
										md='8'
										sm='10'
										xs='11'
										className='text-center mb-5 pl-lg-5 pl-md-0'
									>
										{/* <Row className="align-items-center">
											<Col>
												<a href="https://www.fiabci.org/" target="_blank">
													<img
														alt="Image"
														className="img-fluid shadow shadow rounded-circle img"
														src={require("assets/img/7.png")}
													/>
												</a>
											</Col>
											<Col>
												<a href="https://www.fiabci.org/" target="_blank">
													<h5 className="text-white">International Real Estate Federation</h5>
												</a>
											</Col>
										</Row> */}
									</Col>
								</Row>
								<Row className='justify-content-center'>
									<Col
										lg='6'
										md='8'
										sm='10'
										xs='11'
										className='text-center mb-5 pr-lg-5 pr-md-0'
									>
										<Row className='align-items-center'>
											<Col>
												<a
													href='https://worldwomenleadingchange.com/'
													target='_blank'
												>
													<img
														alt='Image'
														className='img-fluid shadow shadow rounded-circle img'
														src={require("assets/img/5.jpeg")}
													/>
												</a>
											</Col>
											<Col>
												<a
													href='https://worldwomenleadingchange.com/'
													target='_blank'
												>
													<h5 className='text-white'>
														World Women Leading Change
													</h5>
												</a>
											</Col>
										</Row>
									</Col>
									<Col
										lg='6'
										md='8'
										sm='10'
										xs='11'
										className='text-center mb-5 pl-lg-5 pl-md-0'
									>
										<Row className='align-items-center'>
											<Col>
												<a href='#' target='_blank'>
													<img
														alt='Image'
														className='img-fluid shadow shadow rounded-circle img'
														src={require("assets/img/4.png")}
													/>
												</a>
											</Col>
											<Col>
												<a href='#' target='_blank'>
													<h5 className='text-white'>Amerak Global</h5>
												</a>
											</Col>
										</Row>
									</Col>
								</Row>
							</Col>
						</Row>
					</Container>

					<section className='section section-lg pb-0'>
						<Container>
							<Row className='text-center justify-content-center'>
								<Col lg='10'>
									<h2 className='display-3 text-white'>OUR ADVISORS</h2>
								</Col>
							</Row>
							<Row className='row-grid mt-5'>
								<Col lg='12'>
									<Row className='justify-content-center'>
										<Col
											lg='6'
											md='8'
											sm='10'
											xs='11'
											className='text-center mb-5 pr-lg-5 pr-md-0'
										>
											<Row className='align-items-center'>
												<Col>
													<a
														href='https://www.hujanholding.com/'
														target='_blank'
													>
														<img
															alt='Image'
															className='img-fluid shadow shadow rounded-circle img'
															src={require("assets/img/6.png")}
														/>
													</a>
												</Col>
												<Col>
													<a
														href='https://id.linkedin.com/in/shintabubu'
														target='_blank'
													>
														<h5 className='text-white'>Shinta Dhanuwardoyo</h5>
													</a>
												</Col>
											</Row>
										</Col>
										<Col
											lg='6'
											md='8'
											sm='10'
											xs='11'
											className='text-center mb-4 pl-lg-5 pl-md-0'
										>
											{/* <Row className="align-items-center">
												<Col>
													<a href="https://fiabci.org/de/member-detail/14052" target="_blank">
														<img
															alt="Image"
															className="img-fluid shadow shadow rounded-circle img"
															src={require("assets/img/8.png")}
														/>
													</a>
												</Col>
												<Col>
													<a href="https://fiabci.org/de/member-detail/14052" target="_blank">
														<h5 className="text-white">Jordi Ribo Casanovas</h5>
													</a>
												</Col>
											</Row> */}
										</Col>
									</Row>
									<Row className='justify-content-center'>
										<Col
											lg='6'
											md='8'
											sm='10'
											xs='11'
											className='text-center mb-5 pr-lg-5 pr-md-0'
										>
											<Row className='align-items-center'>
												<Col>
													<a
														href='http://www.mumba.finance/Ayla_Dewi_Anggraeni.pdf'
														target='_blank'
													>
														<img
															alt='Image'
															className='img-fluid shadow shadow rounded-circle img'
															src={require("assets/img/9.png")}
														/>
													</a>
												</Col>
												<Col>
													<a
														href='http://www.mumba.finance/Ayla_Dewi_Anggraeni.pdf'
														target='_blank'
													>
														<h5 className='text-white'>Ayla Aldjufrie</h5>
													</a>
												</Col>
											</Row>
										</Col>
										<Col
											lg='6'
											md='8'
											sm='10'
											xs='11'
											className='text-center mb-4 pl-lg-5 pl-md-0'
										>
											<Row className='align-items-center'>
												<Col>
													<a
														href='http://www.mumba.finance/Julastina_Muktiwati.pdf'
														target='_blank'
													>
														<img
															alt='Image'
															className='img-fluid shadow shadow rounded-circle img'
															src={require("assets/img/10.png")}
														/>
													</a>
												</Col>
												<Col>
													<a
														href='http://www.mumba.finance/Julastina_Muktiwati.pdf'
														target='_blank'
													>
														<h5 className='text-white'>Julastina Muktiwati</h5>
													</a>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>
						</Container>
					</section>
				</section>

				<section className='section bg-secondary'>
					<Container>
						<Row className='row-grid align-items-center'>
							<Col md='6'>
								<Card className='bg-gray-dark shadow border-0'>
									<CardImg
										alt='Become Technology and Real Estate Investor'
										src={require("assets/img/graph.jpg")}
										top
									/>
									<blockquote className='card-blockquote'>
										<h4 className='display-4 font-weight-bold text-white'>
											Become Technology and Real Estate Investor
										</h4>
										<p className='lead text-italic text-white'>
											IT IS TIME FOR NEW OPPORTUNITIES
										</p>
									</blockquote>
								</Card>
							</Col>
							<Col md='6'>
								<div className='pl-md-5'>
									<h3>WHY REAL ESTATE?</h3>
									<p>
										The Residential Property Price Index has been increasing by
										an average of 4.5% per annum since 2002.
									</p>
									<p>
										In the long-term, property prices rise along with the real
										gross domestic product (GDP) growth.
									</p>
									<p>
										The World Bank forecasts real GDP growth of 5.2% to 5.4% per
										annum from 2019 to 2021 in Indonesia.
									</p>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
				
				<section className='section bg-secondary'>
					<Container>
						<Row className='text-center justify-content-center'>
							<Col lg='10'>
								<h2 className='display-3 '>Offering Summary</h2>
							</Col>
						</Row>

						<Row className='row-grid mt-5 justify-content-center align-items-center'>
							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-send text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Starting</h5>
										<p className='m-0'>
											April 5, 2021 (11:00AM CST). Pre-sale inquiries and offers
											are welcome
										</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-watch-time text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Ends</h5>
										<p className='m-0'>June 5, 2021 (11:00AM CST)</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-chat-round text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Number of shares (security tokens) for sale</h5>
										<p className='m-0'>25,500</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-money-coins text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Acceptable methods of funding subscription</h5>
										<p className='m-0'>
											Traditional: USD, IDR <br />
											Cryptocurrency: BTC, ETH
										</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-air-baloon text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Share Price & Tokens exchange rate</h5>
										<p className='m-0'>
											$100 USD per share / $100 USD per secure token. Real
											estate shares and security tokens are one and the same
										</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-chart-bar-32 text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Minimal investment amount</h5>
										<p className='m-0'>500$</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-bus-front-12 text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Minimal Cap</h5>
										<p className='m-0'>
											Min. Cap = 1,275,000 shares. All funds are held in reserve
											until Minimum Cap is reached.
										</p>
									</Col>
								</Row>
							</Col>

							<Col lg='6' className='mt-3 mb-3'>
								<Row className='align-items-center'>
									<Col xs='3' sm='2' className='d-flex justify-content-center'>
										<div className='icon icon-lg icon-shape bg-gradient-primary shadow rounded-circle text-primary'>
											<i className='ni ni-bus-front-12 text-white' />
										</div>
									</Col>
									<Col xs='9' sm='10'>
										<h5>Lock up period</h5>
										<p className='m-0'>6 month</p>
									</Col>
								</Row>
							</Col>
						</Row>

						<Row className='justify-content-center mt-5'>
							<Col lg='6'>
								<Card className='text-center shadow border-0'>
									<CardBody>
										<h5 className='text-primary text-center text-uppercase'>
											Time to invest
										</h5>
										<Row className='justify-content-center'>
											<CountDownTimer date='06/5/2021' />
											{!this.props.authData.auth.userId ? (
												<Col xs='10' className='mt-4'>
													<Button
														color='success'
														onClick={this.openSingUpPopup}
													>
														Purchase shares now
													</Button>
												</Col>
											) : null}
										</Row>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</Container>
				</section>
			</>
		);
	}
}

const mapStateToProps = (auth) => ({
	authData: auth,
});
const mapDispatchToProps = {
	systemSetPage,
	authSetUserId,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
