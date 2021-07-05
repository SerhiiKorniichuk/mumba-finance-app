<?php

namespace STO\Graphql\Utils;

use STO\Config;
use STO\Utils\Utils;
use Youshido\GraphQL\Exception\DatableResolveException;

class Exception extends DatableResolveException {

    const INTERNAL_ERROR                    = 1;
    const USERNAME_INCORRECT                = 2;
    const USER_NOT_FOUND                    = 3;
    const USER_DEACTIVATED                  = 4;
    const ENTER_USER_ID                     = 5;
    const TOKEN_INCORRECT                   = 6;
    const LOGIN_OR_PASSWORD_INCORRECT       = 7;
    const OLD_PASSWORD_INCORRECT            = 8;
    const PASSWORD_LENGTH_MINIMUM           = 9;
    const PASSWORDS_NOT_MATCH               = 10;
    const PHONE_INCORRECT                   = 11;
    const EMAIL_INCORRECT                   = 12;
    const PASSWORD_INCORRECT                = 13;
    const UNSUPPORTED_FILE_TYPE             = 14;
    const FILE_IS_REQUIRED                  = 15;
    const CODE_IS_INCORRECT                 = 16;
    const CANT_RESEND_CODE                  = 17;
    const EMAIL_IS_REQUIRED                 = 18;
    const FIRST_NAME_INCORRECT              = 19;
    const LAST_NAME_INCORRECT               = 20;
    const SEX_INCORRECT                     = 21;
    const BDAY_INCORRECT                    = 22;
    const BMONTH_INCORRECT                  = 23;
    const BYEAR_INCORRECT                   = 24;
    const USERNAME_INCORRECT_LENGTH         = 25;
    const SECURITY_ERROR                    = 26;
    const COMMENT_INCORRECT                 = 27;
    const FULL_NAME_INCORRECT               = 28;
    const CODE_MINIMUM_LENGTH               = 29;
    const PAGE_NOT_FOUND                    = 30;
    const CANT_CHANGE_INFO_VERIFIED         = 31;
    const TITLE_IS_REQUIRED                 = 32;
    const CONTENT_IS_REQUIRED               = 33;
    const ACCOUNT_HAS_BANNED                = 34;
    const ACCOUNT_HAS_DELETED               = 35;
    const INCORRECT_DEACTIVATED_TYPE        = 36;
    const INCORRECT_USER_TYPE               = 37;
    const BAN_DATE_NOT_ENTERED              = 38;
    const PASSWORD_ALREADY_USED             = 39;
    const COUNTRY_IS_INCORRECT              = 40;
    const CANT_PASS_VERIFIED                = 41;
    const INCORRECT_DOCUMENT_PHOTO          = 42;
    const INCORRECT_SELFIE_PHOTO            = 43;
    const INCORRECT_VERIFIED_STATUS         = 44;
    const CANT_CHANGE_INFO_REQUEST          = 45;

    private $messages = [
        self::INTERNAL_ERROR                => 'Internal server error',
        self::USERNAME_INCORRECT            => 'Username is incorrect',
        self::USER_NOT_FOUND                => 'User is not found',
        self::USER_DEACTIVATED              => 'User is deactivated',
        self::ENTER_USER_ID                 => 'Enter UserId',
        self::TOKEN_INCORRECT               => 'Token is incorrect',
        self::LOGIN_OR_PASSWORD_INCORRECT   => 'Login or Password is incorrect',
        self::OLD_PASSWORD_INCORRECT        => 'Old Password is incorrect',
        self::PASSWORD_LENGTH_MINIMUM       => 'Password length minimum 6 characters required',
        self::PASSWORDS_NOT_MATCH           => 'Passwords not match',
        self::PHONE_INCORRECT               => "Please enter another phone number, current number invalid",
        self::EMAIL_INCORRECT               => "Email incorrect format\nExample: example@site.com",
        self::PASSWORD_INCORRECT            => 'Password is incorrect',
        self::UNSUPPORTED_FILE_TYPE         => 'File type is unsupported',
        self::FILE_IS_REQUIRED              => 'Input file is required!',
        self::CODE_IS_INCORRECT             => 'Code is incorrect',
        self::CANT_RESEND_CODE              => 'Cant resend code',
        self::EMAIL_IS_REQUIRED             => 'Email is required',
        self::FIRST_NAME_INCORRECT          => 'First name is incorrect',
        self::LAST_NAME_INCORRECT           => 'Last name is incorrect',
        self::SEX_INCORRECT                 => 'Gender is incorrect',
        self::BDAY_INCORRECT                => 'Birthday `day` is incorrect',
        self::BMONTH_INCORRECT              => 'Birthday `month` is incorrect',
        self::BYEAR_INCORRECT               => 'Birthday `year` is incorrect',
        self::USERNAME_INCORRECT_LENGTH     => 'Username length minimum 4 characters required',
        self::SECURITY_ERROR                => 'Security error',
        self::COMMENT_INCORRECT             => 'Comment is incorrect!',
        self::FULL_NAME_INCORRECT           => 'Full name is incorrect!',
        self::CODE_MINIMUM_LENGTH           => 'Enter the 6-digit code!',
        self::PAGE_NOT_FOUND                => 'Page not found!',
        self::CANT_CHANGE_INFO_VERIFIED     => 'Cant change account information in verified profile!',
        self::TITLE_IS_REQUIRED             => 'Title is required!',
        self::CONTENT_IS_REQUIRED           => 'Content is required!',
        self::ACCOUNT_HAS_BANNED            => 'Account has banned by administration',
        self::ACCOUNT_HAS_DELETED           => 'Account has deactivated by administration',
        self::INCORRECT_DEACTIVATED_TYPE    => 'Incorrect deactivated type',
        self::INCORRECT_USER_TYPE           => 'Incorrect user type',
        self::BAN_DATE_NOT_ENTERED          => 'Ban date is not entered',
        self::PASSWORD_ALREADY_USED         => 'New password already used',
        self::COUNTRY_IS_INCORRECT          => 'Country is incorrect',
        self::CANT_PASS_VERIFIED            => 'Cant create request in verified profile!',
        self::INCORRECT_DOCUMENT_PHOTO      => 'Document photo is incorrect!',
        self::INCORRECT_SELFIE_PHOTO        => 'Selfie photo is incorrect!',
        self::INCORRECT_VERIFIED_STATUS     => 'Incorrect verified status',
        self::CANT_CHANGE_INFO_REQUEST      => 'Cant change account information, Your request to verification is pending',
    ];

    public function getErrorMessage($code) {
        if (array_key_exists($code, $this->messages)) {
            return $this->messages[$code];
        }
        return 'Unknown error';
    }

    public function __construct($code, $data = []) {
        if ($code == -1) {
            return;
        }
        parent::__construct($this->getErrorMessage($code), $code, $data);
    }

    public function getAll() {
        $result = [];
        foreach ($this->messages as $code => $message) {
            $result[] = ['code' => $code, 'message' => $message];
        }
        return $result;
    }

}