<?php session_start();
include_once(__DIR__ . "/../api/config/functions.php");
// echo $_GET['txnID'];
$status = getTransactionStatus($_GET['txnID']);
// var_dump($status);
?>
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
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
</head>

<body>
    <div class="container">
        <div class="row">

            <div class="panel panel-default credit-card-box" style="background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important;">
                <!-- <div class="panel-heading">
                            <h3 class="panel-title">Card Details</h3>
                        </div> -->
                <div class="panel-body" style="color: white;">
                    <?php if (isset($status['status'])) {
                        if ($status['status'] == 0) { ?>
                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <i class="fa fa-info-circle" style="color: yellow; font-size:200px;"></i><br />
                                    <h3><?php echo $status['message']; ?></h3>
                                    <h4>Order ID: <?php echo $_GET['txnID']; ?></h4>
                                </div>
                            </div>
                    <?php }
                    } ?>
                    <?php if (isset($status['status'])) {
                        if ($status['status'] == 1) { ?>
                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <i class="fa fa-check-circle" style="color: lawngreen; font-size:200px;"></i><br />
                                    <h3><?php echo $status['message']; ?></h3>
                                    <h4>Order ID: <?php echo $_GET['txnID']; ?></h4>
                                </div>
                            </div>
                    <?php }
                    } ?>
                    <?php if (isset($status['status'])) {
                        if ($status['status'] == 2) { ?>
                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <i class="fa fa-times-circle" style="color: darkred; font-size:200px;"></i><br />
                                    <h3><?php echo $status['message']; ?></h3>
                                    <h4>Order ID: <?php echo $_GET['txnID']; ?></h4>
                                </div>
                            </div>
                    <?php
                        }
                    } ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <p style="text-align: right;">*note order id for future reference.</p>
                            <a href="/dashboard" style="background: linear-gradient(to right, #2dce8f, #2dcec3) !important;" class="submit subscribe btn btn-success btn-lg btn-block" type="submit">Go to Dashboard</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>