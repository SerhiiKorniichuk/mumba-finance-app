<?php

namespace STO\Verification;

use STO\Utils\Database;
use STO\Utils\Upload;

class VerificationStorage {
    const TABLE = 'verification';

    const STATUS_NONE     = 0;
    const STATUS_PENDING  = 1;
    const STATUS_DECLINED = 2;
    const STATUS_APPROVED = 3;

    const ALL_STATUSES = [
        self::STATUS_NONE,
        self::STATUS_PENDING,
        self::STATUS_DECLINED,
        self::STATUS_APPROVED,
    ];

    /**
     * @param int $status
     *
     * @return bool
     */
    public function isCorrectStatus($status) {
        return in_array($status, self::ALL_STATUSES);
    }

    /**
     * @param int $userId
     * @param int $status
     * @param array $photos
     * @param string $message
     *
     * @return bool
     */
    public function insert($userId, $status, $photos, $message = '') {
        return !!Database::getInstance()->insert(self::TABLE, [
            'userId'         => $userId,
            'status'         => $status,
            'photos'         => serialize($photos),
            'message'        => $message,
        ]);
    }

    /**
     * @param int $userId
     * @param int $status
     * @param array $photos
     * @param string $message
     *
     * @return bool
     */
    public function update($userId, $status, $photos, $message = '') {
        return !!Database::getInstance()->update(self::TABLE, [
            'userId'         => $userId,
            'status'         => $status,
            'photos'         => serialize($photos),
            'message'        => $message,
        ], ['userId'         => $userId]);
    }

    /**
     * @param int $userId
     * @param string $message
     *
     * @return bool
     */
    public function updateMessage($userId, $message) {
        return !!Database::getInstance()->update(self::TABLE, [
            'message'        => $message,
        ], ['userId'         => $userId]);
    }

    /**
     * @param int $userId
     * @param int $status
     *
     * @return bool
     */
    public function updateStatus($userId, $status) {
        return !!Database::getInstance()->update(self::TABLE, [
            'status'        => $status,
        ], ['userId'        => $userId]);
    }

    /**
     * @param int $userId
     * @param int $status
     * @param string $message
     *
     * @return bool
     */
    public function updateStatusMessage($userId, $status, $message = '') {
        return !!Database::getInstance()->update(self::TABLE, [
            'status'        => $status,
            'message'        => $message,
        ], ['userId'        => $userId]);
    }

    /**
     * @param array $row
     *
     * @return array
     */
    private function prepareRow($row) {
        $row['photos'] = unserialize($row['photos']);
        foreach ($row['photos'] as &$photo) {
            $photo = Upload::getInstance()->getPhoto($photo);
        }
        return $row;
    }

    /**
     * @param $userId
     *
     * @return bool|null|array
     */
    public function getRow($userId) {
       if ($userId > 0) {
           $row = Database::getInstance()->select(self::TABLE, '*', ['userId' => $userId])[0];
           if ($row) {
               return $this->prepareRow($row);
           }
           return null;
       }
       return false;
    }

    /**
     * @param int $userId
     * @param int $status
     * @param array $photos
     * @param string $message
     *
     * @return bool
     */
    public function setRow($userId, $status, $photos, $message = '') {
        if ($this->getRow($userId)) {
           return $this->update($userId, $status, $photos, $message);
        }
        return $this->insert($userId, $status, $photos, $message);
    }

    /**
     * @param int $limit
     * @param int $offset
     *
     * @return array
     */
    public function getRequests($limit = 100, $offset = 0) {
        $count = (int)Database::getInstance()->count(self::TABLE, '*', [
            'status' => self::STATUS_PENDING
        ]);
        $result = [];
        if ($count > 0 && $limit > 0) {
            $rows = Database::getInstance()->select(self::TABLE, '*', [
                'LIMIT'  => [$offset, $limit],
                'status' => self::STATUS_PENDING,
            ]);
            if ($rows) {
                foreach ($rows as $row) {
                    $result[] = (int)$row['userId'];
                }
            }
        }
        return [$count, $result];
    }
}