<?php
	/*
		Plugin Name: Plugin base com angular
		Plugin URI: 
		Description: Base para construção de plugins com Angular
		Version: 0.0.1
		Author: Emanuel Ralha
		Author URI: 
	*/

// No direct access to this file
defined('ABSPATH') or die('Restricted access');

if (!class_exists("er_base_plugin")){
	class er_base_plugin{

		var $optionsName = "er_base_plugin";
		var $nonceSalt = "er-plugin-nonce-";
		var $dbVersion = "0.2";
		var $table_menssages;

		function er_base_plugin(){
			global $wpdb;

			$table_menssages = $wpdb->prefix.$this->optionsName."_menssagens";

			$this->table_menssages = $table_menssages;
		}

		function init(){
			//wp_register_script( 'angular', plugins_url( 'js/angular.js', __FILE__ ));

			wp_register_style( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' );
			wp_register_style( 'font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' );

    		wp_enqueue_style( 'bootstrap' );
    		wp_enqueue_style( 'font-awesome' );
		}
		function activationHandler(){
			global $wpdb;
			$tabea_ficheiros = $wpdb->prefix.$this->optionsName."_ficheiros";
			$table_menssages = $wpdb->prefix.$this->optionsName."_menssagens";

			$sqlTblFicheiros = "CREATE TABLE ".$tabea_ficheiros." 
			(
				`iIdFicheiro` int(8) NOT NULL auto_increment, 
				`iData` int(32) NOT NULL, 
				`iUserId` int(32) NOT NULL, 
				`iPostId` int(32) NOT NULL, 
				`vchTipo` varchar(255) NOT NULL, 
				`vchPathFicheiro` varchar(255) NOT NULL,
				`vchNomeFicheiro` varchar(255) NOT NULL,
				PRIMARY KEY  (`iIdFicheiro`)
			);";

			require_once(ABSPATH . 'wp-admin/upgrade-functions.php');
			dbDelta($sqlTblFicheiros);
			dbDelta($sqlTblMessagens);

			add_option($this->optionsName."_db_version", $this->dbVersion);
		}
		function deactivationHandler(){
			global $wpdb;

			//$tabea_ficheiros = $wpdb->prefix.$this->optionsName."_ficheiros";
			//$wpdb->query("DROP TABLE IF EXISTS ". $tabea_ficheiros);
		}

		function configAjaxHoocks($class, $hoocks){
			foreach ($hoocks as $key => $value){
				if($value == "priv"){
					add_action( 'wp_ajax_'.$key, array($class, $key) );
				}
				if($value == "nopriv"){
					add_action( 'wp_ajax_nopriv_'.$key, array($class, $key) );
				}
			}
		}

		function generateNonces(){
			$salt = $this->nonceSalt;
			$hoocks = $this->ajaxHoocks;
			$nonces = array();

			if(is_user_logged_in()){
				global $current_user;

				$current_userID = $current_user->data->ID;
				$salt .= $current_userID;
			}

			foreach ($hoocks as $key => $value){
				$hoocks[$key] = wp_create_nonce($salt.$key);

				if(is_user_logged_in() && $value == "priv"){
					$nonces[$key] = $hoocks[$key];
				}
				if($value == "nopriv"){
					$nonces[$key] = $hoocks[$key];
				}
			}

			return json_encode($nonces);
		}

		function verifyNonce($action){
			$salt = $this->nonceSalt;

			if(is_user_logged_in()){
				global $current_user;

				$current_userID = $current_user->data->ID;
				$salt .= $current_userID;
			}

			$error = array(
				"error" => "NOT_ALLOWED",
				"action" => $action
			);

			if (!wp_verify_nonce($_POST["nonce"], $salt.$action)){ die(json_encode($error)); }
		}

		function printAdminPage(){
			global $wpdb;
			global $current_user;

			$pluginDir = str_replace("", "", plugin_dir_url(__FILE__));
			set_include_path($pluginDir);

			$successMSG = "";
			$errorMSG = "";

			$responseHTML = "";

			if(is_user_logged_in()){
				//a view por defeito é a info
				$view = (isset($_GET["view"]))? $_GET["view"] : "list";

				//Se for admin o ecran por defeito é outro
				if($current_user->caps["administrator"] == 1) {
					echo "<script>window.isAdmin = true;</script>";
				}

				$responseHTML .= "<div er-backend-base-dir></div>";

				$responseHTML .= "<link rel='stylesheet' href='".plugins_url( '', __FILE__ )."/css/style.css' type='text/css' />";
				$responseHTML .= "<link rel='stylesheet/less' href='".plugins_url( '', __FILE__ )."/css/less/style.less' type='text/css'>";
  				$responseHTML .= "<script src='".plugins_url( '', __FILE__ )."/js/libs/less-1.3.3.min.js'></script>";

  				$responseHTML .= "<script>var ajaxurl = '".admin_url('admin-ajax.php')."';</script>";
				$responseHTML .= "<script>window.pluginsDir = '".plugins_url( '', __FILE__ )."';</script>";
				$responseHTML .= "<script>window.nonces = ".$this->generateNonces().";</script>";

				$responseHTML .= "<script src='".plugins_url( '', __FILE__ )."/js/libs/angular.min.js'></script>";
				$responseHTML .= "<script src='".plugins_url( '', __FILE__ )."/js/dist/main.min.js?v=1'></script>";

				$responseHTML .= "<script>angular.bootstrap(document, ['backend']);</script>";
			}

			echo $responseHTML;
		}

		function addContent($atts, $content=''){
			global $wpdb;
			global $current_user;

			$current_userID = $current_user->data->ID;
			$pluginDir = str_replace("", "", plugin_dir_url(__FILE__));
			set_include_path($pluginDir);

			$responseHTML = "";

			//if(strpos($content, "[er-plugin-files]") !== false){
				if(is_user_logged_in()){
					$responseHTML .= "<script>window.currentUserId = '".$current_user->data->ID."';</script>";
				}

					$responseHTML .= "<div er-frontend-base-dir></div>";

					$responseHTML .= "<link rel='stylesheet' href='".plugins_url( '', __FILE__ )."/css/style.css' type='text/css' />";
					$responseHTML .= "<link rel='stylesheet/less' href='".plugins_url( '', __FILE__ )."/css/less/style.less' type='text/css'>";
	  				$responseHTML .= "<script src='".plugins_url( '', __FILE__ )."/js/libs/less-1.3.3.min.js'></script>";

	  				$responseHTML .= "<script>var ajaxurl = '".admin_url('admin-ajax.php')."';</script>";
					$responseHTML .= "<script>window.pluginsDir = '".plugins_url( '', __FILE__ )."';</script>";
					$responseHTML .= "<script>window.nonces = ".$this->generateNonces().";</script>";

					$responseHTML .= "<script src='".plugins_url( '', __FILE__ )."/js/libs/angular.min.js'></script>";
					$responseHTML .= "<script src='".plugins_url( '', __FILE__ )."/js/dist/main.min.js?v=1'></script>";

					$responseHTML .= "<script>angular.bootstrap(document, ['frontend']);</script>";

				//$content = str_replace("[er-plugin-files]", $responseHTML, $content);
			//}

			return $responseHTML;
		}
	}
}
if (class_exists("er_base_plugin")) {
	$er_base_plugin = new er_base_plugin();
	/*
		global $_account;
		$_account = $er_base_plugin;
	*/
}

//Actions and Filters
if (isset($er_base_plugin)) {
	//VARS
		$plugindir = plugin_dir_url( __FILE__ );

	//Actions
		register_activation_hook(__FILE__, array($er_base_plugin, 'activationHandler'));
		register_deactivation_hook(__FILE__, array($er_base_plugin, 'deactivationHandler'));
		add_action('init', array($er_base_plugin, 'init'));

		add_action('admin_menu', 'er_base_plugin_init');

		//Hoocking ajax functions by a array config
		include "php__comps/ajax__calls.php";

		$ajaxInterface = new ajax__component();

		//Setting hoocks equal to ajax__component hoocks in order to generate the required nonces
		$er_base_plugin->ajaxHoocks = $ajaxInterface->ajaxHoocks;
		$er_base_plugin->configAjaxHoocks($ajaxInterface, $ajaxInterface->ajaxHoocks);


	//Filters
		//Search the content for galery matches
		//add_filter('the_content', array($er_base_plugin, 'addContent'));
		add_shortcode( 'er-plugin-files', array($er_base_plugin, 'addContent' ) );

	//scripts
}

//Initialize the admin panel
if (!function_exists("er_base_plugin_init")) {
	function er_base_plugin_init() {
		global $er_base_plugin;
		if (!isset($er_base_plugin)) {
			return;
		}
		if ( function_exists('add_submenu_page') ){
			//ADDS A LINK TO TO A SPECIFIC ADMIN PAGE
			add_menu_page('Plugin Base', 'Plugin Base', 'publish_posts', 'plugin-base', array($er_base_plugin, 'printAdminPage'), 'dashicons-nametag');
			/*
				add_submenu_page('enc-screen', 'Gallery List', 'Gallery List', 'publish_posts', 'enc-screen', array($eralha_basket_obj, 'printAdminPage'));
				add_submenu_page('enc-screen', 'Create Gallery', 'Create Gallery', 'publish_posts', 'enc-screen', array($eralha_basket_obj, 'printAdminPage'));
			*/
		}
	}
}
?>