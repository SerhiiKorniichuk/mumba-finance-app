<?php session_start();
include_once(__DIR__ . "/../../config/functions.php");
if (isset($_SESSION['orderID'])) {
    if ($_SESSION['orderID'] != NULL && $_SESSION['orderID'] != "") {
        $txnData = getTransactionData($_SESSION['orderID']);
        // var_dump($txnData);
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script> -->
    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://js.xendit.co/v1/xendit.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style type="text/css">
        .credit-card-box .panel-title {
            display: inline;
            font-weight: bold;
        }

        .credit-card-box .form-control.error {
            border-color: red;
            outline: 0;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);
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
            background-color: rgba(0, 0, 0, 0.5);
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
            z-index: 11;
            /* 1px higher than the overlay layer */
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

        label {
            color: white !important;
        }

        input {
            background: transparent !important;
            color: white !important;
        }

        ::placeholder {
            /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: white !important;
            opacity: 1;
            /* Firefox */
        }

        :-ms-input-placeholder {
            /* Internet Explorer 10-11 */
            color: white !important;
        }

        ::-ms-input-placeholder {
            /* Microsoft Edge */
            color: white !important;
        }
    </style>

    <script>
        Xendit.setPublishableKey('xnd_public_development_lOSRvNsdLYZ4KxaDUrsyZ4GpMrokpPkRsM159rpcFzCcSObUR5fkKR6FCzg1');
    </script>
    <script>
        $(function() {

            var fileEnv = "production";

            if (fileEnv !== 'production') {
                Xendit._useIntegrationURL(true);
            }

            var $form = $('#payment-form');

            $form.submit(function(event) {
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
                if (this.checked) {
                    $('#card-cvn').val('');
                }
            });

            function xenditResponseHandler(err, creditCardToken) {
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

            function displayError(err) {
                $('#three-ds-container').hide();
                $('.overlay').hide();
                $('#error .result').text(JSON.stringify(err, null, 4));
                // $('#error').show();

                var requestData = {};
                $.extend(requestData, getTokenData());
                $('#error .request-data').text(JSON.stringify(requestData, null, 4));

            };

            function displaySuccess(creditCardToken) {


                $('#three-ds-container').hide();
                $('.overlay').hide();
                document.getElementById("resultData").setAttribute('value', JSON.stringify(creditCardToken, null, 4));
                // document.getElementById('resultData').value = ;
                // $('.resultData').value = ();

                var requestData = {};
                $.extend(requestData, getTokenData());
                // $('.requestedData').value = (JSON.stringify(requestData, null, 4));
                document.getElementById("requestedData").setAttribute('value', JSON.stringify(requestData, null, 4));
                // document.getElementById('requestedData').value = JSON.stringify(requestData, null, 4);

                document.getElementById('SuccessDone').submit();


                // var frmCheckout = new FormData();
                // frmCheckout.append("token", creditCardToken);
                // frmCheckout.append("amount", <?php echo $_SESSION['Amount'] ?>);
                // $('#success').show();

            }

            function getTokenData() {
                return {
                    amount: <?php echo $_SESSION['amount']; ?>,
                    card_number: $form.find('#card-number').val(),
                    card_exp_month: $form.find('#card-exp-month').val(),
                    card_exp_year: $form.find('#card-exp-year').val(),
                    card_cvn: $form.find('#card-cvn').val(),
                    is_multiple_use: $form.find('#bundle-authentication').prop('checked') ? true : false,
                    should_authenticate: $form.find('#skip-authentication').prop('checked') ? false : true,
                    currency: '<?php echo $_SESSION['currency']; ?>',
                    on_behalf_of: $form.find('#on-behalf-of').val(),
                    billing_details: $form.find('#should-send-billing-details').prop('checked') ? getBillingDetails() : undefined,
                    customer: $form.find('#should-send-customer-details').prop('checked') ? getCustomerDetails() : undefined,
                };
            }

            function hideResults() {
                $('#success').hide();
                $('#error').hide();
            }

            function getBillingDetails() {
                return JSON.parse('{"given_names": "<?php echo $_SESSION['firstName']; ?>","surname": "<?php echo $_SESSION['lastName']; ?>","email": "<?php echo $_SESSION['email']; ?>"}');
            }

            function getCustomerDetails() {
                return JSON.parse(' {"email": "<?php echo $_SESSION['email']; ?>","given_names": "<?php echo $_SESSION['firstName']; ?>","surname": "<?php echo $_SESSION['lastName']; ?>","description": "Mumba Token"}');
            }
        });
    </script>
</head>

<body>
    <div class="container">
        <div class="row">
            <form role="form" id="payment-form" method="POST" action="javascript:void(0);">
                <div class="col-sm-12 col-md-8 col-lg-6" style="position: absolute !important; left: 50% !important; top: 42% !important; transform: translate(-50%, -50%) !important;">
                    <div class="panel panel-default credit-card-box" style="display: none;">
                        <div class="panel-heading">
                            <h3 class="panel-title">API Configuration</h3>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <input class="form-control" type="text" id="api-key" placeholder="API Key" value="xnd_public_development_lOSRvNsdLYZ4KxaDUrsyZ4GpMrokpPkRsM159rpcFzCcSObUR5fkKR6FCzg1" />
                                            <span class="input-group-addon"><i class="fa fa-cog"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel panel-default credit-card-box" style="background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important; padding: 5%">
                        <!-- <div class="panel-heading">
                            <h3 class="panel-title">Card Details</h3>
                        </div> -->
                        <div class="panel-body">
                            <div class="row" style="display: none;">
                                <div class="col-xs-12 col-md-12">
                                    <div class="form-group">
                                        <label for="bundle-authentication">Is multiple-use</label>
                                        <input class="form-control" type="checkbox" id="bundle-authentication" />
                                    </div>
                                </div>
                            </div>

                            <div class="row" style="display: none;">
                                <div class="col-xs-12 col-md-12">
                                    <div class="form-group">
                                        <label for="should_authenticate">Skip authentication</label>
                                        <input class="form-control" type="checkbox" id="skip-authentication" />
                                    </div>
                                </div>
                            </div>

                            <input class="form-control" style="display: none;" type="text" id="txnID" placeholder="Transaction ID" value="<?php echo $txnData['order_id']; ?>" /> <br />

                            <div class="row hide-if-multi" style="display: none;">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label for="amount">AMOUNT</label>
                                        <div class="input-group">
                                            <input class="form-control" type="text" id="amount" placeholder="Amount" value="<?php echo $txnData['amount']; ?>" />
                                            <span class="input-group-addon"><i class="fa fa-money"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="card-number">CARD NUMBER</label>
                                        <div class="input-group" style="width: 100%;">
                                            <input class="form-control" style="width: 100%;" type="text" id="card-number" placeholder="XXXXXXXXXXXXXXXX" value="" maxlength="16" />
                                            <!-- <span class="input-group-addon"><i class="fa fa-credit-card"></i></span> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="card-exp-month"><span class="hidden-xs">EXP </span>MONTH</label>
                                        <input class="form-control" type="text" id="card-exp-month" placeholder="MM" value="" maxlength="2" /> <br />
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="card-exp-year"><span class="hidden-xs">EXP </span>YEAR</label>
                                        <input class="form-control" type="text" id="card-exp-year" placeholder="YYYY" value="" maxlength="4" /> <br />
                                    </div>
                                </div>
                                <div class="col-4 pull-right hide-if-multi">
                                    <div class="form-group">
                                        <label for="card-cvn">CVN CODE</label>
                                        <input class="form-control" type="text" id="card-cvn" placeholder="XXX" value="" maxlength="4" /> <br />
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="display: none;">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="currency">CURRENCY</label>
                                        <div class="input-group">
                                            <input class="form-control" type="text" id="currency" placeholder="IDR" value="" /> <br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="display: none;">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <label for="on-behalf-of">
                                            ON BEHALF OF
                                            <i class="fa fa-question-circle" data-toggle="tooltip" title="This field is attached in the header and is only used if you have access to xenPlatform."></i>
                                        </label>
                                        <div class="input-group">
                                            <input class="form-control" type="text" id="on-behalf-of" placeholder="User id" /> <br />
                                            <span class="input-group-addon"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <button style="background: linear-gradient(to right, #2dce8f, #2dcec3) !important;" class="submit subscribe btn btn-success btn-lg btn-block" type="submit">Make Payment</button>
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
                <div class="col-xs-12 col-md-4" style="display: none;">
                    <div class="panel panel-default credit-card-box">
                        <div class="panel-heading">
                            <h3 class="panel-title">Billing Details</h3>
                        </div>
                        <div class="panel-body">
                            <div class="row json">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <textarea class="form-control" rows="25" id="billing-details" value='{"given_names": "<?php echo $_SESSION['firstName']; ?>","surname": "<?php echo $_SESSION['lastName']; ?>","email": "<?php echo $_SESSION['email']; ?>","mobile_number": "<?php echo $_SESSION['mobileNumber']; ?>"}'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-xs-6">
                                    <div class="input-group">
                                        Send billing details
                                        <input class="form-control" type="checkbox" checked id="should-send-billing-details" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-md-4" style="display: none;">
                    <div class="panel panel-default credit-card-box">
                        <div class="panel-heading">
                            <h3 class="panel-title">Customer</h3>
                        </div>
                        <div class="panel-body">
                            <div class="row json">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <textarea class="form-control" rows="25" id="customer-details" value='{"mobile_number": "<?php echo $_SESSION['mobileNumber']; ?>","email": "<?php echo $_SESSION['email']; ?>","given_names": "<?php echo $_SESSION['firstName']; ?>","surname": "<?php echo $_SESSION['lastName']; ?>","description": "Mumba Token"}'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-xs-6">
                                    <div class="input-group">
                                        Send customer details
                                        <input class="form-control" type="checkbox" checked id="should-send-customer-details" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-md-4" style="display: none;">

                </div>
            </form>
        </div>

        <br />

        <form id="SuccessDone" action="<?php echo 'http://' . $_SERVER['HTTP_HOST'] . '/api/payment/xendit/checkout.php'; ?>" method="POST">
            <input type="text" hidden name="requestedData" value="" id="requestedData" />
            <input type="text" hidden name="ccData" value="" id="resultData" />
            <input type="text" hidden name="txnData" value="<?php echo $txnData['order_id']; ?>">
        </form>

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