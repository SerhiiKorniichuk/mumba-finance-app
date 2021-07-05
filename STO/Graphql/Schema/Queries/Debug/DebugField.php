<?php
namespace STO\Graphql\Schema\Queries\Debug;

use STO\Graphql\Schema\Types\DebugType;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use STO\Graphql\Utils\Exception;

class DebugField extends AbstractField {
    public function getType() {
        return new DebugType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $mem_usage = memory_get_usage();
        $mem_peak = memory_get_peak_usage();
        $errors = new Exception(-1);
        return [
            'memoryUsage' => (string) round($mem_usage / 1024).'kb',
            'memoryPeakUsage' => (string) round($mem_peak / 1024).'kb',
            'errors' => $errors->getAll(),
        ];
    }
}