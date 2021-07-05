<?php
namespace STO\Graphql\Schema\Mutations\ChangeNotifications;

use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ChangeNotificationsField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new ChangeNotificationsInput())]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        $user_id = $user['userId'];
        $params = $params['input'];
        $notifyIncoming = (bool)$params['notifyIncoming'];
        $notifyNews = (bool)$params['notifyNews'];
        $users = new UsersStorage();
        if (!$users->updateNotifications($user_id, $notifyNews, $notifyIncoming)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_NOTIFICATIONS_CHANGE, 'Notifications settings has been changed');
        return true;
    }
}

