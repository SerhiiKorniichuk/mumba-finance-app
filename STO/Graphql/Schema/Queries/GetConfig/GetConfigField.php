<?php
namespace STO\Graphql\Schema\Queries\GetConfig;

use STO\Config;
use STO\Graphql\Schema\Types\ConfigType;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;

class GetConfigField extends AbstractField {
    public function getType() {
        return new ConfigType();
    }

    public function resolve($root, $params, ResolveInfo $info) {
        return Config::getFullConfig(Config\ConfigStorage::NAME_MAIN);
    }
}