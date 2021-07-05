<?php
namespace STO\Graphql\Schema\Mutations\Login;

use STO\Config;
use STO\Graphql\Schema\Mutations\Validation\ValidationField;
use STO\Graphql\Schema\Mutations\Validation\ValidationInput;
use STO\Graphql\Schema\Types\LoginType;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use STO\Validation\ValidationService;
use STO\Validation\ValidationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Exception\DatableResolveException;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use STO\Graphql\Utils\Exception;
use STO\Utils\GoogleAuthenticator;

class LoginField extends AbstractField {
    public function getType() {
        return new LoginType();
    }

    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'      => new LoginInput(),
            'validation' => new ValidationInput(),
        ]);
    }

    private function result($step = 'login', $generatorImage = '', $generatorSecret = '', $accessToken = null, $userId = 0) {
        return [
            'step'           => $step,
            'generatorImage' => $generatorImage,
            'generatorSecret'=> $generatorSecret,
            'accessToken'  => [
                'accessToken' => $accessToken,
                'userId'      => $userId,
            ],
        ];
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $input = $params['input'];
        $username   = $input['username'];
        $password   = $input['password'];
        $code       = $input['code'];
        $reset_code = $input['resetCode'];

        $container = $info->getExecutionContext()->getContainer();
        $authed_id = $container->get('userId');
        $users = new UsersStorage();
        $logs = new LogStorage();

        $user_id = $authed_id ?: $users->getIdByLogin($username);
        if (!$user_id) {
            throw new Exception(Exception::LOGIN_OR_PASSWORD_INCORRECT);
        }
        $user = $users->getUser($user_id);
        if (!$authed_id && !$users->validatePassword($user, $password)) {
            throw new Exception(Exception::LOGIN_OR_PASSWORD_INCORRECT);
        }

        if (!$authed_id) {
            if ((int)$user['deactivated'] === UsersStorage::DEACTIVATED_BANNED) {
                if ($user['banDateRaw'] > time()) {
                    throw new DatableResolveException('Your account has banned till '.date('d.m.Y', $user['banDateRaw']));
                } else {
                    $users->updateBanDate($user_id, 0);
                    $users->updateDeactivated($user_id, UsersStorage::DEACTIVATED_NONE);
                }
            }
            if ((int)$user['deactivated'] === UsersStorage::DEACTIVATED_DELETED) {
                throw new Exception(Exception::ACCOUNT_HAS_DELETED);
            }
            if ((int)$user['deactivated'] === UsersStorage::DEACTIVATED_DEACTIVATED) {
                $users->updateDeactivated($user_id, UsersStorage::DEACTIVATED_NONE);
            }
        }

        $authenticator = $users->getAuthenticator($user_id);
        if ($reset_code) {
            $validation = new ValidationField();
            $validationService = new ValidationService();
            $result = $validation->resolve([
                'from'  => 'login',
                'phone' => $user['phone'],
            ], $params['validation'], $info);
            if ($result['phone']['state'] != ValidationService::RESULT_CODE_SUCCESS) {
                return $this->result('phoneVerify');
            }
            $users->updateAuthenticator($user_id, '');
            $authenticator = $users->getAuthenticator($user_id);
            $logs->insert($user_id, LogStorage::TYPE_RESET_AUTHENTICATOR, 'Authenticator reset');
            $validationService->delete('login', ValidationStorage::TYPE_PHONE, $user['phone']);
        }

        if (!$authenticator) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        if (!$authenticator['validated'] && !$code) {
            $ga = new GoogleAuthenticator();
            $image = $ga->getQRCodeGoogleUrl($user['username'], $authenticator['secret'], Config::getMainConfig('siteName'));
            return $this->result('generatorInit', $image, $authenticator['secret']);
        }

        if ($authenticator['validated'] && !$code) {
            return $this->result('generatorVerify', '', '');
        }

        if (strlen($code) < 6) {
            throw new Exception(Exception::CODE_MINIMUM_LENGTH);
        }

        if (!$users->validateAuthenticatorCode($user_id, $code)) {
            throw new Exception(Exception::CODE_IS_INCORRECT);
        }

        $hash = $users->generateAuthHash($user_id);
        if (!$hash) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        $logs->insert($user_id, LogStorage::TYPE_LOGIN, 'Login to account');

        return $this->result('finish', '', '', $hash, $user_id);
    }
}