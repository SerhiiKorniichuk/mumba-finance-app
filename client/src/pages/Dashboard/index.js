import React from "react"
import {connect} from "react-redux"
import {authSetUserId, authSetUserPhoto} from "../../store/auth/actions"
import {systemSetPage} from "../../store/system/actions"
import {setSelectedTab} from "../../store/tabs/actions"
import {getTransactionsData} from '../../store/tabs/api'

import {Card, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap"
import {QUERY_VIEWER, MUTATION_PROFILE_PHOTO_UPLOAD, MUTATION_PROFILE_PHOTO_DELETE} from "../../helpers/Api/Schema"
import UserAvatar from "react-user-avatar"
import Badge from "reactstrap/es/Badge"
import "./Styles.css"
import {Redirect} from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import {authDataDelete} from "../../helpers/AuthUtils"
import {Query, Mutation} from "react-apollo"
import Verification from "../../components/Modal/Verification"
import {CloseOutlined} from "@material-ui/icons"
import {TabList, Tabs, Tab, TabPanel} from "react-tabs"
import "react-tabs/style/react-tabs.css"
import axios from "../../Api"
import {Modal} from "reactstrap"
import TagManager from "react-gtm-module"
import { gtmEvent, tmSuccessBuyToken } from '../../helpers/GTM/events'


class Dashboard extends React.Component {

    state = {
        changePhotoDropDown: false,
        changedPhoto: null,
        verificationModal: false,
        withdrawalModal: false,
        paymentModal: false,
        tokenBalance: 0,
        paymentCur: 0,
        currencySymbol: "",
        baseAmount: 0,
        finalPaymentAmount: 0,
        accessToken: ''
    }

    uploadInput = React.createRef()

    componentWillMount() {
        const authData = JSON.parse(localStorage.getItem("authData"))
        if (authData) this.setState({ accessToken: authData.accessToken })
        this.props.systemSetPage("dashboard")
    }

    componentDidMount() {
        const url = new URL(window.location.href)

        const tmEvent = url.searchParams.get('event')
        const tmEventCategory = url.searchParams.get('eventCategory')
        const tmMbmCount = url.searchParams.get('mbm_count')
        const tmHowToPay= url.searchParams.get('howtopay')
        const tmCurrencyValue = url.searchParams.get('currency_value')
        const tmEventLabel = url.searchParams.get('eventLabel')

        if (tmEvent === 'gtm_event_buytoken') {
            console.log('gtm_event_buytoken')
            setTimeout(() => {
                console.log(tmSuccessBuyToken(tmEvent, tmEventCategory, tmMbmCount, tmHowToPay, tmCurrencyValue, tmEventLabel))
                TagManager.dataLayer(tmSuccessBuyToken(tmEvent, tmEventCategory, tmMbmCount, tmHowToPay, tmCurrencyValue, tmEventLabel))
            }, 1000)
        }

        axios.post("fetchUserBalance.php")
            .then(response => {
                if (response.data.status === true) {
                    this.setState({ tokenBalance: response.data.balance })
                }
            })
            .catch(({error}) => {
                return <Redirect to='/' />
            })
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.state.changedPhoto !== nextState.changedPhoto) {
            this.props.authSetUserPhoto(nextState.changedPhoto)
        }
    }

    toggleChangePhotoDropDown = () => {
        this.setState((prevState) => ({
            changePhotoDropDown: !prevState.changePhotoDropDown
        }))
    }

    uploadPhoto = (e) => {
        this.uploadInput.current.click()
    }

    getChangePhotoDropDown = (hasPhoto) => {
        return (
            <Dropdown
                className='Dashboard--Upload-avatar'
                isOpen={this.state.changePhotoDropDown}
                toggle={this.toggleChangePhotoDropDown}
            >
                <DropdownToggle
                    tag='span'
                    className='bg-gradient-blue Dashboard--Upload-avatar shadow rounded-circle'
                >
                    <div>
                        <i className='fa fa-image'/>
                    </div>
                </DropdownToggle>
                <DropdownMenu style={{marginTop: 10}}>
                    <Mutation mutation={MUTATION_PROFILE_PHOTO_UPLOAD}>
                        {(mutate, {data, loading, error}) => {
                            if (loading) {
                                return (
                                    <DropdownItem>
                                        <Skeleton/>
                                    </DropdownItem>
                                )
                            } else if (error) {
                                return (
                                    <DropdownItem className='text-warning'>
                                        {error.graphQLErrors.map(({message}, i) => message)}
                                    </DropdownItem>
                                )
                            } else if (data) {
                                this.setState({
                                    changedPhoto: data.profilePhotoUpload,
                                    changePhotoDropDown: false,
                                })
                            }
                            return (
                                <DropdownItem onClick={this.uploadPhoto}>
                                    Upload photo
                                    <input
                                        style={{ visibility: "hidden", display: "none" }}
                                        type='file'
                                        required
                                        ref={this.uploadInput}
                                        onChange={({ target: { validity, files: [file] }}) => {
                                            return validity.valid && mutate({variables: {file}})
                                        }}
                                    />
                                </DropdownItem>
                            )
                        }}
                    </Mutation>
                    <Mutation mutation={MUTATION_PROFILE_PHOTO_DELETE}>
                        {(mutate, {data, loading, error}) => {
                            if (loading) {
                                return (
                                    <DropdownItem>
                                        <Skeleton/>
                                    </DropdownItem>
                                )
                            } else if (error) {
                                return (
                                    <DropdownItem className='text-warning'>
                                        {error.graphQLErrors.map(({message}, i) => message)}
                                    </DropdownItem>
                                )
                            } else if (data) {
                                this.setState({
                                    changedPhoto: false,
                                    changePhotoDropDown: false,
                                })
                            } else if (
                                this.state.changedPhoto ||
                                (hasPhoto && this.state.changedPhoto === null)
                            ) {
                                return (
                                    <DropdownItem
                                        className='text-warning'
                                        toggle={false}
                                        onClick={(e) => mutate()}
                                    >
                                        Remove current photo
                                    </DropdownItem>
                                )
                            }
                            return <></>
                        }}
                    </Mutation>
                </DropdownMenu>
            </Dropdown>
        );
    }

    setFinalPaymentWithPercents = (coefficient) => {
        const tokenQty = document.getElementById("tokenQty").value
        if (tokenQty !== 0) {
            this.setState({
                finalPaymentAmount:
                    (parseFloat(this.state.baseAmount) +
                        parseFloat(
                            parseFloat(this.state.baseAmount) *
                            parseFloat(coefficient)
                        )) *
                    parseFloat(tokenQty)
            })
        }
    }

    roundPlus = (x, n) => {
        //x - число, n - количество знаков
        if (isNaN(x) || isNaN(n)) return false
        const m = Math.pow(10, n)
        return Math.round(x * m) / m
    }

    render() {

        if (!this.props.userId) {
            return <Redirect to='/' />
        }

        let {
            changedPhoto,
            verificationModal,
            withdrawalModal,
            paymentModal,
            tokenBalance,
            paymentCur,
            currencySymbol,
            baseAmount,
            finalPaymentAmount,
            accessToken,
        } = this.state


        if (isNaN(finalPaymentAmount)) {
            finalPaymentAmount = 0
        }

        let finalPaymentAmountForView = 0

        if (currencySymbol === 'BTC') {
            finalPaymentAmountForView = this.roundPlus(finalPaymentAmount, 6)
        } else if (currencySymbol === 'ETH') {
            finalPaymentAmountForView = this.roundPlus(finalPaymentAmount, 5)
        } else if (currencySymbol === 'USD' || currencySymbol === 'IDR') {
            finalPaymentAmountForView = this.roundPlus(finalPaymentAmount, 0)
        }

        return (
            <>
                <section className='section section-lg bg-gradient-secondary'>
                    <Query query={QUERY_VIEWER}>
                        {({loading, error, data, refetch}) => {
                            if (!loading && (!data || !data.viewer)) {
                                authDataDelete()
                                this.props.authSetUserId(0)
                                return <Redirect to='/'/>
                            }
                            return (
                                <Row>
                                    <Tabs
                                        style={{display: "contents"}}
                                        selectedIndex={this.props.selectedTab}
                                        onSelect={(index) => {
                                            this.props.setSelectedTab(index)
                                        }}
                                    >
                                        <div className='row col-12 react_tabs__row mobileTabs'>
                                            <div className='d-flex w-100 justify-content-center'>
                                                <TabList>
                                                    <Tab>
                                                        <svg
                                                            className='walletIcon'
                                                            viewBox='0 0 22 22'
                                                            fill='none'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                        >
                                                            <path
                                                                d='M19.4219 5.19922V1.33203H2.57812C1.15655 1.33203 0 2.48858 0 3.91016V17.4453C0 19.2223 1.44568 20.668 3.22266 20.668H22V5.19922H19.4219ZM2.57812 2.62109H18.1328V5.19922H2.57812C1.86734 5.19922 1.28906 4.62095 1.28906 3.91016C1.28906 3.19937 1.86734 2.62109 2.57812 2.62109ZM20.7109 15.5117H17.4883C16.4221 15.5117 15.5547 14.6443 15.5547 13.5781C15.5547 12.5119 16.4221 11.6445 17.4883 11.6445H20.7109V15.5117ZM20.7109 10.3555H17.4883C15.7113 10.3555 14.2656 11.8012 14.2656 13.5781C14.2656 15.3551 15.7113 16.8008 17.4883 16.8008H20.7109V19.3789H3.22266C2.15647 19.3789 1.28906 18.5115 1.28906 17.4453V6.14144C1.66861 6.36157 2.10869 6.48828 2.57812 6.48828C3.5212 6.48828 19.32 6.48828 20.7109 6.48828V10.3555Z'
                                                                fill='#6071E4'
                                                            />
                                                            <path
                                                                d='M18.1328 12.9336H16.8438V14.2227H18.1328V12.9336Z'
                                                                fill='#6071E4'
                                                            />
                                                        </svg>
                                                        {" "}
                                                        <span className='balanceTabText'>Balance</span>
                                                    </Tab>
                                                    <Tab>
                                                        <svg
                                                            className='profitIcon'
                                                            viewBox='0 0 22 22'
                                                            fill='none'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                        >
                                                            <path
                                                                d='M21.3555 20.7109H1.28906V0.644531C1.28906 0.288578 1.00048 0 0.644531 0C0.288578 0 0 0.288578 0 0.644531V21.3555C0 21.7114 0.288578 22 0.644531 22H21.3555C21.7114 22 22 21.7114 22 21.3555C22 20.9995 21.7114 20.7109 21.3555 20.7109Z'
                                                                fill='#AAAAAA'
                                                            />
                                                            <path
                                                                d='M3.22266 14.1797C2.8667 14.1797 2.57812 14.4683 2.57812 14.8242V18.7773C2.57812 19.1333 2.8667 19.4219 3.22266 19.4219H5.84375C6.1997 19.4219 6.48828 19.1333 6.48828 18.7773V14.8242C6.48828 14.4683 6.1997 14.1797 5.84375 14.1797H3.22266ZM5.19922 18.1328H3.86719V15.4688H5.19922V18.1328Z'
                                                                fill='#AAAAAA'
                                                            />
                                                            <path
                                                                d='M8.42188 11.6016C8.06592 11.6016 7.77734 11.8901 7.77734 12.2461V18.7773C7.77734 19.1333 8.06592 19.4219 8.42188 19.4219H11C11.356 19.4219 11.6445 19.1333 11.6445 18.7773V12.2461C11.6445 11.8901 11.356 11.6016 11 11.6016H8.42188ZM10.3555 18.1328H9.06641V12.8906H10.3555V18.1328Z'
                                                                fill='#AAAAAA'
                                                            />
                                                            <path
                                                                d='M13.5781 9.02344C13.2222 9.02344 12.9336 9.31202 12.9336 9.66797V18.7773C12.9336 19.1333 13.2222 19.4219 13.5781 19.4219H16.1562C16.5122 19.4219 16.8008 19.1333 16.8008 18.7773V9.66797C16.8008 9.31202 16.5122 9.02344 16.1562 9.02344H13.5781ZM15.5117 18.1328H14.2227V10.3125H15.5117V18.1328Z'
                                                                fill='#AAAAAA'
                                                            />
                                                            <path
                                                                d='M21.3555 6.44531H18.7344C18.3784 6.44531 18.0898 6.73389 18.0898 7.08984V18.7773C18.0898 19.1333 18.3784 19.4219 18.7344 19.4219H21.3555C21.7114 19.4219 22 19.1333 22 18.7773V7.08984C22 6.73389 21.7114 6.44531 21.3555 6.44531ZM20.7109 18.1328H19.3789V7.73438H20.7109V18.1328Z'
                                                                fill='#AAAAAA'
                                                            />
                                                            <path
                                                                d='M18.4462 5.08823C18.7649 5.24764 19.1519 5.11792 19.3109 4.8L20.5999 2.22187C20.6998 2.02211 20.6892 1.78479 20.5717 1.59479C20.4543 1.40473 20.2468 1.28906 20.0235 1.28906H16.8008C16.4449 1.28906 16.1563 1.57764 16.1563 1.93359C16.1563 2.28955 16.4449 2.57812 16.8008 2.57812H17.4612L2.91769 10.3892C2.6041 10.5576 2.48641 10.9484 2.65485 11.262C2.77116 11.4786 2.99348 11.6017 3.22324 11.6017C3.32619 11.6017 3.43065 11.5769 3.52767 11.5249L18.5382 3.46294L18.1579 4.22348C17.9987 4.54188 18.1278 4.92899 18.4462 5.08823Z'
                                                                fill='#AAAAAA'
                                                            />
                                                        </svg>
                                                        {" "}
                                                        <span className='profitTabText'>Profit</span>
                                                    </Tab>
                                                    <Tab onClick={() => getTransactionsData()}>
                                                        <svg
                                                            className='transactionIcon'
                                                            viewBox='0 0 22 22'
                                                            fill='none'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                        >
                                                            <path
                                                                d='M15.4 15.4C15.1976 15.4 15.0334 15.5642 15.0334 15.7667V16.8667H3.66671C3.46422 16.8667 3.30004 17.0308 3.30004 17.2333C3.30004 17.4358 3.46422 17.6 3.66671 17.6H15.0334V20.1667C15.0334 20.7741 14.5408 21.2667 13.9334 21.2667H3.66671C3.05924 21.2667 2.56671 20.7741 2.56671 20.1667V1.83333C2.56671 1.22586 3.05924 0.733333 3.66671 0.733333H13.9334C14.5408 0.733333 15.0334 1.22586 15.0334 1.83333V4.03333C15.0334 4.23582 15.1976 4.4 15.4 4.4C15.6025 4.4 15.7667 4.23582 15.7667 4.03333V1.83333C15.7667 0.820882 14.9458 0 13.9334 0H3.66671C2.65426 0 1.83337 0.820882 1.83337 1.83333V20.1667C1.83337 21.1791 2.65426 22 3.66671 22H13.9334C14.9458 22 15.7667 21.1791 15.7667 20.1667V15.7667C15.7667 15.5642 15.6025 15.4 15.4 15.4Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M10.2666 19.0667C10.4691 19.0667 10.6333 18.9025 10.6333 18.7C10.6333 18.4975 10.4691 18.3333 10.2666 18.3333H7.33331C6.92833 18.3333 6.59998 18.6617 6.59998 19.0667V19.8C6.59998 20.205 6.92833 20.5333 7.33331 20.5333H10.2666C10.4691 20.5333 10.6333 20.3692 10.6333 20.1667C10.6333 19.9642 10.4691 19.8 10.2666 19.8H7.33331V19.0667H10.2666Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M15.4 11.7333C14.995 11.7333 14.6667 11.405 14.6667 11C14.6667 10.7975 14.5025 10.6333 14.3 10.6333C14.0975 10.6333 13.9333 10.7975 13.9333 11C13.9355 11.6671 14.3876 12.2486 15.0333 12.4153V12.8333C15.0333 13.0358 15.1975 13.2 15.4 13.2C15.6025 13.2 15.7667 13.0358 15.7667 12.8333V12.4153C16.4728 12.2235 16.9297 11.5407 16.8373 10.8149C16.7449 10.0889 16.1317 9.54211 15.4 9.53334C14.995 9.53334 14.6667 9.20499 14.6667 8.80001C14.6667 8.39503 14.995 8.06667 15.4 8.06667C15.805 8.06667 16.1333 8.39503 16.1333 8.80001C16.1333 9.0025 16.2975 9.16667 16.5 9.16667C16.7025 9.16667 16.8667 9.0025 16.8667 8.80001C16.8645 8.13292 16.4125 7.55141 15.7667 7.38472V6.96667C15.7667 6.76418 15.6025 6.60001 15.4 6.60001C15.1975 6.60001 15.0333 6.76418 15.0333 6.96667V7.38472C14.3272 7.57647 13.8703 8.25932 13.9627 8.98513C14.0551 9.71112 14.6683 10.2579 15.4 10.2667C15.805 10.2667 16.1333 10.595 16.1333 11C16.1333 11.405 15.805 11.7333 15.4 11.7333Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M15.4 5.13333C13.8517 5.13262 12.3996 5.88403 11.5058 7.14821C10.6119 8.41238 10.3879 10.0319 10.9048 11.4913C10.9725 11.6827 11.1826 11.7829 11.374 11.7151C11.5654 11.6472 11.6655 11.437 11.5976 11.2456C11.444 10.8136 11.3658 10.3585 11.3667 9.89999C11.3674 7.97589 12.727 6.31998 14.6144 5.94526C16.5016 5.57054 18.391 6.58102 19.1268 8.35885C19.8627 10.1369 19.2402 12.1868 17.6399 13.2555C16.0397 14.3242 13.9076 14.1136 12.5474 12.7526C12.4019 12.6282 12.1851 12.6364 12.0495 12.7719C11.9142 12.9073 11.9058 13.1243 12.0304 13.2696C13.5558 14.7959 15.9162 15.1069 17.785 14.0282C19.6536 12.9493 20.5647 10.7497 20.0057 8.66554C19.447 6.58138 17.5578 5.13262 15.4 5.13333Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M6.96665 6.96666H9.53332C9.73581 6.96666 9.89998 6.80248 9.89998 6.6C9.89998 6.39751 9.73581 6.23333 9.53332 6.23333H7.33332V5.86666C7.33296 5.72558 7.25168 5.59739 7.12438 5.5367C6.99816 5.47672 6.84884 5.49391 6.73927 5.58074L4.90594 7.04741C4.81929 7.11687 4.7688 7.22215 4.7688 7.33333C4.7688 7.44451 4.81929 7.54978 4.90594 7.61925L6.73927 9.08591C6.80391 9.13783 6.88394 9.16612 6.96665 9.16666C7.02144 9.16755 7.0755 9.15502 7.12438 9.12995C7.25168 9.06926 7.33296 8.94107 7.33332 8.79999V8.43332H9.53332C9.73581 8.43332 9.89998 8.26915 9.89998 8.06666C9.89998 7.86417 9.73581 7.69999 9.53332 7.69999H6.96665C6.77508 7.69946 6.61538 7.84644 6.59998 8.0373L5.72002 7.33333L6.59998 6.62936C6.61538 6.82021 6.77508 6.9672 6.96665 6.96666Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M7.54233 13.53C7.5912 13.555 7.64527 13.5676 7.70006 13.5667C7.78277 13.5661 7.8628 13.5378 7.92743 13.4859L9.76077 12.0192C9.84742 11.9498 9.89791 11.8445 9.89791 11.7333C9.89791 11.6221 9.84742 11.5169 9.76077 11.4474L7.92743 9.98074C7.81786 9.8939 7.66855 9.87672 7.54233 9.93669C7.41503 9.99739 7.33375 10.1256 7.33339 10.2667V10.6333H5.13339C4.9309 10.6333 4.76672 10.7975 4.76672 11C4.76672 11.2025 4.9309 11.3667 5.13339 11.3667H7.70006C7.89163 11.3672 8.05133 11.2202 8.06672 11.0294L8.94669 11.7333L8.06672 12.4373C8.05133 12.2464 7.89163 12.0995 7.70006 12.1H5.13339C4.9309 12.1 4.76672 12.2642 4.76672 12.4667C4.76672 12.6691 4.9309 12.8333 5.13339 12.8333H7.33339V13.2C7.33375 13.3411 7.41503 13.4693 7.54233 13.53Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M4.76666 2.20001C4.76666 2.4025 4.60248 2.56668 4.39999 2.56668C4.1975 2.56668 4.03333 2.4025 4.03333 2.20001C4.03333 1.99752 4.1975 1.83334 4.39999 1.83334C4.60248 1.83334 4.76666 1.99752 4.76666 2.20001Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M6.23333 2.20001C6.23333 2.4025 6.06916 2.56668 5.86667 2.56668C5.66418 2.56668 5.5 2.4025 5.5 2.20001C5.5 1.99752 5.66418 1.83334 5.86667 1.83334C6.06916 1.83334 6.23333 1.99752 6.23333 2.20001Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M12.1 4.76666C12.1 4.56417 11.9358 4.39999 11.7333 4.39999H9.53329C9.3308 4.39999 9.16663 4.56417 9.16663 4.76666C9.16663 4.96915 9.3308 5.13333 9.53329 5.13333H11.7333C11.9358 5.13333 12.1 4.96915 12.1 4.76666Z'
                                                                fill='#7D7D7D'
                                                            />
                                                            <path
                                                                d='M8.43332 15.4H11C11.2025 15.4 11.3667 15.2358 11.3667 15.0333C11.3667 14.8308 11.2025 14.6667 11 14.6667H8.43332C8.23083 14.6667 8.06665 14.8308 8.06665 15.0333C8.06665 15.2358 8.23083 15.4 8.43332 15.4Z'
                                                                fill='#7D7D7D'
                                                            />
                                                        </svg>
                                                        {" "}
                                                        <span className='transactionsTabText'>
															Transactions
														</span>
                                                    </Tab>
                                                </TabList>
                                            </div>
                                        </div>
                                        <Col lg='4' className='pt-5 profileBlock'>
                                            {!loading && !error && data ?
                                                <Verification
                                                    isOpen={verificationModal}
                                                    data={data ? data : {}}
                                                    onClose={() =>
                                                        this.setState({ verificationModal: false })
                                                    }
                                                    reFetch={() => refetch()}
                                                />
                                                : ""
                                            }
                                            <Card className='mb-3 sidebar__card'>
                                                <div className='mt-4'>
                                                    <div
                                                        className='rounded-circle text-white img-center Dashboard--Avatar shadow'>
                                                        { loading ?
                                                            <div className='Dashboard--Avatar-Placeholder'>
                                                                <Skeleton width='150px' height='150px' circle={true} />
                                                            </div>
                                                            : <>
                                                                {this.getChangePhotoDropDown(data.viewer.photo)}
                                                                <UserAvatar
                                                                    src={
                                                                        changedPhoto !== null
                                                                            ? changedPhoto
                                                                            : data.viewer.photo
                                                                    }
                                                                    size='150'
                                                                    name={`${data.viewer.firstName} ${data.viewer.lastName}`}
                                                                />
                                                            </>
                                                        }
                                                    </div>
                                                    <div className='p-4 text-center'>
                                                        <h5 className='title'>
															<span className='d-block mb-1'>
																{ loading
                                                                    ? <Skeleton/>
                                                                    : `${data.viewer.firstName} ${data.viewer.lastName}`
                                                                }
															</span>
                                                            <small className='h6 text-muted'>
                                                                { loading
                                                                    ? <Skeleton/>
                                                                    : data.viewer.isVerified ?
                                                                        <Badge
                                                                            color='success'
                                                                            className='text-white badgeColor bg-gradient-success'
                                                                        >
                                                                            Account verified
                                                                        </Badge>
                                                                        : ""
                                                                }
                                                                { loading
                                                                    ? <Skeleton/>
                                                                    : !data.viewer.isVerified && data.viewer.verified.status === 0 ?
                                                                        <Badge
                                                                            color='danger'
                                                                            className='text-white badgeColor bg-gradient-danger'
                                                                        >
                                                                            Account not verified
                                                                        </Badge>
                                                                        : ""
                                                                }
                                                                { loading
                                                                    ? <Skeleton/>
                                                                    : !data.viewer.isVerified && data.viewer.verified.status === 1 ?
                                                                        <Badge
                                                                            color='info'
                                                                            className='text-white badgeColor bg-gradient-info'
                                                                        >
                                                                            Verification request is pending
                                                                        </Badge>
                                                                        : ""
                                                                }
                                                                { loading
                                                                    ? <Skeleton/>
                                                                    : !data.viewer.isVerified && data.viewer.verified.status === 2 ?
                                                                        <Badge
                                                                            color='info'
                                                                            className='text-white badgeColor bg-gradient-warning'
                                                                        >
                                                                            Verification request declined
                                                                        </Badge>
                                                                        : ""
                                                                }
                                                            </small>
                                                            <div className='mt-3'>
                                                                { loading
                                                                    ? <Skeleton/>
                                                                    : !data.viewer.isVerified && data.viewer.verified.status === 0 ?
                                                                        <button
                                                                            className="blank-btn"
                                                                            onClick={() =>
                                                                                this.setState({ verificationModal: true })
                                                                            }
                                                                        >
                                                                            Pass Verification
                                                                        </button>
                                                                        : ""
                                                                }
                                                                { loading
                                                                    ? <Skeleton/>
                                                                    : !data.viewer.isVerified && data.viewer.verified.status === 2 ?
                                                                        <button
                                                                            className="blank-btn"
                                                                            onClick={() =>
                                                                                this.setState({ verificationModal: true })
                                                                            }
                                                                        >
                                                                            View decline message
                                                                        </button>
                                                                        : ""
                                                                }
                                                            </div>
                                                        </h5>
                                                    </div>
                                                    <div className='p-2 text-center'>
                                                        <button
                                                            className="blank-btn sidebarButton"
                                                            onClick={() => {
                                                                this.setState({
                                                                    paymentModal: true,
                                                                    paymentCur: 4
                                                                })
                                                                axios.post("fetchExchangeRate.php")
                                                                    .then(({data}) => {
                                                                        this.setState({
                                                                            baseAmount: this.roundPlus(data.USD, 0),
                                                                            currencySymbol: "USD",
                                                                            finalPaymentAmount: 0
                                                                        })
                                                                    })
                                                            }}
                                                        >
                                                            <svg
                                                                className='mr-2'
                                                                width='30'
                                                                height='30'
                                                                viewBox='0 0 30 30'
                                                                fill='none'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                            >
                                                                <g clipPath='url(#clip0)'>
                                                                    <path
                                                                        d='M12.6288 24.1021C11.2465 24.1021 10.1216 25.2275 10.1216 26.6092C10.1216 27.9915 11.2465 29.1164 12.6288 29.1164C14.0111 29.1164 15.1359 27.9915 15.1359 26.6092C15.1359 25.227 14.0111 24.1021 12.6288 24.1021ZM12.6288 28.0021C11.861 28.0021 11.2359 27.3775 11.2359 26.6092C11.2359 25.8415 11.861 25.2164 12.6288 25.2164C13.3965 25.2164 14.0217 25.8415 14.0217 26.6092C14.0217 27.3775 13.3965 28.0021 12.6288 28.0021Z'
                                                                        fill='#828282'
                                                                        stroke='#828282'
                                                                    />
                                                                    <path
                                                                        d='M23.828 24.1021C22.4462 24.1021 21.3208 25.2275 21.3208 26.6092C21.3208 27.9915 22.4462 29.1164 23.828 29.1164C25.2102 29.1164 26.3351 27.9915 26.3351 26.6092C26.3351 25.227 25.2102 24.1021 23.828 24.1021ZM23.828 28.0021C23.0608 28.0021 22.4351 27.3775 22.4351 26.6092C22.4351 25.8415 23.0608 25.2164 23.828 25.2164C24.5963 25.2164 25.2208 25.8415 25.2208 26.6092C25.2208 27.3775 24.5957 28.0021 23.828 28.0021Z'
                                                                        fill='#828282'
                                                                        stroke='#828282'
                                                                    />
                                                                    <path
                                                                        d='M27.0054 8.453L26.9502 8.44186L23.906 8.45969C23.6692 8.43684 23.3783 8.44074 23.2402 8.45969L18.7396 8.48197L14.2874 8.46303C14.0439 8.43796 13.7448 8.44019 13.6205 8.4569L10.5222 8.44186L10.4671 8.453C9.32716 8.67864 8.41232 9.40795 7.90699 10.3629L5.74249 1.17781C5.68399 0.925422 5.45946 0.883636 5.19983 0.883636H0.557144C0.249601 0.883636 0 1.13324 0 1.44078C0 1.74888 0.249601 1.99793 0.557144 1.99793H4.75746L8.77558 19.1658C8.77614 19.1691 8.77781 19.1028 8.77892 19.1056C9.08591 20.6026 10.2531 21.708 11.7563 21.9794C11.8232 21.9972 11.89 21.9983 11.9585 22.0117L12.0143 22.0145L12.3692 22.0083L12.3664 21.449L12.4405 22.0055L18.7345 21.9732L25.0347 22.005L25.037 21.4473L25.1055 22.0044L25.4609 22.0067L25.5172 21.995C25.5857 21.9816 25.652 21.9626 25.7128 21.9448C27.231 21.6729 28.4043 20.5208 28.7035 19.0109L29.9298 12.8205C30.3265 10.8108 29.015 8.85136 27.0054 8.453ZM28.8356 12.6043L27.6082 18.7947C27.3993 19.8511 26.5769 20.6578 25.5144 20.8483L25.4264 20.8695C25.4002 20.8768 25.3724 20.884 25.3451 20.8907L18.7334 20.8578L12.1274 20.8907C12.1001 20.884 12.0733 20.8768 12.046 20.8695L11.9585 20.8483C10.8955 20.6578 10.0737 19.8522 9.86424 18.7947L8.63741 12.6043C8.36218 11.2148 9.25417 9.85923 10.632 9.55726L13.669 9.56896C13.8339 9.55447 13.9509 9.55113 14.2267 9.57453L18.7396 9.59682L23.3015 9.57175C23.4714 9.55447 23.5811 9.55169 23.8586 9.57175L26.8415 9.55726C28.2183 9.85923 29.1102 11.2142 28.8356 12.6043Z'
                                                                        fill='#828282'
                                                                        stroke='#828282'
                                                                    />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id='clip0'>
                                                                        <rect width='30' height='30' fill='white'/>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            <span>Buy Token</span>
                                                        </button>
                                                        <br/>
                                                        <button
                                                            className='blank-btn sidebarButton'
                                                            onClick={() =>
                                                                this.setState({ withdrawalModal: true })
                                                            }
                                                        >
                                                            <svg
                                                                className='mr-2'
                                                                width='30'
                                                                height='30'
                                                                viewBox='0 0 30 30'
                                                                fill='none'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                            >
                                                                <g clipPath='url(#clip0)'>
                                                                    <path
                                                                        d='M27.3182 16.5244H24.5409V9.16928C24.5409 8.65048 24.1202 8.22985 23.6014 8.22985H16.8821L11.4722 0.404844C11.099 -0.134977 10.2998 -0.134919 9.92672 0.404844L1.90907 12.0018C1.47964 12.6232 1.92422 13.4755 2.68182 13.4755H5.45913V20.8307C5.45913 21.3495 5.87976 21.7701 6.39856 21.7701H13.1179L18.5278 29.5951C18.9011 30.1349 19.7002 30.1349 20.0733 29.5951L28.0909 17.9981C28.5204 17.3768 28.0758 16.5244 27.3182 16.5244ZM7.33805 19.8913V12.5361C7.33805 12.0173 6.91742 11.5967 6.39862 11.5967H4.47343L10.6995 2.59102L16.9256 11.5967H15.0004C14.4816 11.5967 14.061 12.0173 14.061 12.5361V16.5244H11.283C10.5277 16.5244 10.0794 17.375 10.5102 17.9981L11.819 19.8913H7.33805ZM19.3005 27.409L13.0745 18.4034H15.0004C15.5192 18.4034 15.9398 17.9827 15.9398 17.4639V13.4756H18.7171C19.4738 13.4756 19.9198 12.6239 19.4898 12.0019L18.181 10.1088C18.1869 10.1135 17.9883 10.1088 22.662 10.1088V17.4639C22.662 17.9827 23.0826 18.4034 23.6014 18.4034H25.5266L19.3005 27.409Z'
                                                                        fill='#828282'
                                                                    />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id='clip0'>
                                                                        <rect width='30' height='30' fill='white'/>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            <span>Withdrawal</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col lg='8'>
                                            <Row className='justify-content-left m-3'>
                                                <TabPanel className='pt-5 col-12 balanceTabPanel'>
                                                    <h4 className='TitleStyle BalanceTitle'>Balance</h4>
                                                    <Row className='balance_other__card_row col-12'>
                                                        <Col lg='12' xl='8' className='p-3'>
                                                            <div className='p-3 balance_mt__card mbmCard'>
                                                                <Col
                                                                    lg='12'
                                                                    md='12'
                                                                    className='balance_mt__card_block'
                                                                >
                                                                    <Col sm='6'>
																		<span className='balance_mt__card_title'>
																			Mumba Token
																		</span>
                                                                        <br/>
                                                                        <h3 className='balance_mt__card_price'>
                                                                            {tokenBalance}
                                                                        </h3>
                                                                    </Col>
                                                                    <Col sm='6' className='align-self-center'>
                                                                        <button
                                                                            className='blank-btn balance_mt__card_button homePurchaseBtn'
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    paymentModal: true,
                                                                                    paymentCur: 4
                                                                                })
                                                                                axios.post("fetchExchangeRate.php")
                                                                                    .then(({data}) => {
                                                                                        this.setState({
                                                                                            baseAmount: this.roundPlus(data.USD, 0),
                                                                                            currencySymbol: "USD",
                                                                                            finalPaymentAmount: 0
                                                                                        })
                                                                                    })
                                                                            }}
                                                                        >
                                                                            Purchase
                                                                        </button>
                                                                    </Col>
                                                                </Col>
                                                                <button
                                                                    className="blank-btn currency-btn"
                                                                    style={{
                                                                        outline: "none",
                                                                        backgroundColor: "#825ee4",
                                                                        color: "white",
                                                                        position: "absolute",
                                                                        top: "-4px",
                                                                        left: "-22px",
                                                                        zIndex: "1",
                                                                        padding: "0"
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={require("assets/img/logo-circle.png")}
                                                                        style={{height: "55px"}}
                                                                        className='cardIconMumba'
                                                                        alt="SomeIcon"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className='balance_other__card_row col-12'>
                                                        <Col lg='4' className='p-3'>
                                                            <div className='p-3 balance_other__card cardBTC'>
                                                                <button
                                                                    className="blank-btn currency-btn"
                                                                    style={{
                                                                        outline: "none",
                                                                        backgroundColor: "#825ee4",
                                                                        color: "white",
                                                                        position: "absolute",
                                                                        top: "-1px",
                                                                        left: "-22px",
                                                                        zIndex: "1",
                                                                        padding: "0"
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={require("assets/img/icons/02.svg")}
                                                                        style={{ height: "55px" }}
                                                                        className='cardIconBTC'
                                                                        alt="SomeIcon"
                                                                    />
                                                                </button>
                                                                <span className='balance_other__card_title'>
																	Bitcoin
																</span>
                                                                <br/>
                                                                <button
                                                                    className='full-clean-btn balance_other__card_price'
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            paymentModal: true,
                                                                            paymentCur: 2
                                                                        })
                                                                        axios.post("fetchExchangeRate.php")
                                                                            .then(({data}) => {
                                                                                this.setState({
                                                                                    baseAmount: this.roundPlus(data.BTC, 6),
                                                                                    currencySymbol: "BTC",
                                                                                    finalPaymentAmount: 0
                                                                                })
                                                                            })
                                                                    }}
                                                                >
                                                                    Top up
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' className='p-3'>
                                                            <div className='p-3 balance_other__card cardETH'>
                                                                <button
                                                                    className="blank-btn currency-btn"
                                                                    style={{
                                                                        outline: "none",
                                                                        backgroundColor: "#825ee4",
                                                                        color: "white",
                                                                        position: "absolute",
                                                                        top: "-1px",
                                                                        left: "-22px",
                                                                        zIndex: "1",
                                                                        padding: "0"
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={require("assets/img/icons/03.svg")}
                                                                        style={{ height: "55px" }}
                                                                        className='cardIconETH'
                                                                        alt="SomeIcon"
                                                                    />
                                                                </button>
                                                                <span className='balance_other__card_title'>
																	Ethereum
																</span>
                                                                <br/>
                                                                <button
                                                                    className='full-clean-btn balance_other__card_price'
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            paymentModal: true,
                                                                            paymentCur: 3
                                                                        })
                                                                        axios.post("fetchExchangeRate.php")
                                                                            .then(({data}) => {
                                                                                this.setState({
                                                                                    baseAmount: this.roundPlus(data.ETH, 5),
                                                                                    currencySymbol: "ETH",
                                                                                    finalPaymentAmount: 0
                                                                                })
                                                                            })
                                                                    }}
                                                                >
                                                                    Top up
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' className='p-3'>
                                                            <div className='p-3 balance_other__card cardUSD'>
                                                                <button
                                                                    className="blank-btn currency-btn"
                                                                    style={{
                                                                        outline: "none",
                                                                        backgroundColor: "#825ee4",
                                                                        color: "white",
                                                                        position: "absolute",
                                                                        top: "-1px",
                                                                        left: "-22px",
                                                                        zIndex: "1",
                                                                        padding: "0"
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={require("assets/img/icons/04.svg")}
                                                                        style={{ height: "55px" }}
                                                                        className='cardIconUSD'
                                                                        alt="SomeIcon"
                                                                    />
                                                                </button>
                                                                <span className='balance_other__card_title'>
																	US Dollars
																</span>
                                                                <br/>
                                                                <button
                                                                    className='full-clean-btn balance_other__card_price'
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            paymentModal: true,
                                                                            paymentCur: 4
                                                                        })
                                                                        axios.post("fetchExchangeRate.php")
                                                                            .then(({data}) => {
                                                                                this.setState({
                                                                                    baseAmount: this.roundPlus(data.USD, 0),
                                                                                    currencySymbol: "USD",
                                                                                    finalPaymentAmount: 0
                                                                                })
                                                                            })
                                                                    }}
                                                                >
                                                                    Top up
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col lg='4' className='p-3'>
                                                            <div className='p-3 balance_other__card cardIDR'>
                                                                <button
                                                                    className="blank-btn currency-btn"
                                                                    style={{
                                                                        outline: "none",
                                                                        backgroundColor: "#825ee4",
                                                                        color: "white",
                                                                        position: "absolute",
                                                                        top: "-1px",
                                                                        left: "-22px",
                                                                        zIndex: "1",
                                                                        padding: "0"
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={require("assets/img/icons/05.svg")}
                                                                        style={{ height: "55px" }}
                                                                        className='cardIconIDR'
                                                                        alt="SomeIcon"
                                                                    />
                                                                </button>
                                                                <span className='balance_other__card_title'>
																	Indonesian Rupiah
																</span>
                                                                <br/>
                                                                <button
                                                                    className='full-clean-btn balance_other__card_price'
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            paymentModal: true,
                                                                            paymentCur: 5
                                                                        })
                                                                        axios.post("fetchExchangeRate.php")
                                                                            .then(({data}) => {
                                                                                this.setState({
                                                                                    baseAmount: this.roundPlus(data.IDR, 0),
                                                                                    currencySymbol: "IDR",
                                                                                    finalPaymentAmount: 0
                                                                                })
                                                                            })
                                                                    }}
                                                                >
                                                                    Top up
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </TabPanel>
                                                <TabPanel className='col-12'>
                                                    <h4 className='TitleStyle'>Profit</h4>
                                                    <div className='profitTabContent'>
                                                        <img
                                                            src={require("assets/img/icons/profits-icon.png")}
                                                            style={{ height: "130px" }}
                                                            alt="SomeIcon"
                                                        />
                                                        <span className='profitTabText'/>
                                                        <p
                                                            className='pt-3'
                                                            style={{
                                                                fontSize: "15px",
                                                                color: "black",
                                                                fontWeight: "500"
                                                            }}
                                                        >
                                                            Your dividend will be displayed here
                                                        </p>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel className='col-12 transactionPanel'>
                                                    <h4 className='TitleStyle'>Transactions</h4>
                                                    <div style={{ overflowX: "auto" }}>
                                                        <table width='75%' cellSpacing='15px'>
                                                            <thead>
                                                                <th className='theadBorderLeft'>ID</th>
                                                                <th className='dateField'>Date</th>
                                                                <th>Gave</th>
                                                                <th>Received</th>
                                                                <th className='theadBorderRight'>Status</th>
                                                            </thead>
                                                            <tbody id='transTable' />
                                                        </table>
                                                    </div>
                                                </TabPanel>
                                            </Row>
                                        </Col>
                                    </Tabs>
                                    <Modal
                                        isOpen={withdrawalModal}
                                        className='modalWithdrawal modalPayment'
                                    >
                                        <Card
                                            style={{ textAlign: "center" }}
                                            className='modalWithdrawalCard'
                                        >
                                            <button
                                                className="blank-btn paymentCloseIcon"
                                                style={{
                                                    position: "absolute",
                                                    right: "0",
                                                    top: "0",
                                                    outline: "none",
                                                }}
                                                onClick={() =>
                                                    this.setState({ withdrawalModal: false })
                                                }
                                            >
                                                <CloseOutlined />
                                            </button>
                                            <img
                                                src={require("assets/img/icons/lockup-icon.svg")}
                                                height='150px'
                                                className='mt-5'
                                                alt="SomeIcon"
                                            />
                                            <h4 className='pt-5'>Lock up period — 6 month</h4>
                                            <p>
                                                You cannot withdraw funds now. If you have any
                                                questions, you can contact us
                                            </p>
                                        </Card>
                                    </Modal>
                                    <Modal isOpen={paymentModal} className='modalPayment'>
                                        <Card
                                            className='paymentBody pl-2 pr-2 pb-5'
                                            style={{ textAlign: "center" }}
                                        >
                                            <button
                                                className="blank-btn paymentCloseIcon"
                                                style={{
                                                    position: "absolute",
                                                    right: "0",
                                                    outline: "none",
                                                }}
                                                onClick={() => this.setState({ paymentModal: false })}
                                            >
                                                <CloseOutlined />
                                            </button>
                                            <br/>
                                            <br/>
                                            <img
                                                src={require("assets/img/logo.png")}
                                                width='200px'
                                                alt="SomeIcon"
                                            />
                                            <form
                                                className='pt-5 purchaseModalInputBox row'
                                                id='paymentForm'
                                                method='POST'
                                                action='https://mumba.finance/api/payment/main.php'
                                                onSubmit={() => {
                                                    TagManager.dataLayer(gtmEvent.TMBuyTokens)
                                                    console.log('TMBuyTokens')
                                                }}
                                            >
                                                <div className='col-12'>
                                                    <p>Enter the amount you wish to buy</p>
                                                    <input
                                                        className="purchase-modal-input"
                                                        ref={(inp) => (this.inp = inp)}
                                                        type='number'
                                                        placeholder='Min 5 required'
                                                        id='tokenQty'
                                                        name='tokenQty'
                                                        autoComplete='off'
                                                        onChange={(Event) => {
                                                            if (Event.target.value < 5) {
                                                                Event.target.classList.add("tokenQtyError")
                                                                document.getElementById("buyButton").disabled = true
                                                                let tax = ''
                                                                if (this.state.currencySymbol === "BTC" || this.state.currencySymbol === "ETH") {
                                                                    tax = "6"
                                                                } else if (this.state.currencySymbol === "USD" || this.state.currencySymbol === "IDR") {
                                                                    tax = "5"
                                                                }
                                                                let amountBeforeTax = baseAmount * Event.target.value
                                                                let amountAfterTax = amountBeforeTax + (amountBeforeTax * tax) / 100
                                                                this.setState({
                                                                    finalPaymentAmount: amountAfterTax
                                                                })
                                                            } else {
                                                                Event.target.classList.remove("tokenQtyError")
                                                                document.getElementById("buyButton").disabled = false
                                                                let tax = ''
                                                                if (this.state.currencySymbol === "BTC" || this.state.currencySymbol === "ETH") {
                                                                    tax = "6"
                                                                } else if (this.state.currencySymbol === "USD" || this.state.currencySymbol === "IDR") {
                                                                    tax = "5"
                                                                }
                                                                let amountBeforeTax = baseAmount * Event.target.value
                                                                let amountAfterTax = amountBeforeTax + (amountBeforeTax * tax) / 100
                                                                this.setState({
                                                                    finalPaymentAmount: amountAfterTax
                                                                })
                                                            }
                                                        }}
                                                        onBlur={(Event) => {
                                                            if (Event.target.value < 5) {
                                                                this.inp.classList.add("tokenQtyError")
                                                                document.getElementById("buyButton").disabled = true
                                                                let tax = ''
                                                                if (this.state.currencySymbol === "BTC" || this.state.currencySymbol === "ETH") {
                                                                    tax = "6"
                                                                } else if (this.state.currencySymbol === "USD" || this.state.currencySymbol === "IDR") {
                                                                    tax = "5"
                                                                }
                                                                let amountBeforeTax = baseAmount * Event.target.value
                                                                let amountAfterTax = amountBeforeTax + (amountBeforeTax * tax) / 100
                                                                this.setState({
                                                                    finalPaymentAmount: amountAfterTax
                                                                })
                                                            } else {
                                                                this.inp.classList.remove("tokenQtyError")
                                                                document.getElementById("buyButton").disabled = false
                                                                let tax = ''
                                                                if (this.state.currencySymbol === "BTC" || this.state.currencySymbol === "ETH") {
                                                                    tax = "6"
                                                                } else if (this.state.currencySymbol === "USD" || this.state.currencySymbol === "IDR") {
                                                                    tax = "5"
                                                                }
                                                                let amountBeforeTax = baseAmount * Event.target.value
                                                                let amountAfterTax = amountBeforeTax + (amountBeforeTax * tax) / 100
                                                                this.setState({
                                                                    finalPaymentAmount: amountAfterTax
                                                                })
                                                            }
                                                        }}
                                                    />
                                                    <div className='showConversion'>
                                                        <span>1MBM</span>
                                                        <span>{baseAmount} {currencySymbol}</span>
                                                    </div>
                                                    <p className='howToPay'>How to pay</p>
                                                </div>
                                                <div className='col-12'>
                                                    <div className='howToPayButtons'>
                                                        <div className='col-3 paymentOptBtn'>
                                                            <button
                                                                id='btnFormBTC'
                                                                className={`blank-btn smallCaseBtn ${this.state.currencySymbol === 'BTC' ? 'MakeItActive' : ''}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    this.setState({ paymentCur: 2 })
                                                                    axios.post("fetchExchangeRate.php")
                                                                        .then(({data}) => {
                                                                            this.setState({
                                                                                baseAmount: this.roundPlus(data.BTC, 6),
                                                                                currencySymbol: "BTC"
                                                                            })
                                                                            this.setFinalPaymentWithPercents(0.06)
                                                                        })
                                                                }}
                                                            >
                                                                Bitcoin
                                                            </button>
                                                        </div>
                                                        <div className='col-3 paymentOptBtn'>
                                                            <button
                                                                id='btnFormETH'
                                                                className={`blank-btn smallCaseBtn ${this.state.currencySymbol === 'ETH' ? 'MakeItActive' : ''}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    this.setState({ paymentCur: 3 })
                                                                    axios.post("fetchExchangeRate.php")
                                                                        .then(({data}) => {
                                                                            this.setState({
                                                                                baseAmount: this.roundPlus(data.ETH, 5),
                                                                                currencySymbol: "ETH"
                                                                            })
                                                                            this.setFinalPaymentWithPercents(0.06)
                                                                        })
                                                                }}
                                                            >
                                                                Ether
                                                            </button>
                                                        </div>
                                                        <div className='col-3 paymentOptBtn'>
                                                            <button
                                                                id='btnFormUSD'
                                                                className={`blank-btn smallCaseBtn ${this.state.currencySymbol === 'USD' ? 'MakeItActive' : ''}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    this.setState({ paymentCur: 4 })
                                                                    axios.post("fetchExchangeRate.php")
                                                                        .then(({data}) => {
                                                                            this.setState({
                                                                                baseAmount: this.roundPlus(data.USD, 0),
                                                                                currencySymbol: "USD"
                                                                            })
                                                                            this.setFinalPaymentWithPercents(0.05)
                                                                        })
                                                                }}
                                                            >
                                                                Dollars
                                                            </button>
                                                        </div>
                                                        <div className='col-3 paymentOptBtn'>
                                                            <button
                                                                id='btnFormIDR'
                                                                className={`blank-btn smallCaseBtn ${this.state.currencySymbol === 'IDR' ? 'MakeItActive' : ''}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    this.setState({ paymentCur: 5 })
                                                                    axios.post("fetchExchangeRate.php")
                                                                        .then(({data}) => {
                                                                            this.setState({
                                                                                baseAmount: this.roundPlus(data.IDR, 0),
                                                                                currencySymbol: "IDR"
                                                                            })
                                                                            this.setFinalPaymentWithPercents(0.05)
                                                                        })
                                                                }}
                                                            >
                                                                Rupees
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h2 className='pt-5 final-amount'>
                                                        {finalPaymentAmountForView} {currencySymbol}
                                                    </h2>
                                                    <button
                                                        id='buyButton'
                                                        className='t1-btn t1-btn--green'
                                                        type='submit'
                                                        disabled={true}
                                                    >
                                                        BUY
                                                    </button>
                                                </div>
                                                <div>
                                                    <input
                                                        type='text'
                                                        value={paymentCur}
                                                        id='paymentCur'
                                                        name='paymentCur'
                                                        readOnly
                                                        hidden
                                                    />
                                                    <input
                                                        type='text'
                                                        defaultValue={accessToken}
                                                        readOnly
                                                        name='accessToken'
                                                        hidden
                                                    />
                                                    <div style={{ textAlign: "center" }}>
                                                        <p
                                                            style={{
                                                                position: "fixed",
                                                                bottom: "-10px",
                                                                left: "0",
                                                                width: "100%",
                                                                fontSize: "x-small",
                                                            }}
                                                        >
                                                            *MumbaToken platform charges a commission of 5% on
                                                            each purchase
                                                        </p>
                                                    </div>
                                                </div>
                                            </form>
                                        </Card>
                                    </Modal>
                                </Row>
                            )
                        }}
                    </Query>
                </section>
            </>
        )
    }
}

const mapStateToProps = ({auth, tabs}) => ({
    userId: auth.userId,
    selectedTab: tabs.tabIndex
})

const mapDispatchToProps = {
    authSetUserId,
    authSetUserPhoto,
    systemSetPage,
    setSelectedTab
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
