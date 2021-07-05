<?php

namespace STO;

use STO\Config\ConfigStorage;

class Config {
    const DATABASE_TYPE         = 'mysql';
    const DATABASE_CHARSET      = 'utf8mb4';
    const DATABASE_NAME         = 'mumba_db';
    const DATABASE_SERVER       = '77.87.196.152';
    const DATABASE_USERNAME     = 'u_mumba_db';
    const DATABASE_PASSWORD     = 'K6uYAC1w';

    const MAIL_HOST             = 'mx1.mirohost.net';
    const MAIL_PORT             = 25;
    const MAIL_USER             = 'help@mumba.finance';
    const MAIL_PASSWORD         = 'Uw486_Y6UA4V';
    const MAIL_FROM_EMAIL       = 'help@mumba.finance';
    const MAIL_CONTACTS_MAIL    = 'help@mumba.finance';
    const MAIL_CHARSET          = 'utf8';


    const TWILIO_SID            = 'ACc5318672085e9e9576ee762ed4783c64';
    const TWILIO_TOKEN          = 'e7409726ffc404ab90836ca8ca179638';
    const TWILIO_FROM_PHONE     = '+14125203041';

    // Dynamic configs part
    private static $configs = [];

    /**
     * @param string $name
     *
     * @return bool
     */
    private static function isConfigExists($name) {
        return array_key_exists($name, self::$configs);
    }

    /**
     * @param string $name
     */
    private static function loadConfig($name) {
        static $config = false;
        if (!$config) {
            $config = new ConfigStorage();
        }
        self::$configs[$name] = $config->getConfig($name);
    }

    /**
     * @param $name
     * @param $field
     * @return mixed
     */
    public static function getConfig($name, $field) {
        return self::getFullConfig($name)[$field];
    }

    /**
     * @param $name
     *
     * @return mixed
     */
    public static function getFullConfig($name) {
        if (!self::isConfigExists($name)) {
            self::loadConfig($name);
        }
        return self::$configs[$name];
    }

    /**
     * @param string $field
     *
     * @return mixed
     */
    public static function getMainConfig($field) {
        return self::getConfig(ConfigStorage::NAME_MAIN, $field);
    }
}
