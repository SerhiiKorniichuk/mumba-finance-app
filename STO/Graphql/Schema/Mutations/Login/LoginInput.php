<?php
namespace STO\Graphql\Schema\Mutations\Login;

use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Object\ObjectType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use STO\Graphql\Utils\Exception;

class LoginInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'username' => new NonNullType(new StringType()),
            'password' => new NonNullType(new StringType()),
            'code'     => new StringType(),
            'resetCode'=> new BooleanType(),
        ]);
    }
}