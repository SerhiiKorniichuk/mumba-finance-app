<?php
namespace STO\Graphql\Schema\Mutations\Register;

use STO\Graphql\Schema\Mutations\ValidateEmail\ValidationField;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class RegisterInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'email'         => new NonNullType(new StringType()),
            'phone'         => new NonNullType(new StringType()),
            'firstName'     => new NonNullType(new StringType()),
            'lastName'      => new NonNullType(new StringType()),
            'sex'           => new NonNullType(new IntType()),
            'bday'          => new NonNullType(new IntType()),
            'bmonth'        => new NonNullType(new IntType()),
            'byear'         => new NonNullType(new IntType()),
            'username'      => new NonNullType(new StringType()),
            'password'      => new NonNullType(new StringType()),
            'passwordRepeat'=> new NonNullType(new StringType()),
        ]);
    }
}