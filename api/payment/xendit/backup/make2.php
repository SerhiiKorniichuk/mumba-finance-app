
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="https://js.xendit.co/v1/xendit.min.js"></script>

        <style type="text/css">
            .credit-card-box .panel-title {
                display: inline;
                font-weight: bold;
            }
            .credit-card-box .form-control.error {
                border-color: red;
                outline: 0;
                box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(255,0,0,0.6);
            }
            .credit-card-box label.error {
              font-weight: bold;
              color: red;
              padding: 2px 8px;
              margin-top: 2px;
            }
            .credit-card-box .payment-errors {
              font-weight: bold;
              color: red;
              padding: 2px 8px;
              margin-top: 2px;
            }
            .credit-card-box label {
                display: block;
            }
            .submit-button {
              background-color: #1ace9b;
              color: #ffffff;
            }

            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: rgba(0,0,0,0.5);
                z-index: 10;
            }

            #three-ds-container {
                width: 550px;
                height: 450px;
                line-height: 200px;
                position: fixed;
                top: 25%;
                left: 40%;
                margin-top: -100px;
                margin-left: -150px;
                background-color: #ffffff;
                border-radius: 5px;
                text-align: center;
                z-index: 11; /* 1px higher than the overlay layer */
            }

            pre {
                white-space: pre-wrap;
            }

            div.request {
                width: 50%;
                float: left;
            }

            pre.result {
                width: 49%;
            }
        </style>

        <script>Xendit.setPublishableKey('xnd_public_development_Eo8drIJYmqgPygsuXTJTQLXJzxxrl5v4Blnk2tYDfOxe8bjkjThmmyEN1KJalPk');</script>
        <script>
            $(function () {
                var fileEnv = "production";

                if (fileEnv !== 'production') {
                    Xendit._useIntegrationURL(true);
                }

                var $form = $('#payment-form');

                $form.submit(function (event) {
                    hideResults();

                    Xendit.setPublishableKey($form.find('#api-key').val());

                    // Disable the submit button to prevent repeated clicks:
                    $form.find('.submit').prop('disabled', true);

                    // Request a token from Xendit:
                    var tokenData = getTokenData();

                    Xendit.card.createToken(tokenData, xenditResponseHandler);

                    // Prevent the form from being submitted:
                    return false;
                });

                $('#bundle-authentication').change(function() {
                    if(this.checked) {
                        $('#card-cvn').val('');
                    }
                });

                function xenditResponseHandler (err, creditCardToken) {
                    $form.find('.submit').prop('disabled', false);

                    if (err) {
                        return displayError(err);
                    }

                    if (creditCardToken.status === 'APPROVED' || creditCardToken.status === 'VERIFIED') {
                        displaySuccess(creditCardToken);
                    } else if (creditCardToken.status === 'IN_REVIEW') {
                        window.open(creditCardToken.payer_authentication_url, 'sample-inline-frame');
                        $('.overlay').show();
                        $('#three-ds-container').show();
                    } else if (creditCardToken.status === 'FRAUD') {
                        displayError(creditCardToken);
                    } else if (creditCardToken.status === 'FAILED') {
                        displayError(creditCardToken);
                    }
                }

                function displayError (err) {
                    $('#three-ds-container').hide();
                    $('.overlay').hide();
                    $('#error .result').text(JSON.stringify(err, null, 4));
                    $('#error').show();

                    var requestData = {};
                    $.extend(requestData, getTokenData());
                    $('#error .request-data').text(JSON.stringify(requestData, null, 4));

                };

                function displaySuccess (creditCardToken) {
                    $('#three-ds-container').hide();
                    $('.overlay').hide();
                    $('#success .result').text(JSON.stringify(creditCardToken, null, 4));
                    $('#success').show();

                    var requestData = {};
                    $.extend(requestData, getTokenData());
                    $('#success .request-data').text(JSON.stringify(requestData, null, 4));

                }

                function getTokenData () {
                    return {
                        amount: $form.find('#amount').val(),
                        card_number: $form.find('#card-number').val(),
                        card_exp_month: $form.find('#card-exp-month').val(),
                        card_exp_year: $form.find('#card-exp-year').val(),
                        card_cvn: $form.find('#card-cvn').val(),
                        is_multiple_use: $form.find('#bundle-authentication').prop('checked') ? true : false,
                        should_authenticate: $form.find('#skip-authentication').prop('checked') ? false : true,
                        currency: $form.find('#currency').val(),
                        on_behalf_of: $form.find('#on-behalf-of').val(),
                        billing_details: $form.find('#should-send-billing-details').prop('checked') ? getBillingDetails() : undefined,
                        customer: $form.find('#should-send-customer-details').prop('checked') ? getCustomerDetails() : undefined,
                    };
                }

                function hideResults() {
                    $('#success').hide();
                    $('#error').hide();
                }

                function getBillingDetails () {
                    return JSON.parse($form.find('#billing-details').val());
                }

                function getCustomerDetails () {
                    return JSON.parse($form.find('#customer-details').val());
                }
            });

        </script>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <form role="form" id="payment-form" method="POST" action="javascript:void(0);">
                    <div class="col-xs-12 col-md-4">
                        <div class="panel panel-default credit-card-box">
                            <div class="panel-heading" >
                                 <h3 class="panel-title" >API Configuration</h3>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <div class="input-group">
                                                <input class="form-control" type="text" id="api-key" placeholder="API Key" value="xnd_public_development_Eo8drIJYmqgPygsuXTJTQLXJzxxrl5v4Blnk2tYDfOxe8bjkjThmmyEN1KJalPk"/>
                                                <span class="input-group-addon"><i class="fa fa-cog"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="panel panel-default credit-card-box">
                            <div class="panel-heading" >
                                 <h3 class="panel-title" >Card Details</h3>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-xs-12 col-md-12">
                                        <div class="form-group">
                                            <label for="bundle-authentication">Is multiple-use</label>
                                            <input class="form-control" type="checkbox" id="bundle-authentication"/>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xs-12 col-md-12">
                                        <div class="form-group">
                                            <label for="should_authenticate">Skip authentication</label>
                                            <input class="form-control" type="checkbox" id="skip-authentication"/>
                                        </div>
                                    </div>
                                </div>

                                <div class="row hide-if-multi">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <label for="amount">AMOUNT</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" id="amount" placeholder="Amount" value="75000"/>
                                                <span class="input-group-addon"><i class="fa fa-money"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <label for="card-number">CARD NUMBER</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" id="card-number" placeholder="Card number" value="4000000000000002"/> <br/>
                                                <span class="input-group-addon"><i class="fa fa-credit-card"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-4 col-md-4">
                                        <div class="form-group">
                                            <label for="card-exp-month"><span class="hidden-xs">EXP </span>MONTH</label>
                                            <input class="form-control" type="text" id="card-exp-month" placeholder="Card expiration month (mm)" value="12"/> <br/>
                                        </div>
                                    </div>
                                    <div class="col-xs-4 col-md-4">
                                        <div class="form-group">
                                            <label for="card-exp-year"><span class="hidden-xs">EXP </span>YEAR</label>
                                            <input class="form-control" type="text" id="card-exp-year" placeholder="Card expiration year (yyyy)" value="2025"/> <br/>
                                        </div>
                                    </div>
                                    <div class="col-xs-4 col-md-4 pull-right hide-if-multi">
                                        <div class="form-group">
                                            <label for="card-cvn">CVN CODE</label>
                                            <input class="form-control" type="text" id="card-cvn" placeholder="Cvn" value="123"/> <br/>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <label for="currency">CURRENCY</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" id="currency" placeholder="IDR" value=""/> <br/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <label for="on-behalf-of">
                                                ON BEHALF OF
                                                <i class="fa fa-question-circle" data-toggle="tooltip" title="This field is attached in the header and is only used if you have access to xenPlatform."></i>
                                            </label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" id="on-behalf-of" placeholder="User id"/> <br/>
                                                <span class="input-group-addon"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <button class="submit subscribe btn btn-success btn-lg btn-block" type="submit">Bayar Sekarang</button>
                                    </div>
                                </div>
                                <div class="row" style="display:none;">
                                    <div class="col-xs-12">
                                        <p class="payment-errors"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-4">
                        <div class="panel panel-default credit-card-box">
                            <div class="panel-heading" >
                                 <h3 class="panel-title" >Billing Details</h3>
                            </div>
                            <div class="panel-body">
                                <div class="row json">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <textarea class="form-control" rows="25" id="billing-details" placeholder='{&#10;&#9;"given_names": "John",&#10;&#9;"middle_name": "C",&#10;&#9;"surname": "Hudson",&#10;&#9;"email": "john@xendit.co",&#10;&#9;"mobile_number": "+6208123123123",&#10;&#9;"phone_number": "+6208123123123",&#10;&#9;"address": {&#10;&#9;&#9;"country": "ID",&#10;&#9;&#9;"street_line1": "Jl. Panglima Polim",&#10;&#9;&#9;"street_line2": "Kav. 78",&#10;&#9;&#9;"city": "Jakarta Selatan",&#10;&#9;&#9;"province_state": "DKI Jakarta",&#10;&#9;&#9;"postal_code": "12345"&#10;&#9;}&#10;}'></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-xs-6">
                                        <div class="input-group">
                                            Send billing details
                                            <input class="form-control" type="checkbox" id="should-send-billing-details"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-4">
                        <div class="panel panel-default credit-card-box">
                            <div class="panel-heading" >
                                 <h3 class="panel-title" >Customer</h3>
                            </div>
                            <div class="panel-body">
                                <div class="row json">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <textarea class="form-control" rows="25" id="customer-details" placeholder='{&#10;&#9;"reference_id": "reference-id",&#10;&#9;"mobile_number": "+6208123123123",&#10;&#9;"email": "john@xendit.co",&#10;&#9;"given_names": "John",&#10;&#9;"middle_name": "C",&#10;&#9;"surname": "Hudson",&#10;&#9;"description": "description",&#10;&#9;"phone_number": "+6208123123123",&#10;&#9;"nationality": "ID",&#10;&#9;"addresses": [{&#10;&#9;&#9;"country": "ID",&#10;&#9;&#9;"street_line1": "Jl. Panglima Polim",&#10;&#9;&#9;"street_line2": "Kav. 78",&#10;&#9;&#9;"city": "Jakarta Selatan",&#10;&#9;&#9;"province_state": "DKI Jakarta",&#10;&#9;&#9;"postal_code": "12345"&#10;&#9;&#9;}],&#10;&#9;"date_of_birth": "1990-04-13",&#10;&#9;"metadata": {}&#10;}'></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-xs-6">
                                        <div class="input-group">
                                            Send customer details
                                            <input class="form-control" type="checkbox" id="should-send-customer-details"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-4">

                    </div>
                </form>
            </div>

            <br/>

            <div id="success" style="display:none;">
                <p>Success! Use the token id below to charge the credit card.</p>
                <div class="request">
                    <span>REQUEST DATA</span>
                    <pre class="request-data"></pre>
                </div>
                <span>RESPONSE</span>
                <pre class="result"></pre>
            </div>

            <div id="error" style="display:none;">
                <p>Whoops! There was an error while processing your request.</p>
                <div class="request">
                    <span>REQUEST DATA</span>
                    <pre class="request-data"></pre>
                </div>
                <span>RESPONSE</span>
                <pre class="result"></pre>
            </div>

            <div class="overlay" style="display: none;"></div>
            <div id="three-ds-container" style="display: none;">
                <iframe height="450" width="550" id="sample-inline-frame" name="sample-inline-frame"> </iframe>
            </div>
        </div>
    </body>
</html>
