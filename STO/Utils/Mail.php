<?php

namespace STO\Utils;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use STO\Config;

class Mail extends PHPMailer {

    /**
     * @var self
     */
    protected static $instance;

    /**
     * @return self
     */
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self(true);
        }
        return self::$instance;
    }

    /**
     * @param $to_email
     * @param $subject
     * @param $message
     *
     * @return bool
     *
     * @throws Exception
     */
    public function sendMessage($to_email, $subject, $message) {
        //$this->SMTPDebug = 2;
        $this->isSMTP();
        $this->Host       = Config::MAIL_HOST;
        $this->SMTPAuth   = true;
        $this->Username   = Config::MAIL_USER;
        $this->Password   = Config::MAIL_PASSWORD;
        //$this->SMTPSecure = 'tls';
        $this->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];
        $this->Port       = Config::MAIL_PORT;
        $this->setFrom(Config::MAIL_FROM_EMAIL, Config::getMainConfig('siteName'));
        $this->addAddress($to_email);
        $this->isHTML(true);
        $this->Subject = $subject;
        $this->Body    = $message;
        $this->AltBody = strip_tags($message);

        return $this->send();
    }

}
