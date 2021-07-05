<?php
namespace STO\Graphql\Schema\Mutations\Contacts;

use STO\Config;
use STO\Graphql\Utils\Exception;
use STO\Utils\Mail;
use STO\Utils\Phone;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ContactsField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new ContactsInput())]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $input = $params['input'];

        $full_name = $input['fullName'];
        if (mb_strlen($full_name) < 3) {
            throw new Exception(Exception::FULL_NAME_INCORRECT);
        }

        $email = $input['email'];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception(Exception::EMAIL_INCORRECT);
        }
        $phone = Phone::validate($input['phone']);
        if (!$phone) {
            throw new Exception(Exception::PHONE_INCORRECT);
        }

        $comment = $input['comment'];
        if (mb_strlen($comment) < 12) {
            throw new Exception(Exception::COMMENT_INCORRECT);
        }

        $subject = Config::getMainConfig('siteName').' - new contact request';
        $message = <<<HTML
<div style="text-align: center;">
<h1>{$subject}</h1>
<br> 
<h3>Full Name: <span>{$full_name}</span></h3>
<h3>Email: <span>{$email}</span></h3>
<h3>Phone Number: <span>+{$phone}</span></h3>
<h3>Comment: <span>{$comment}</span></h3>
</div>
HTML;
        $mail = new Mail();
        $sent = !!$mail->sendMessage(Config::MAIL_CONTACTS_MAIL, $subject, $message);
        if (!$sent) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        return true;
    }
}

