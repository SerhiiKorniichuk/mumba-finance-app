<?php
namespace STO\Utils;

class Upload {
    private const DIRECTORY = '/uploads/';
    private const PHOTO_EXT = 'jpg';

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

    public function getUrl($hash, $ext, $internal = false, $params = []) {
        $url = str_split($hash, 4);
        $additional_params = '';
        if ($params) {
            foreach ($params as $key => $value) {
                $params[$key] = urlencode($value);
            }
            $additional_params = '?'.http_build_query($params);
        }
        return $this->getHost($hash, $internal).implode('/', $url).'.'.$ext.$additional_params;
    }

    public function getHash($url) {
        list(, $hash) = explode('uploads/', $url);
        list($hash) = explode('.', $hash);
        return str_replace('/', '', $hash);
    }

    public function getPhoto($hash, $internal = false) {
        return $this->getUrl($hash, self::PHOTO_EXT, $internal);
    }

    private function deleteFile($hash, $ext) {
        $file = $this->getUrl($hash, $ext, true);
        if (file_exists($file)) {
           return @unlink($file);
        }
        return false;
    }

    public function deletePhoto($hash) {
        return $this->deleteFile($hash, self::PHOTO_EXT);
    }

    private function getHost($hash, $internal = false) {
        return ($internal ? $_SERVER['DOCUMENT_ROOT'] : Utils::getInstance()->getHost()).self::DIRECTORY;
    }

    /**
     * @param $photo
     * @param int $size
     * @param bool $square
     *
     * @return bool|string
     *
     * @throws \Exception
     */
    public function savePhotoThumbnail($photo, $size = 200, $square = true) {
        $photo = new ImageEditor($photo);
        list($width, $height) = $photo->getSize();
        if ($width >= $size && $height >= $size || !$square) {
            $photo_hash = Utils::getInstance()->generateRandomHash(32);
            $photo_url = $this->getPhoto($photo_hash, true);
            $this->createDirectories($photo_url);
            if ($square) {
                list($width, $height) = $photo->square()->scale($size, true)->save($photo_url, 100, true);
            } else {
                list($width, $height) = $photo->scale($size, true)->save($photo_url, 100, true);
            }
            if ($width && $height) {
                return $photo_hash;
            }
        }
        return '';
    }

    private function createDirectories($file_url) {
        $directories = explode('/', $file_url);
        array_pop($directories);
        $directories = implode('/', $directories);
        if (!is_dir($directories)) {
            return mkdir($directories,0777,true);
        }
        return false;
    }

}
