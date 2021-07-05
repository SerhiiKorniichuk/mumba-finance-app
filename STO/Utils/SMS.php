<?php

namespace STO\Utils;
use STO\Config;
use Twilio\Rest\Client;

class SMS {
    /**
     * @var self
     */
    protected static $instance;

    /**
     * @return self
     */
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @param $phone
     * @param $message
     *
     * @return \Twilio\Rest\Api\V2010\Account\MessageInstance
     * @throws \Twilio\Exceptions\ConfigurationException
     * @throws \Twilio\Exceptions\TwilioException
     */
    public function send($phone, $message) {
        $client = new Client(Config::TWILIO_SID, Config::TWILIO_TOKEN);
        return $client->messages->create('+'.$phone, [
                'from' => Config::TWILIO_FROM_PHONE,
                'body' => $message,
            ]
        );

    }
}