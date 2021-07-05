<?php
namespace STO\Users;
use STO\Config\ConfigStorage;
use STO\Log\LogStorage;
use STO\Utils\Database;
use STO\Utils\Phone;
use STO\Utils\Upload;
use STO\Utils\Utils;
use STO\Utils\GoogleAuthenticator;

class UsersStorage {
    private const TABLE                 = 'users';
    private const LIMIT                 = 30;
    private const ONLINE_OFFSET         = 120; // 2 minute
    private const PASSWORD_MIN_LENGTH   = 6;
    private const PASSWORD_MAX_LENGTH   = 100;


    public const SEX_MALE               = 1;
    public const SEX_FEMALE             = 2;


    public const TYPE_USER              = 0;
    public const TYPE_ADMIN             = 1;



    public const DEACTIVATED_NONE        = 0;
    public const DEACTIVATED_DEACTIVATED = 1;
    public const DEACTIVATED_BANNED      = 2;
    public const DEACTIVATED_DELETED     = 3;


    public const VERIFIED_NONE           = 0;
    public const VERIFIED_VERIFIED       = 1;

    /**
     *
     * @param int $userId
     * @param string $firstName
     * @param string $lastName
     * @param int $sex
     * @param int $bday
     * @param int $bmonth
     * @param int $byear
     * @param string $country
     * @return bool|int
     */
    public function updateInfo($userId, $firstName, $lastName, $sex, $bday, $bmonth, $byear, $country = '') {
        if ($userId > 0) {
            return Database::getInstance()->update(self::TABLE, [
                'firstName' => $firstName,
                'lastName'  => $lastName,
                'byear'     => $byear,
                'bmonth'    => $bmonth,
                'bday'      => $bday,
                'sex'       => $sex,
                'country'   => $country,
            ], ['userId' => $userId]);
        }
        return false;
    }

    /**
     * @return string
     */
    public function makeSessionHash() {
        return md5(md5(md5(md5(time().time().'wow'.'WOW_TEST'))).md5(time().'SALT OR SUGAR?'.time()));
    }

    /**
     * @param $userId
     *
     * @return bool|string
     */
    public function generateAuthHash($userId) {
       $hash = $this->makeSessionHash();
       if ($this->updateHash($userId, $hash)) {
           return $hash;
       }
       return false;
    }

    /**
     *
     * @param array $options
     *
     * @return array
     */
    public function search($options = []) {
        $where = [
            'ORDER'       => [
                'userId' => 'ASC'
            ],
            'LIMIT'       => [
                (int)$options['offset'],
                (int)$options['limit'] ?: self::LIMIT,
            ],
        ];
        if ($options['query']) {
            $where['OR'] = [
                'email[~]'      => str_replace(' ', '%', $options['query']),
                'phone[~]'      => str_replace(' ', '%', $options['query']),
                'username[~]'   => str_replace(' ', '%', $options['query']),
                'firstName[~]'  => str_replace(' ', '%', $options['query']),
                'lastName[~]'   => str_replace(' ', '%', $options['query']),
                'joinIp'        => ip2long(trim($options['query'])),
                'lastVisitIp'   => ip2long(trim($options['query'])),
            ];
        }
        if ($options['user_ids'] && is_array($options['user_ids'])) {
            $userIds = array_map('intval', $options['user_ids']);
            $where['userId'] = $userIds;
        }
        $where1 = $where;
        unset($where1['LIMIT'], $where1['ORDER']);
        $count = Database::getInstance()->count(self::TABLE, 'userId', $where1);
        if ($count > 0) {
            $rows = Database::getInstance()->select(self::TABLE, '*', $where);
            $result = [];
            if ($rows) {
                foreach ($rows as $row) {
                    $userId = (int)$row['userId'];
                    $result[$userId] = $this->prepareRow($row);
                }
            }
            return [$count, $result];
        }
        return [0, []];
    }

    /**
     * @return int
     */
    public function getMonthlyUsersCount() {
        $end_day = (int)date('t');
        $month = (int)date('m');
        $year = (int)date('Y');
        $where = [
            'joinDate[>=]' => mktime(0,0,0, $month, 1, $year),
            'joinDate[<]' => mktime(0,0,0, $month, $end_day + 1, $year),
        ];
        return Database::getInstance()->count(self::TABLE, 'userId', $where);
    }


