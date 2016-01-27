<?php

// No direct access to this file
defined('ABSPATH') or die('Restricted access');


	class ajax__component extends er_base_plugin {

		var $ajaxHoocks = array(
		        "userLogin" => "nopriv",
		        "userRegister" => "nopriv",
		        "userLogout" => "priv",
		    );

		function ajax__component(){
			
		}

		function userLogin(){
			$this->verifyNonce('userLogin');

			$data = $_POST["data"];

			if(!isset($data["user_login"]) || !isset($data["user_password"]) || is_user_logged_in()){
				echo "0";
				wp_die();
			}

			$data['remember'] = true;

			$user_signon = wp_signon($data, false);

			if (is_wp_error($user_signon)){
		        echo "0";
		    }else{
		        echo json_encode( array('loggedin'=>true, 'ID' => $user_signon->ID) );
		    }

			wp_die();
		}

		function userLogout(){
			$this->verifyNonce('userLogout');

			wp_logout();

			echo "true";

			wp_die();
		}

		function userRegister(){
			$this->verifyNonce('userRegister');

			$data = $_POST["data"];

			$userID = wp_insert_user(array (
				'first_name' => $data["first_name"],
				'last_name' => $data["last_name"],
				'nickname' => $data["nickname"],
				'user_email' => $data["user_email"],
				'user_login' => $data["user_login"],
				'user_pass' => $data["user_pass"]
			));

			/*
				Add a custom capability to the user
					$user = new WP_User($userID);
					$user->add_cap("edit_posts");
					$user->add_cap("delete_posts");
			*/

			if(isset($userID->errors)){
				echo json_encode($userID);
			}else{
				//Add USER INFO
				add_user_meta($userID, "adress", $data["adress"], true);
				add_user_meta($userID, "localidade", $data["localidade"], true);
				add_user_meta($userID, "codPostal", $data["codPostal"], true);
				add_user_meta($userID, "treinador", "Não atribuido", true);

				//Notify user and admin that a new user arrived
				wp_new_user_notification($userID, '', 'both');

				echo '{"userID": "'.$userID.'"}';
			}

			wp_die();
		}

	}


?>