<?php
namespace STO\Graphql\Schema\Mutations\ChangeEmail;

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

class ChangeEmailField extends AbstractField {
    public function getType() {
        return new StringType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'         => new NonNullType(new ChangeEmailInput()),
            'validationOld' => new ValidationInput(),
            'validation'    => new ValidationInput(),
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
        $old_email = $user['email'];
        $user_id = $user['userId'];
        $input = $params['input'];
        $email = $input['email'];
        if (!$email) {
            throw new Exception(Exception::EMAIL_IS_REQUIRED);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        if (!preg_match('/^[a-zA-Z0-9\.\-\_]+@[a-zA-Z0-9\-]+\.[A-Za-z]+$/i', $email)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        if ($email === $old_email) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        if ($users->getIdByEmail($email)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }

        $validation = new ValidationField();
        $validationService = new ValidationService();

        $result = $validation->resolve([
            'from'  => 'changeEmail',
            'email' => $old_email,
        ], $params['validationOld'], $info);

        if ($result['email']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
            return $this->result('oldEmailVerify');
        }

        $result = $validation->resolve([
            'from'  => 'changeEmail',
            'email' => $email,
        ], $params['validation'], $info);

        if ($result['email']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
            return $this->result('emailVerify');
        }

        $validationService->delete('changeEmail', ValidationStorage::TYPE_EMAIL, $old_email);
        $validationService->delete('changeEmail', ValidationStorage::TYPE_EMAIL, $email);

        if (!$users->updateEmail($user_id, $email)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_PHONE_CHANGE, 'Email address has been changed from '.$old_email.' to '.$email);

        return $this->result('finish');
    }
}