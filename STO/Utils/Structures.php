<?php
namespace STO\Utils;


class Structures {
    public static function codeResponse($code, $data = false) {
        $result = [
            'code' => (int)$code,
        ];
        if ($data) {
            $result['data'] = $data;
        }
        return $result;
    }

    public static function getResponseData($result) {
        return $result['data'];
    }
    public static function getResponseCode($result) {
        return (int)$result['code'];
    }
}