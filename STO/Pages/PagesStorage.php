<?php

namespace STO\Pages;

use STO\Utils\Database;
use STO\Utils\Utils;

class PagesStorage {
    const TABLE = 'pages';
    const LIMIT = 30;

    /**
     * @param string $page
     * @param string $title
     * @param string $content
     * @param string $metaTitle
     * @param string $metaDescription
     * @param string $metaKeywords
     *
     * @return bool
     */
    public function insert($page, $title, $content, $metaTitle, $metaDescription, $metaKeywords) {
        return !!Database::getInstance()->insert(self::TABLE, [
            'pageUrl'         => $page,
            'hash'            => $this->page2Hash($page),
            'title'           => $title,
            'metaTitle'       => $metaTitle,
            'metaDescription' => $metaDescription,
            'metaKeywords'    => $metaKeywords,
            'content'         => $content,
        ]);
    }

    /**
     * @param string $page
     * @param string $title
     * @param string $content
     * @param string $metaTitle
     * @param string $metaDescription
     * @param string $metaKeywords
     *
     * @return bool
     */
    public function update($page, $title, $content, $metaTitle, $metaDescription, $metaKeywords) {
        return !!Database::getInstance()->update(self::TABLE, [
            'title'           => $title,
            'content'         => $content,
            'metaTitle'       => $metaTitle,
            'metaDescription' => $metaDescription,
            'metaKeywords'    => $metaKeywords,
        ], ['hash'         => $this->page2Hash($page)]);
    }


    /**
     * @param string $page
     * @param string $title
     * @param string $content
     * @param string $metaTitle
     * @param string $metaDescription
     * @param string $metaKeywords
     *
     * @return bool
     */
    public function set($page, $title, $content, $metaTitle, $metaDescription, $metaKeywords) {
        $result = $this->getPage($page);
        if ($result) {
            return $this->update($page, $title, $content, $metaTitle, $metaDescription, $metaKeywords);
        } else {
            return $this->insert($page, $title, $content, $metaTitle, $metaDescription, $metaKeywords);
        }
    }

    /**
     * @param string $page
     *
     * @return string
     */
    private function page2Hash($page) {
        return md5(md5($page).'meow'.'meow'.'~_~');
    }

    /**
     * @param array $row
     *
     * @return array
     */
    private function prepareRow($row) {
        return $row;
    }

    /**
     * @param string $page
     *
     * @return array|bool
     */
    public function getPage($page) {
        $hash = $this->page2Hash($page);
        $row = Database::getInstance()->select(self::TABLE, '*', ['hash' => $hash])[0];
        if ($row) {
            return $this->prepareRow($row);
        }
        return false;
    }
}