    /**
     * @param string $raw_password
     *
     * @return string
     */
    public function encodePassword($raw_password) {
        return md5(md5(md5($raw_password)));
    }

    /**
     * @param array $user
     * @param string $raw_password
     *
     * @return bool
     */
    public function validatePassword($user, $raw_password) {
        if ($user && $user['password']) {
            if ($this->encodePassword($raw_password) === $user['password']) {
                return true;
            }
            $password = $this->encodePassword($raw_password);
            if ($password === $user['password']) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param string $photo
     *
     * @return bool
     */
    public function updatePhoto($userId, $photo = '') {
        if ($userId > 0) {
            return Database::getInstance()->update(self::TABLE, [
                'photo' => $photo,
            ], ['userId' => $userId]);
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param int $isVerified
     *
     * @return bool
     */
    public function updateVerified($userId, $isVerified = self::VERIFIED_NONE) {
        if ($userId > 0) {
            return !!Database::getInstance()->update(self::TABLE, [
                'isVerified' => $isVerified,
            ], ['userId' => $userId]);
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param string $hash
     *
     * @return bool
     */
    public function updateHash($userId, $hash = '') {
        if ($userId > 0) {
            return Database::getInstance()->update(self::TABLE, [
                'hash' => $hash,
                'lastVisitIp' => ip2long(Utils::getInstance()->ipAddress()),
            ], ['userId' => (string)$userId]);
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param int $type
     *
     * @return bool
     */
    public function updateType($userId, $type = self::TYPE_USER) {
        if ($userId > 0) {
            return Database::getInstance()->update(self::TABLE, [
                'type' => $type,
            ], ['userId' => $userId]);
        }
        return false;
    }

    /**
     * @param string $username
     * @param string $email
     * @param string $phone
     * @param string $password
     * @param string $firstName
     * @param string $lastName
     * @param int $sex
     * @param int $bday
     * @param int $bmonth
     * @param int $byear
     * @param string $photo
     *
     * @return int
     */
    public function insert($username, $email, $phone, $password, $firstName, $lastName, $sex, $bday, $bmonth, $byear, $photo = '') {
        Database::getInstance()->insert(self::TABLE, [
            'joinDate'      => time(),
            'joinIp'        => ip2long(Utils::getInstance()->ipAddress()),
            'lastVisit'     => 0,
            'deactivated'   => self::DEACTIVATED_NONE,
            'isVerified'    => self::VERIFIED_NONE,
            'notifyNews'    => 1,
            'notifyIncoming'=> 1,
            'firstName'     => $firstName,
            'lastName'      => $lastName,
            'email'         => $email,
            'username'      => $username,
            'phone'         => $phone,
            'password'      => $this->encodePassword($password),
            'photo'         => $photo,
            'type'          => self::TYPE_USER,
            'sex'           => $sex,
            'bday'          => $bday,
            'bmonth'        => $bmonth,
            'byear'         => $byear,
        ]);
        $userId = Database::getInstance()->id();
        if ($userId > 0) {
            return (int)$userId;
        }
        return 0;
    }

    /**
     * @param array $row
     * @return array
     */
    private function prepareRow($row) {
        if ($row) {
            $row['photo'] = $this->getPhoto($row);
            $row['userId'] = (int)$row['userId'];
            $row['lastVisit'] = (string)date('c', $row['lastVisit']);
            $row['deactivated'] = (int)$row['deactivated'];
            $row['isOnline'] = $this->isOnline($row);
            $row['username'] = (string)$row['username'];
            $row['sex'] = (int)$row['sex'];
            $row['bday'] = (int)$row['bday'];
            $row['bmonth'] = (int)$row['bmonth'];
            $row['byear'] = (int)$row['byear'];
            $row['isVerified'] = !!$row['isVerified'];
            $row['authenticator'] = $row['authenticator'] ? unserialize($row['authenticator']) : false;
            $row['notifyIncoming'] = (bool)$row['notifyIncoming'];
            $row['notifyNews'] = (bool)$row['notifyNews'];
            $row['phone'] = '+'.$row['phone'];
            $row['obfuscatedPhone'] = Utils::getInstance()->obfuscatePhone($row['phone']);
            $row['obfuscatedEmail'] = Utils::getInstance()->obfuscateEmail($row['email']);
            $row['joinIp'] = (string)long2ip($row['joinIp']);
            $row['lastVisitIp'] = (string)long2ip($row['lastVisitIp']);
            $row['joinDate'] = (string)date('c', $row['joinDate']);
            $row['banDateRaw'] = (int)$row['banDate'];
            $row['banDate'] = (string)date('c', $row['banDate']);
        }
        return $row;
    }


    /**
     * @param $row
     * @return bool
     */
    public function isOnline($row) {
        return $row['lastVisit'] > time() - self::ONLINE_OFFSET;
    }

    /**
     * @param int $userId
     *
     * @return array|bool|null
     */
    public function getUser($userId) {
        if ($userId > 0) {
            $row = Database::getInstance()->select(self::TABLE, '*', ['userId' => $userId])[0];
            if (is_array($row) && $row) {
                return $this->prepareRow($row);
            }
            return null;
        }
        return false;
    }

    /**
     * @param array $userIds
     *
     * @return array|bool|null
     */
    public function getUsers($userIds) {
        if ($userIds && is_array($userIds)) {
            $userIds = array_unique(array_map('intval', $userIds));
            $rows = Database::getInstance()->select(self::TABLE, '*', ['userId' => $userIds]);
            if ($rows) {
                $result = [];
                foreach ($rows as $row) {
                    $userId = (int)$row['userId'];
                    $result[$userId] = $this->prepareRow($row);
                }
                return $result;
            }
            return null;
        }
        return false;
    }

    /**
     * @param string $email
     *
     * @return bool
     */
    public function isValidEmail($email) {
        return $email && !!filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * @param string $password
     *
     * @return bool
     */
    public function isCorrectPassword($password) {
        $length = strlen($password);
        return $length >= self::PASSWORD_MIN_LENGTH && $length <= self::PASSWORD_MAX_LENGTH;
    }

    /**
     * @param int $userId
     * @param string $password
     *
     * @return bool|null
     */
    public function updatePassword($userId, $password) {
        if ($userId > 0 && $this->isCorrectPassword($password)) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'password' => $this->encodePassword($password),
            ], ['userId' => $userId]);
            if (!$is_updated) {
                return null;
            }
            return true;
        }
        return false;
    }

    /**
     * @param int $userId
     * @param bool $notifyNews
     * @param bool $notifyIncoming
     *
     * @return bool|null
     */
    public function updateNotifications($userId, $notifyNews, $notifyIncoming) {
        if ($userId > 0) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'notifyNews'    => (int)$notifyNews,
                'notifyIncoming'=> (int)$notifyIncoming,
            ], ['userId' => $userId]);
            if (!$is_updated) {
                return null;
            }
            return true;
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param string $email
     *
     * @return bool|null
     */
    public function updateEmail($userId, $email) {
        if ($userId > 0 && $this->isValidEmail($email)) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'email' => strtolower($email),
            ], ['userId' => $userId]);
            return !$is_updated ? null : true;
        }
        return false;
    }

    /**
     *
     * @param string $email
     *
     * @return int
     */
    public function getIdByEmail($email) {
        if ($email && $this->isValidEmail($email)) {
            $check = Database::getInstance()->select(self::TABLE, '*', ['email' => strtolower($email)])[0];
            if ($check['userId']) {
                return (int) $check['userId'];
            }
        }
        return 0;
    }
    /**
     *
     * @param string $phone
     *
     * @return int
     */
    public function getIdByPhone($phone) {
        $phone = Phone::validate($phone);
        if ($phone) {
            $check = Database::getInstance()->select(self::TABLE, '*', ['phone' => strtolower($phone)])[0];
            if ($check['userId']) {
                return (int)$check['userId'];
            }
        }
        return 0;
    }
    /**
     *
     * @param string $username
     *
     * @return int
     */
    public function getIdByUsername($username) {
        if ($username) {
            $check = Database::getInstance()->select(self::TABLE, '*', ['username' => strtolower($username)])[0];
            if ($check['userId']) {
                return (int)$check['userId'];
            }
        }
        return 0;
    }
    /**
     * @param int $login
     *
     * @return int
     */
    public function getIdByLogin($login) {
        if ($login) {
            $userId = $this->getIdByUsername($login);
            if ($userId) {
                return (int)$userId;
            }
            $userId = $this->getIdByPhone($login);
            if ($userId) {
                return (int)$userId;
            }
            $userId = $this->getIdByEmail($login);
            if ($userId) {
                return (int)$userId;
            }
        }
        return 0;
    }

    /**
     *
     * @param int $userId
     * @param string $phone
     *
     * @return bool|null
     */
    public function updatePhone($userId, $phone) {
        $phone = Phone::validate($phone);
        if ($userId > 0 && $phone) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'phone' => $phone,
            ], ['userId' => $userId]);
            return !$is_updated ? null : true;
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param string $username
     *
     * @return bool|null
     */
    public function updateUsername($userId, $username) {
        if ($userId > 0 && $username) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'username' => $username,
            ], ['userId' => $userId]);
            return !$is_updated ? null : true;
        }
        return false;
    }

    /**
     *
     * @param int $userId
     * @param int $time
     *
     * @return bool|null
     */
    public function updateLastVisit($userId, $time = 0) {
        if ($userId > 0) {
            if ($time <= 0) {
                $time = time();
            }
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'lastVisit' => (int) $time,
            ], ['userId' => $userId]);
            if (!$is_updated) {
                return null;
            }
            return true;
        }
        return false;
    }

    /**
     * @param int $userId
     * @param int $deactivated
     *
     * @return bool|null
     */
    public function updateDeactivated($userId, $deactivated = 0) {
        if ($userId > 0) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'deactivated' => (int)$deactivated,
            ], ['userId' => $userId]);
            if (!$is_updated) {
                return null;
            }
            return true;
        }
        return false;
    }

    /**
     * @param int $userId
     * @param int $banDate
     *
     * @return bool|null
     */
    public function updateBanDate($userId, $banDate = 0) {
        if ($userId > 0) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'banDate' => (int)$banDate,
            ], ['userId' => $userId]);
            if (!$is_updated) {
                return null;
            }
            return true;
        }
        return false;
    }

    /**
     * @param array $user
     *
     * @return string
     */
    public function getPhoto($user) {
        $photo = $user['photo'];
        if ($photo) {
            return Upload::getInstance()->getPhoto($photo);
        }
        return null;
    }


    /**
     * @param int $userId
     * @param int $Authenticator
     *
     * @return bool|null
     */
    public function updateAuthenticator($userId, $Authenticator = '') {
        if ($userId > 0) {
            $is_updated = Database::getInstance()->update(self::TABLE, [
                'authenticator' => $Authenticator,
            ], ['userId' => $userId]);
            if (!$is_updated) {
                return null;
            }
            return true;
        }
        return false;
    }

    /**
     * @param int $userId
     * @param bool $no_generate
     *
     * @return array|false
     *
     * @throws \Exception
     */
    public function getAuthenticator($userId, $no_generate = false) {
        if ($userId > 0) {
            $user = $this->getUser($userId);
            if (!$user['authenticator'] && !$no_generate) {
                $authenticator = new GoogleAuthenticator();
                $secret = $authenticator->createSecret();
                $result = [
                    'secret'    => $secret,
                    'validated' => false,
                ];
                if ($this->updateAuthenticator($userId, serialize($result))) {
                    return $result;
                } else {
                    return false;
                }
            }
            return $user['authenticator'];
        }
        return false;
    }

    /**
     * @param int $userId
     * @param string $code
     *
     * @throws \Exception
     *
     * @return bool
     */
    public function validateAuthenticatorCode($userId, $code) {
        if ($userId <= 0) {
            return false;
        }
        $authenticator = $this->getAuthenticator($userId, true);
        if (!$authenticator) {
            return false;
        }
        $ga = new GoogleAuthenticator();
        if (!$ga->verifyCode($authenticator['secret'], $code)) {
            return false;
        }
        if (!$authenticator['validated']) {
            $authenticator['validated'] = true;
            if (!$this->updateAuthenticator($userId, serialize($authenticator))) {
                return false;
            }
            $logs = new LogStorage();
            $logs->insert($userId, LogStorage::TYPE_AUTHENTICATOR_INIT, 'Authenticator init');
        }
        return true;
    }

    /**
     * @param string $hash
     *
     * @return int
     */
    public function getUserIdByHash($hash) {
        $userId = Database::getInstance()->select(self::TABLE, 'userId', ['hash' => $hash, 'LIMIT' => 1])[0];
        if ($userId) {
            return (int)$userId;
        }
        return 0;
    }
}