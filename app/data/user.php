<?php
   $user=json_decode(file_get_contents("php://input"));
   if($user->username=='T00020904' && $user->password=='7777777')
      
      print 'exito';
   else 
      print 'ErrorSSS';

?>