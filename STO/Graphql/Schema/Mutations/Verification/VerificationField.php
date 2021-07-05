<?php
namespace STO\Graphql\Schema\Mutations\Verification;

use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Graphql\Utils\Exception;
use STO\Log\LogStorage;
use STO\Verification\VerificationStorage;
use STO\Users\UsersStorage;
use STO\Utils\Countries;
use STO\Utils\Upload;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;

class VerificationField extends AbstractField {
    public function getType() {
        return new StringType();
    }

    public function build(FieldConfig $config) {
        $config->addArguments([
            'input' => new NonNullType(new VerificationInput()),
        ]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        if ($user['isVerified']) {
            throw new Exception(Exception::CANT_PASS_VERIFIED);
        }
        $userId = (int)$user['userId'];
        $input = $params['input'];
        $first_name = trim($input['firstName']);
        if (!$first_name) {
            throw new Exception(Exception::FIRST_NAME_INCORRECT);
        }
        if (!preg_match('/^[A-Za-z]+$/i', $first_name)) {
            throw new Exception(Exception::FIRST_NAME_INCORRECT);
        }

        $last_name = trim($input['lastName']);
        if (!$last_name) {
            throw new Exception(Exception::LAST_NAME_INCORRECT);
        }

        if (!preg_match('/^[A-Za-z]+(([ ])?[A-Za-z]+)?$/i', $last_name)) {
            throw new Exception(Exception::LAST_NAME_INCORRECT);
        }

        $sex = $input['sex'];
        if (!$sex || $sex > UsersStorage::SEX_FEMALE) {
            throw new Exception(Exception::SEX_INCORRECT);
        }

        $bday = $input['bday'];
        if (!$bday ||  $bday > 31) {
            throw new Exception(Exception::BDAY_INCORRECT);
        }

        $bmonth = $input['bmonth'];
        if (!$bmonth ||  $bmonth > 12) {
            throw new Exception(Exception::BMONTH_INCORRECT);
        }

        $byear = $input['byear'];
        if (!$byear ||  $byear > 2015 || $byear < 1935) {
            throw new Exception(Exception::BYEAR_INCORRECT);
        }

        $country = $input['country'];
        if (!Countries::exists($country)) {
            throw new Exception(Exception::COUNTRY_IS_INCORRECT);
        }

        $documentPhoto = $input['documentPhoto'];
        if (!$documentPhoto) {
           return 'documentPhoto';
        }

        $documentPhoto = Upload::getInstance()->getHash($documentPhoto);
        if (!$documentPhoto || !file_exists(Upload::getInstance()->getPhoto($documentPhoto, true))) {
            throw new Exception(Exception::INCORRECT_SELFIE_PHOTO);
        }

        $selfiePhoto = $input['selfiePhoto'];
        if (!$selfiePhoto) {
           return 'selfiePhoto';
        }

        $selfiePhoto = Upload::getInstance()->getHash($selfiePhoto);
        if (!$selfiePhoto || !file_exists(Upload::getInstance()->getPhoto($selfiePhoto, true))) {
            throw new Exception(Exception::INCORRECT_SELFIE_PHOTO);
        }
        $users = new UsersStorage();
        if (!$users->updateInfo($userId, $first_name, $last_name, $sex, $bday, $bmonth, $byear, $country)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        $verification = new VerificationStorage();
        $photos = [
            'documentPhoto' => $documentPhoto,
            'selfiePhoto'   => $selfiePhoto,
        ];

        if (!$verification->setRow($userId, VerificationStorage::STATUS_PENDING, $photos)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        $logs = new LogStorage();
        $logs->insert($userId, LogStorage::TYPE_VERIFICATION_REQUEST, 'Created verification request');

        return 'finish';
    }
}
