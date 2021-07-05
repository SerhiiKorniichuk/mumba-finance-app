<?php
namespace STO\Graphql\Schema\Mutations\Contacts;

use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class ContactsInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'fullName' => new NonNullType(new StringType()),
            'email' => new NonNullType(new StringType()),
            'phone' => new NonNullType(new StringType()),
            'comment' => new NonNullType(new StringType()),
        ]);
    }
}