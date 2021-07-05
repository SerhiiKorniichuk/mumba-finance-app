<?php
namespace STO\Graphql\Schema\Mutations\ChangePhone;

use STO\Graphql\Schema\Mutations\Validation\ValidationField;
use STO\Graphql\Schema\Mutations\Validation\ValidationInput;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Graphql\Utils\Exception;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;

use STO\Utils\Phone;
use STO\Validation\ValidationService;
use STO\Validation\ValidationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangePhoneField extends AbstractField {
    public function getType() {
        return new StringType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'      => new NonNullType(new ChangePhoneInput()),
            'validation' => new ValidationInput(),
        ]);
    }

    private function result($step) {
        return $step;
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        if ($user['isVerified']) {
            throw new Exception(Exception::CANT_CHANGE_INFO_VERIFIED);
        }
        $users = new UsersStorage();
        $user = $users->getUser($user['userId']);
        $old_phone = $user['phone'];
        $user_id = $user['userId'];
        $input = $params['input'];

        $phone = Phone::validate($input['phone']);

        if (!$phone) {
            throw new Exception(Exception::PHONE_INCORRECT);
        }

        if ($phone === $old_phone) {
            throw new Exception(Exception::PHONE_INCORRECT);
        }

        if ($users->getIdByPhone($phone)) {
            throw new Exception(Exception::PHONE_INCORRECT);
        }

        $validation = new ValidationField();
        $validationService = new ValidationService();
        $result = $validation->resolve([
            'from'  => 'changePhone',
            'phone' => $phone,
        ], $params['validation'], $info);

        if ($result['phone']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
            return $this->result('phoneVerify');
        }
        $validationService->delete('changePhone', ValidationStorage::TYPE_PHONE, $phone);
        if (!$users->updatePhone($user_id, $phone)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_PHONE_CHANGE, 'Phone number has been changed from '.$old_phone.' to +'.$phone);

        return $this->result('finish');
    }
}