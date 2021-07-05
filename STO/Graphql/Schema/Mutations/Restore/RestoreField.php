<?php
namespace STO\Graphql\Schema\Mutations\Restore;

use STO\Graphql\Schema\Mutations\Validation\ValidationField;
use STO\Graphql\Schema\Mutations\Validation\ValidationInput;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use STO\Validation\ValidationService;
use STO\Validation\ValidationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Type\Scalar\StringType;

class RestoreField extends AbstractField {
    public function getType() {
        return new StringType();
    }

    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'      => new RestoreInput(),
            'validation' => new ValidationInput(),
        ]);
    }

    private function result($step = 'login') {
        return $step;
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $input           = $params['input'];
        $username        = $input['username'];
        $password        = $input['password'];
        $password_repeat = $input['passwordRepeat'];

        $users = new UsersStorage();
        $user_id = $users->getIdByLogin($username);
        if (!$user_id) {
            throw new Exception(Exception::LOGIN_OR_PASSWORD_INCORRECT);
        }
        $user = $users->getUser($user_id);

        $validation = new ValidationField();
        $validationService = new ValidationService();
        $result = $validation->resolve([
            'from'  => 'restore',
            'email' => $user['email'],
        ], $params['validation'], $info);

        if ($result['email']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
            return $this->result('emailVerify');
        }
        if (!$password) {
            return $this->result('password');
        }

        if (!$users->isCorrectPassword($password)) {
            throw new Exception(Exception::PASSWORD_LENGTH_MINIMUM);
        }
        if ($password_repeat !== $password) {
            throw new Exception(Exception::PASSWORDS_NOT_MATCH);
        }

        if (!$users->updatePassword($user_id, $password)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        $validationService->delete('restore', ValidationStorage::TYPE_EMAIL, $user['email']);

        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_RESET_PASSWORD, 'Reset password');

        return $this->result('finish');
    }
}