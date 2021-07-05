export const gtmEvent = {
    // TM Event 1
    TMOpenSingUpModal: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'sign_up_start_windows'
        }
    },
    // TM Event 2
    TMSingUpPostSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'send_email_sign_up_start_windows'
        }
    },
    // TM Event 3
    TMSingUpWaitingPostVerifyCode: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'input_email_code_sign_up_start_windows'
        }
    },
    // TM Event 4
    TMSingUpPostVerifyCodeSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'input_email_code_sign_up_start_windows'
        }
    },
    // TM Event 5
    TMSingUpWaitingPhone: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'input_phone_sign_up_start_windows'
        }
    },
    // TM Event 6
    TMSingUpPhoneSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'click_button',
            eventAction: 'input_phone_click_button_sign_up_start_windows'
        }
    },
    // TM Event 7
    TMSingUpWaitingPhoneVerifyCode: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'input_phone_code_sign_up_start_windows'
        }
    },
    // TM Event 8
    TMSingUpPhoneVerifyCodeSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'input_phone_code_sign_up_start_windows'
        }
    },
    // TM Event 9
    TMSingUpWaitingUserInfo: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'final_sign_up_user_param_start_windows'
        }
    },
    // TM Event 10
    TMSingUpUserInfoSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'final_sign_up_user_param_start_windows'
        }
    },
    // TM Event 11
    TMSingUpEnterInAccountWaiting: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'final_sign_up_log_pass_start_windows'
        }
    },
    // TM Event 12
    TMSingUpEnterInAccountSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'final_sign_up_log_pass_start_windows'
        }
    },
    // TM Event 13
    TMLoginQRCodeWaiting: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'show',
            eventAction: 'scan_qr_code_start_windows'
        }
    },
    // TM Event 14
    TMLoginQRCodeSend: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'scan_qr_code_start_windows'
        }
    },
    // TM Event 15
    TMBuyTokens: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'click_button',
            eventAction: 'buy_token_button'
        }
    },
    // TM Event 16
    TMUserLogged: {
        dataLayer: {
            event: 'gtm_event',
            eventCategory: 'form_submit',
            eventAction: 'login_user'
        }
    }
}

export const tmSuccessBuyToken = (tmEvent, tmEventCategory, tmMbmCount, tmHowToPay, tmCurrencyValue, tmEventLabel) => {
    return {
        dataLayer: {
            event: tmEvent,
            eventCategory: tmEventCategory,
            eventAction: {
                mbm_count: tmMbmCount,
                howtopay: tmHowToPay,
                currency_value: tmCurrencyValue
            },
            eventLabel: tmEventLabel
        }
    }
}

