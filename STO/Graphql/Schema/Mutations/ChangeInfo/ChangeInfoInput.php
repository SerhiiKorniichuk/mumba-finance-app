<?php
namespace STO\Graphql\Schema\Mutations\ChangeInfo;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangeInfoInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'firstName' => new NonNullType(new StringType()),
            'lastName'  => new NonNullType(new StringType()),
            'bday'      => new NonNullType(new IntType()),
            'bmonth'    => new NonNullType(new IntType()),
            'byear'     => new NonNullType(new IntType()),
            'sex'       => new NonNullType(new IntType()),
            'code'      => new NonNullType(new StringType()),
        ]);
    }
}