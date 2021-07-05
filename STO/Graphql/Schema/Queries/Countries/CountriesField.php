<?php
namespace STO\Graphql\Schema\Queries\Countries;

use STO\Graphql\Schema\Queries\User\UserField;
use STO\Graphql\Schema\Types\CountryType;
use STO\Graphql\Schema\Types\UserType;
use STO\Utils\Countries;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;

class CountriesField extends AbstractField {
    public function getType() {
        return new ListType(new CountryType());
    }
    public function resolve($root, $params, ResolveInfo $info) {
        return Countries::LIST;
    }
}