<?php
namespace STO\Utils;

class Curl {
    /**
     *
     * @param $url
     * @param array $params
     * @param bool $parse
     *
     * @return mixed
     */
    public function fetchGet($url, $params = [], $parse = false) {
        return $this->execRequest(curl_init(), $url.'?'.$this->buildParams($params), $parse);
    }
    /**
     *
     * @param $url
     * @param array $params
     * @param bool $parse
     *
     * @return mixed
     */
    public function fetchPost($url, $params = [], $parse = false) {
        $link = curl_init();
        curl_setopt($link, CURLOPT_POST, 1);
        curl_setopt($link, CURLOPT_POSTFIELDS, $this->buildParams($params));
        return $this->execRequest($link, $url, $parse);
    }
    /**
     * @param $link
     * @param bool $parse
     *
     * @return mixed
     */
    private function execRequest($link, $url, $parse = false) {
        curl_setopt($link, CURLOPT_URL, $url);
        curl_setopt($link, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($link, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($link);
        curl_close($link);
        if ($parse) {
            if(!$res1 = json_decode($res, true)) {
                parse_str($res,$res1);
            }
            return $res1;
        }
        return $res;
    }
    /**
     * @param array $params
     *
     * @return string
     */
    private function buildParams($params) {
        return urldecode(http_build_query($params));
    }
}