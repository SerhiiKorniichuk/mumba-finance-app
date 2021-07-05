<?php
namespace STO\Graphql\Schema\Mutations\ChangePhone;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangePhoneInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'phone' => new NonNullType(new StringType()),
        ]);
    }
}