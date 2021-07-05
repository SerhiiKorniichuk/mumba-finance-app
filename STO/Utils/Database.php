<?php

namespace STO\Utils;

use STO\Config;
use Medoo\Medoo;

class Database extends Medoo {
    /**
     * @var self
     */
    protected static $instance;

    /**
     * Database constructor.
     */
    public function __construct() {
        parent::__construct([
            'database_type'     => Config::DATABASE_TYPE,
            'charset'           => Config::DATABASE_CHARSET,
            'database_name'     => Config::DATABASE_NAME,
            'server'            => Config::DATABASE_SERVER,
            'username'          => Config::DATABASE_USERNAME,
            'password'          => Config::DATABASE_PASSWORD
        ]);

    }

    /**
     * @return Database
     */
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

}
