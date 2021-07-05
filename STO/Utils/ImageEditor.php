<?php

namespace STO\Utils;
use Exception;

class ImageEditor {
    private $file;
    private $image;
    private $size = [];

    public function __construct($file) {
        $this->file = $file;
        $this->prepareImage();
        return $this;
    }

    private function setSize() {
        $this->size = [@imagesx($this->image), @imagesy($this->image)];
    }

    private function loadImage($mime) {
        $mime = strtolower(substr($mime, 6));
        switch ($mime) {
            case 'pjpeg':
            case 'jpeg':
                $image = imagecreatefromjpeg($this->file);
                break;
            case 'png':
                $image = imagecreatefrompng($this->file);
                break;
            case 'gif':
                $image = imagecreatefromgif($this->file);
                break;
            default:
                $this->destroy(true);
                throw new Exception('Unsupported Image format');
        }
        if (!$image) {
            $this->destroy(true);
            throw new Exception('Couldn\'t load image');
        }
        $this->setImage($image);
    }

    private function destroy($delete_file = false) {
        if ($delete_file) {
            $this->deleteImage();
        }
        imagedestroy($this->image);
        $this->file = '';
        $this->image = false;
    }

    private function deleteImage() {
        if (strpos($this->file, '://')) {
            return;
        }
        @unlink($this->file);
    }
    private function prepareImage() {
        $image_info = @getimagesize($this->file);
        if (!$image_info || !$image_info['mime']) {
            $this->destroy(true);
            throw new Exception('Incorrect image format');
        }
        $this->loadImage($image_info['mime']);
    }

    private function setImage($image) {
        if ($this->image) {
            imagedestroy($this->image);
        }
        $this->image = $image;
        $this->setSize();
        return $this;
    }
    public function getSize() {
        return (array)$this->size;
    }
    public function scale($size = 100, $auto = false) {
        list($width, $height) = $this->getSize();
        if ($auto && $width < $size) {
            $size = $width;
        } elseif ($width < $size || $height < $size) {
            $size = ($width < $height) ? $width : $height;
        }
        $new_height = $size;
        $new_width = $size;
        if ($auto) {
            $new_height = ($size/$width) * $height;
        }
        $new_image = imagecreatetruecolor($new_width, $new_height);
        imagecopyresampled($new_image, $this->image,0, 0, 0, 0, $new_width, $new_height, $width, $height);
        $this->setImage($new_image);
        return $this;
    }

    public function rotate($angle = 90) {
        $image = imageColorAllocateAlpha($this->image, 0, 0, 0, 127);
        $this->setImage(imagerotate($this->image, $angle, $image));
        return $this;
    }

    public function square() {
        list($width, $height) = $this->getSize();
        $scale = $width;
        $x = 0;
        $y = 0;
        if ($width > $height) {
            $x = ($width - $height) / 2;
            $scale = $height;
        } elseif ($height > $width) {
            $y = ($height - $width) / 2;
            $scale = $width;
        }
        return $this->crop($scale, $scale, $x, $y);
    }

    public function crop($new_width, $new_height, $x = 0, $y = 0) {
        list($width, $height) = $this->getSize();
        if($width < $new_width) {
            $new_width = $width;
        }
        if ($height < $new_height) {
            $new_height = $height;
        }
        $new_image = imagecreatetruecolor($new_width, $new_height);
        $image_color_allocated = imagecolorallocate($this->image, 255, 255, 255);
        imagefill($new_image, 0, 0, $image_color_allocated);
        imagecopy($new_image, $this->image, 0, 0, $x, $y,$new_width, $new_height);
        $this->setImage($new_image);
        return $this;
    }

    public function save($new_file, $quality = 90, $destroy = false) {
        if ($quality <= 0 || $quality > 100) {
            throw new Exception('Unsupported quality');
        }
        imageinterlace($this->image, true);
        imagejpeg($this->image, $new_file, $quality);
        $new_size = $this->getSize();
        if ($destroy) {
            $this->destroy(true);
        }
        return $new_size;
    }
}