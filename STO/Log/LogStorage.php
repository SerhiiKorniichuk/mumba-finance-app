<?php

namespace STO\Log;

use STO\Config\ConfigStorage;
use STO\Utils\Browser;
use STO\Utils\Database;
use STO\Utils\Utils;

class LogStorage {
    const TABLE = 'logs';
    const LIMIT = 30;

    const TYPE_LOGIN                = 1;
    const TYPE_REGISTER             = 2;
    const TYPE_RESET_PASSWORD       = 3;
    const TYPE_RESET_AUTHENTICATOR  = 4;
    const TYPE_CHANGE_PHOTO         = 5;
    const TYPE_DELETE_PHOTO         = 5;
    const TYPE_CHANGE_PASSWORD      = 6;
    const TYPE_DEACTIVATE_PROFILE   = 7;
    const TYPE_AUTHENTICATOR_INIT   = 8;
    const TYPE_NOTIFICATIONS_CHANGE = 9;
    const TYPE_INFO_CHANGE          = 10;
    const TYPE_PHONE_CHANGE         = 11;
    const TYPE_VERIFICATION_REQUEST = 12;

    /**
     * @param int $userId
     * @param int $actionType
     * @param string $actionComment
     *
     * @return bool
     */
    public function insert($userId, $actionType, $actionComment) {
        return !!Database::getInstance()->insert(self::TABLE, [
            'userId'        => $userId,
            'actionType'    => $actionType,
            'actionComment' => $actionComment,
            'ipAddress'     => ip2long(Utils::getInstance()->ipAddress()),
            'browser'       => Utils::getInstance()->getUserAgent(),
            'date'          => time(),
        ]);
    }


    /**
     * @param array $row
     *
     * @return array
     */
    private function prepareRow($row) {
        $row['userId'] = (int)$row['userId'];
        $row['date'] = (string)date('c', $row['date']);
        $row['actionType'] = (int)$row['actionType'];
        $row['ipAddress'] = long2ip($row['ipAddress']);
        $browser = new Browser($row['browser']);
        $row['browserVersion'] = $browser->getVersion();
        $row['browser'] = $browser->getBrowser();
        $row['browserPlatform'] = $browser->getPlatform();
        $row['browserUserAgent'] = $browser->getUserAgent();
        return $row;
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
                'date' => 'DESC'
            ],
            'LIMIT'       => [
                (int)$options['offset'],
                (int)$options['limit'] ?: self::LIMIT,
            ],
        ];
        if ($options['query']) {
            $where['OR'] = [
                'browser[~]' => str_replace(' ', '%', $options['query']),
                'actionComment[~]' => str_replace(' ', '%', $options['query']),
                'ipAddress' => ip2long(trim($options['query'])),
            ];
        }
        if ($options['userIds'] && is_array($options['userIds'])) {
            $userIds = array_map('intval', $options['userIds']);
            $where['userId'] = $userIds;
        }
        $where1 = $where;
        unset($where1['LIMIT'], $where1['ORDER']);
        $count = Database::getInstance()->count(self::TABLE, 'id', $where1);
        if ($count > 0) {
            $rows = Database::getInstance()->select(self::TABLE, '*', $where);
            $result = [];
            if ($rows) {
                foreach ($rows as $row) {
                    $result[] = $this->prepareRow($row);
                }
            }
            return [$count, $result];
        }
        return [0, []];
    }

    /**
     * @return array
     */
    public function getUsersChartData() {
        $end_day = (int)date('t');
        $month = (int)date('m');
        $year = (int)date('Y');
        $result = [];
        $storage = new ConfigStorage();
        $rows = $storage->getConfig('monthlyUsers', true);
        $date = time() / ((int)(60 * 5));
        if ($rows) {
            if ($rows['date'] > $date) {
                $rows = false;
            }
        }
        if (!$rows) {
            for ($i = 1; $i <= $end_day; $i++) {
                $where = [
                    'actionType' => self::TYPE_REGISTER,
                    'date[>=]' => mktime(0,0,0, $month, $i, $year),
                    'date[<]' => mktime(0,0,0, $month, $i + 1, $year),
                ];
                $joinedCount = Database::getInstance()->count(self::TABLE, 'userId', $where);
                $where['actionType'] = self::TYPE_LOGIN;
                $allCount = Database::getInstance()->count(self::TABLE, 'userId', $where);
                $result[] = ['name' => "{$i}.{$month}.{$year}", 'Visit' => $allCount, 'Signup' => $joinedCount];
            }
            $storage->setConfig('monthlyUsers', [
                'date' => $date,
                'result' => $result,
            ]);
        } else {
            return $rows['result'];
        }
        return $result;
    }
}