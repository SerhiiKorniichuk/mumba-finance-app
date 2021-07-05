<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class UserLogType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'userId'            => new IntType(),
            'actionType'        => new IntType(),
            'actionComment'     => new StringType(),
            'ipAddress'         => new StringType(),
            'date'              => new StringType(),
            'browserVersion'    => new StringType(),
            'browser'           => new StringType(),
            'browserPlatform'   => new StringType(),
            'browserUserAgent'  => new StringType(),
        ]);
    }
}