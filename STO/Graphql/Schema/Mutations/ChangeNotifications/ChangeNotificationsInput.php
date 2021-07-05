<?php
namespace STO\Graphql\Schema\Mutations\ChangeNotifications;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class ChangeNotificationsInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'notifyIncoming' => new NonNullType(new BooleanType()),
            'notifyNews'     => new NonNullType(new BooleanType()),
        ]);
    }
}