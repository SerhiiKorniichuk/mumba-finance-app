<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;

class LoginType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'step'            => new StringType(),
            'generatorImage'  => new StringType(),
            'generatorSecret' => new StringType(),
            'accessToken'     => new AccessTokenType(),
        ]);

    }
}