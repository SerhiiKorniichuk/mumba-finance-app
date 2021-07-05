<?php

namespace STO\Utils;
use STO\Config;

class Utils {
    protected static $instance = false;

    /**
     * @return Utils
     */
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @return string
     */
    public function getHttpScheme() {
        if ($_SERVER['HTTP_X_FORWARDED_PROTO']) {
            return (string)$_SERVER['HTTP_X_FORWARDED_PROTO'];
        }
        if ($_SERVER['HTTPS'] === 'on') {
            return 'https';
        }
        if ($_SERVER['REQUEST_SCHEME']) {
            return (string)$_SERVER['REQUEST_SCHEME'];
        }
        return  (string)'http';
    }

    /**
     * @return string
     */
    public function getDomain() {
        return (string)$_SERVER['HTTP_HOST'];
    }

    /**
     * @return string
     */
    public function ipAddress() {
        return (string)$_SERVER['REMOTE_ADDR'];
    }

    /**
     * @return string
     */
    public function getHost() {
        return $this->getHttpScheme() .'://'.$this->getDomain();
    }

    /**
     * @return string
     */
    public function getUserAgent() {
        return (string)$_SERVER['HTTP_USER_AGENT'];
    }

    /**
     * @param int $length
     *
     * @return string
     */
    public function generateRandomHash($length = 32) {
        $string = mt_rand();
        $string .= mt_rand();
        $string .= mt_rand();
        $string .= mt_rand();
        $string .= microtime(true);
        $string .= uniqid(mt_rand(),true);
        return substr(hash('sha512', $string), 0, $length);
    }

    /**
     * @param $var
     * @param $key
     * @param $value
     */
    private function nestedArrayPush(&$var, $key, $value) {
        if (!empty($var) && is_array($var)) {
            foreach ($var as $inner_key => &$inner_var) {
                if (!empty($inner_var) && is_array($inner_var) && $inner_key != $key) {
                    $this->nestedArrayPush($inner_var, $key, $value);
                } elseif($inner_key == $key && $value) {
                    $inner_var = $value;
                }
            }
        } else {
            $var[$key] = $value;
        }
    }

    /**
     * @param $vars
     * @param $value
     * @param array $variable
     *
     * @return array
     */
    public function nestedArray($vars, $value, &$variable = []) {
        foreach ($vars as $i => $key) {
            if ($i == count($vars) - 1) {
                $this->nestedArrayPush($variable, $key, $value);
            } else {
                $this->nestedArrayPush($variable, $key, []);
            }
        }
        return $variable;
    }

    /**
     * @param string $email
     *
     * @return string
     */
    public function obfuscateEmail($email) {
        [$login, $domain] = explode('@', $email);
        $length = strlen($login);
        $show = floor($length / 2);
        $hide = $length - $show;
        $replace = str_repeat("*", $hide);

        return substr_replace($login, $replace , $show, $hide).'@'. substr_replace($domain, "**", 0, 2);
    }

    /**
     * @param string $phone
     *
     * @return string
     */
    public function obfuscatePhone($phone) {
        return substr_replace($phone, '*****', -7, -2);
    }

    /**
     * @param $query
     * @param $variables
     *
     * @return mixed
     */
    public function executeGraphql($query, $variables = []) {
        if (!defined('GRAPHQL_AS_RESULT')) {
            define('GRAPHQL_AS_RESULT', 1);
        }
        $_GET['query']     = $query;
        $_GET['variables'] = $variables;
        return include $_SERVER['DOCUMENT_ROOT'].'/graphql.php';
    }

    /**
     * @param string $title
     * @param string $keywords
     * @param string $googleAnalytics
     * @param string $description
     *
     * @return string
     */
    public function getHtmlMock($title, $googleAnalytics, $keywords, $description, $content) {
        return <<<HTML
<!Doctype html>
<html lang="en">
<head>
    <title>{$title}</title>
    <meta name="Keywords" content="{$keywords}" />
    <meta name="Description" content="{$description}" />
    <meta property="og:description" content="{$description}" />
    <meta name="description" content="{$description}" />
    <!-- Google Analytics -->
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
    ga('create', '{$googleAnalytics}', 'auto');
    ga('send', 'pageview');
    </script>
    <!-- End Google Analytics -->
</head>
<body>
    <p>
        <h1>{$title}</h1>
        <br>
        <p>{$description}</p>
    </p>
    <div>
        {$content} 
    </div>
</body>
</html>
HTML;
    }

}
