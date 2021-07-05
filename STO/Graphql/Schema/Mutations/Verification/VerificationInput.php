<?php
namespace STO\Graphql\Schema\Mutations\Verification;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class VerificationInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'firstName'     => new NonNullType(new StringType()),
            'lastName'      => new NonNullType(new StringType()),
            'sex'           => new NonNullType(new IntType()),
            'bday'          => new NonNullType(new IntType()),
            'bmonth'        => new NonNullType(new IntType()),
            'byear'         => new NonNullType(new IntType()),
            'country'       => new NonNullType(new StringType()),
            'documentPhoto' => new NonNullType(new StringType()),
            'selfiePhoto'   => new NonNullType(new StringType()),
        ]);
    }
}