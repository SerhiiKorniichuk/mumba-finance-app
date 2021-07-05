<?php
namespace STO\Validation;

use STO\Config;
use STO\Utils\Mail;
use STO\Utils\Structures;
use STO\Utils\SMS;

class ValidationService {

    const RESEND_DELAY = 120; // 2 minute

    const RESULT_START_SUCCESS  = 1;
    const RESULT_START_FAILED   = 2;
    const RESULT_RESEND_SUCCESS = 3;
    const RESULT_RESEND_FAILED  = 4;
    const RESULT_CODE_FAILED    = 5;
    const RESULT_CODE_SUCCESS   = 6;

    /**
     * @return string
     */
    private function getRandomInt() {
        return (string)mt_rand(100000, 999999);
    }

    /**
     * @param $from
     * @param $type
     * @param $item
     *
     * @return string
     */
    private function getTypeHash($from, $type, $item) {
        return md5($from.$item.$type);
    }

    private function init($from, $type, $item) {
        $hash = $this->getTypeHash($from, $type, $item);
        ValidationStorage::getInstance()->insert($type, $hash, $item, [
            'code'   => $this->getRandomInt(),
            'time'   => time(),
        ]);
        return $this->load($from, $type, $item);
    }

    /**
     * @param string $from
     * @param int $type
     * @param string $item
     *
     * @return array|bool
     */
    private function load($from, $type, $item) {
        $hash = $this->getTypeHash($from, $type, $item);
        $row = ValidationStorage::getInstance()->load($type, $hash);
        if (!$row) {
            return false;
        }
        return $row['meta'];
    }

    /**
     * @param string $from
     * @param int $type
     * @param string $item
     * @param array $meta
     *
     * @return array|bool
     */
    private function update($from, $type, $item, $meta) {
        $hash = $this->getTypeHash($from, $type, $item);
        return ValidationStorage::getInstance()->update($type, $hash, $meta);
    }

    /**
     * @param $from
     * @param $type
     * @param $item
     *
     * @return bool
     */
    public function delete($from, $type, $item) {
        $hash = $this->getTypeHash($from, $type, $item);
        return ValidationStorage::getInstance()->delete($type, $hash);
    }


    private function sendCode($type, $meta, $input) {
        $title = 'Your Confirmation code in '.Config::getMainConfig('siteName');
        if ($type === ValidationStorage::TYPE_PHONE) {
            return SMS::getInstance()->send($input, $title.': '.$meta['code']);
        } elseif ($type === ValidationStorage::TYPE_EMAIL) {
            $message = <<<HTML
<div style="text-align: center;">
<h1>{$title}</h1>
<h3>Here is your code</h3>
<br> 
<h2><b>{$meta['code']}</b></h2>
</div>
HTML;

          return Mail::getInstance()->sendMessage($input, $title, $message);
        }
        throw new \Exception('Unknown type '.$type);
    }

    /**
     * @param int $type
     * @param string $from
     * @param string $input
     * @param string $code
     * @param bool $resend
     *
     * @throws \Exception
     *
     * @return array
     */
    private function validate($type, $from, $input, $code, $resend) {
        $meta = $this->load($from, $type, $input);
        if (!$meta && !$code && !$resend) {
            $meta = $this->init($from, $type, $input);
        }
        if (!$meta) {
            return Structures::codeResponse(self::RESULT_START_FAILED);
        }

        if ($resend && $meta['resend']) {
            return Structures::codeResponse(self::RESULT_RESEND_FAILED);
        }
        $resend_delay = self::RESEND_DELAY - (time() - $meta['time']);
        $data = [
          'resend_delay' => $resend_delay > 0 ? $resend_delay : 0,
        ];
        if (!$code && (!$meta['sent'] || $resend && !$meta['resend'])) {
            if (!$this->sendCode($type, $meta, $input)) {
                $this->delete($from, $type, $input);
                return Structures::codeResponse(self::RESULT_START_FAILED);
            }
            $field = $resend ? 'resend' : 'sent';
            $meta[$field] = 1;
            $this->update($from, $type, $input, $meta);
            return Structures::codeResponse($resend ? self::RESULT_RESEND_SUCCESS : self::RESULT_START_SUCCESS, $data);
        }
        if ($code) {
            if ($code === $meta['code']) {
                return Structures::codeResponse(self::RESULT_CODE_SUCCESS);
            } else {
                return Structures::codeResponse(self::RESULT_CODE_FAILED, $data);
            }
        }
        return Structures::codeResponse(self::RESULT_START_SUCCESS);
    }

    /**
     * @param string $from
     * @param string $email
     * @param string $code
     * @param bool $resend
     *
     * @return array
     *
     * @throws \Exception
     */
    public function email($from, $email, $code, $resend) {
        return $this->validate(ValidationStorage::TYPE_EMAIL, $from, $email, $code, $resend);
    }

    /**
     * @param string $from
     * @param string $phone
     * @param string $code
     * @param bool $resend
     *
     * @return array
     *
     * @throws \Exception
     */
    public function phone($from, $phone, $code, $resend) {
        return $this->validate(ValidationStorage::TYPE_PHONE, $from, $phone, $code, $resend);
    }

}
