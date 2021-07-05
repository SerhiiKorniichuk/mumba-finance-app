<?php
namespace STO\Graphql\Schema\Mutations\ChangeInfo;

use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Graphql\Utils\Exception;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;

use STO\Verification\VerificationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangeInfoField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new ChangeInfoInput())]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        if ($user['isVerified']) {
            throw new Exception(Exception::CANT_CHANGE_INFO_VERIFIED);
        }
        $user_id = $user['userId'];

        $verification = new VerificationStorage();
        $row = $verification->getRow($user_id);
        if (in_array((int)$row['status'], [VerificationStorage::STATUS_PENDING])) {
            throw new Exception(Exception::CANT_CHANGE_INFO_REQUEST);
        }
        $input = $params['input'];

        $first_name = trim($input['firstName']);
        if (!$first_name) {
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
        $code = $input['code'];
        if (strlen($code) < 6) {
            throw new Exception(Exception::CODE_MINIMUM_LENGTH);
        }

        $users = new UsersStorage();
        if (!$users->validateAuthenticatorCode($user_id, $code)) {
            throw new Exception(Exception::CODE_IS_INCORRECT);
        }

        if (!$users->updateInfo($user_id, $first_name, $last_name, $sex, $bday, $bmonth, $byear)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_INFO_CHANGE, 'Main information has been changed');

        return true;
    }
}