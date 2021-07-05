<?php

namespace STO\Config;

use STO\Utils\Database;

class ConfigStorage {
    private const TABLE = 'configs';

    public const NAME_MAIN = 'main';

    private const FALLBACK_CONFIGS = [
        self::NAME_MAIN => [
            'siteName'        => 'Mumba',
            'metaDescription' => 'Mumba description',
            'metaKeywords'    => 'Mumba, engine, keywords',
            'googleAnalytics' => '',
            'timeZone'        => 'Europe/Moscow',
        ],
    ];

    /**
     * @param string $name
     *
     * @return array
     */
    private function getFallback($name) {
        return (array)self::FALLBACK_CONFIGS[$name];
    }

    /**
     * @param string $name
     *
     * @return bool
     */
    private function fallbackExists($name) {
        return array_key_exists($name, self::FALLBACK_CONFIGS);
    }

    /**
     * @param string $name
     * @param array $data
     *
     * @return bool
     */
    private function insert($name, $data) {
        return !!Database::getInstance()->insert(self::TABLE, [
            'name'         => $name,
            'data'         => serialize($data),
            'hash'         => $this->name2hash($name),
        ]);
    }

    /**
     * @param string $name
     * @param array $data
     *
     * @return bool
     */
    private function update($name, $data) {
        return !!Database::getInstance()->update(self::TABLE, [
            'name'         => $name,
            'data'         => serialize($data),
        ], ['hash'         => $this->name2hash($name)]);
    }

    /**
     * @param string $name
     * @param array $data
     *
     * @return bool
     */
    public function setConfig($name, $data) {
        $result = $this->getConfig($name, true);
        if ($result) {
            return $this->update($name, $data);
        } else {
            return $this->insert($name, $data);
        }
    }

    /**
     * @param string $name
     *
     * @return bool
     */
    public function deleteConfig($name) {
        return !!Database::getInstance()->delete(self::TABLE, [
            'hash' => $this->name2hash($name)
        ]);
    }
    /**
     * @param string $name
     *
     * @return string
     */
    private function name2hash($name) {
        return md5(md5($name).'Summertime sadness');
    }

    /**
     * @param array $row
     *
     * @return array
     */
    private function prepareRow($row) {
        return unserialize($row['data']);
    }

    /**
     * @param string $name
     * @param bool $no_fallback
     *
     * @return array|bool
     */
    public function getConfig($name, $no_fallback = false) {
        $hash = $this->name2hash($name);
        $row = Database::getInstance()->select(self::TABLE, '*', ['hash' => $hash])[0];
        if ($row) {
            return $this->prepareRow($row);
        }
        if (!$no_fallback && $this->fallbackExists($name)) {
            return $this->getFallback($name);
        }
        return false;
    }
}