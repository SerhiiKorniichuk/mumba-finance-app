<?php
namespace STO\Graphql\Schema\Mutations\Register;

use STO\Graphql\Schema\Mutations\Validation\ValidationField;
use STO\Graphql\Schema\Mutations\Validation\ValidationInput;
use STO\Graphql\Schema\Types\AccessTokenType;
use STO\Graphql\Schema\Types\RegisterType;
use STO\Graphql\Schema\Types\ValidationType;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use STO\Utils\Phone;
use STO\Validation\ValidationService;
use STO\Validation\ValidationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;


class RegisterField extends AbstractField {

    public function getType() {
        return new RegisterType();
    }

    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'   => new NonNullType(new RegisterInput()),
            'validation'   => new ValidationInput(),
        ]);
    }

    private function result($step = 'email', $validation = [], $accessToken = null, $userId = 0) {
        return [
            'validation' => $validation ? : ['email' => null, 'phone' => null],
            'step'       => $step
        ];
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $input = $params['input'];
        $email = $input['email'];
        $users = new UsersStorage();
        $validationService = new ValidationService();
        if (!$email) {
            throw new Exception(Exception::EMAIL_IS_REQUIRED);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        if (!preg_match('/^[a-zA-Z0-9\.\-\_]+@[a-zA-Z0-9\-]+\.[A-Za-z]+$/i', $email)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        if ($users->getIdByEmail($email)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        $validation = new ValidationField();

        $result = $validation->resolve([
            'from'  => 'register',
            'email' => $email,
        ], $params['validation'], $info);

        if ($result['email']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
            return $this->result('emailVerify', $result);
        }

        if (!$input['phone']) {
            return $this->result('phone');
        }
        $phone = Phone::validate($input['phone']);
        if (!$phone) {
            throw new Exception(Exception::PHONE_INCORRECT);
        }

        if ($users->getIdByPhone($phone)) {
            throw new Exception(Exception::PHONE_INCORRECT);
        }

        $result = $validation->resolve([
            'from'  => 'register',
            'phone' => $phone,
        ], $params['validation'], $info);

        if ($result['phone']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
            return $this->result('phoneVerify', $result);
        }

        if (!$input['firstName']) {
            return $this->result('info');
        }

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

        $username = $input['username'];
        if (!$username) {
            return $this->result('account', $result);
        }

        if (!preg_match("/^[a-zA-Z0-9\_\-\.]+$/", $username)) {
            throw new Exception(Exception::USERNAME_INCORRECT);
        }

        if ($users->getIdByUsername($username)) {
            throw new Exception(Exception::USERNAME_INCORRECT);
        }
        if (strlen($username) < 4) {
            throw new Exception(Exception::USERNAME_INCORRECT_LENGTH);
        }

        $password = $input['password'];
        $password_repeat = $input['passwordRepeat'];

        if (strlen($password) < 6) {
            throw new Exception(Exception::PASSWORD_LENGTH_MINIMUM);
        }
        if ($password_repeat !== $password) {
            throw new Exception(Exception::PASSWORDS_NOT_MATCH);
        }
        $user_id = $users->insert($username, $email, $phone, $password, $first_name, $last_name, $sex, $bday, $bmonth, $byear);
        $validationService->delete('register', ValidationStorage::TYPE_EMAIL, $email);
        $validationService->delete('register', ValidationStorage::TYPE_PHONE, $phone);
        if (!$user_id) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_REGISTER, 'Profile has been created');

        return $this->result('finish', []);
    }
}
