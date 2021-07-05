<?php
namespace STO\Validation;
use STO\Utils\Database;

class ValidationStorage {

    private const TABLE = 'validation';

    const TYPE_EMAIL         = 1;
    const TYPE_PHONE         = 2;


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
     * @param int $type
     * @param string $hash
     * @param string $item
     * @param array $meta
     *
     * @return bool
     */
    public function insert($type, $hash, $item, $meta = []) {
        return !!Database::getInstance()->insert(self::TABLE, [
            'type'  => $type,
            'hash'  => $hash,
            'item'  => $item,
            'meta'  => serialize($meta),
        ]);
    }

    /**
     * @param int $type
     * @param string $hash
     * @param array $meta
     *
     * @return bool
     */
    public function update($type, $hash, $meta = []) {
        return !!Database::getInstance()->update(self::TABLE, [
            'meta'  => serialize($meta),
        ], [
            'type'  => $type,
            'hash'  => $hash,
        ]);
    }

    /**
     * @param int $type
     * @param string $hash
     *
     * @return array|bool
     */
    public function load($type, $hash) {
        $row = Database::getInstance()->select(self::TABLE, '*', [
            'type'  => $type,
            'hash'  => $hash,
            'LIMIT' => 1,
        ])[0];
        if ($row && $row['meta']) {
            $row['meta'] = unserialize($row['meta']);
            return (array)$row;
        }
        return false;
    }

    /**
     * @param string $type
     * @param string $hash
     * @param int|string $item
     * @param array $meta
     *
     * @return array
     */
    public function loadOrInsert($type, $hash, $item, $meta = []) {
        $row = $this->load($type, $hash);
        if (!$row) {
            $this->insert($type, $hash, $item, $meta);
        }
        return $this->load($type, $hash);
    }

    /**
     * @param int $type
     * @param string $hash
     *
     * @return bool
     */
    public function delete($type, $hash) {
        return !!Database::getInstance()->delete(self::TABLE, [
            'type' => $type,
            'hash' => $hash,
        ]);
    }
}