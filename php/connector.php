<?php

error_reporting(0); // Set E_ALL for debuging
@ini_set('display_errors',0);

include_once( dirname(__FILE__).'/Finder.class.php' );


/**
 * Functions for saving and returning data used by the finder
 *
 */
if( session_id() == '' ){
	session_start();
}
function SaveFinderData($data){
	$_SESSION['finder_data'] = $data;
}
function ReturnFinderData(){
	if( isset($_SESSION['finder_data']) ){
		return $_SESSION['finder_data'];
	}
	return false;
}



/**
 * Simple function to demonstrate how to control file access using "accessControl" callback.
 * This method will disable accessing files/folders starting from '.' (dot)
 *
 * @param  string  $attr  attribute name (read|write|locked|hidden)
 * @param  string  $path  file path relative to volume root directory started with directory separator
 * @return bool|null
 **/
function access($attr, $path, $data, $volume) {
	return strpos(basename($path), '.') === 0       // if file/folder begins with '.' (dot)
		? !($attr == 'read' || $attr == 'write')    // set read+write to false, other (locked+hidden) set to true
		:  null;                                    // else Finder decide it itself
}


// Documentation for connector options:
// https://github.com/oyejorge/gpFinder/wiki/Connector-configuration-options
$opts = array(
	// 'debug' => true,
	'saveData' => 'SaveFinderData',
	'returnData' => 'ReturnFinderData',
	'roots' => array(
		array(
			'driver'        => 'LocalFileSystem',   // driver for accessing file system (REQUIRED)
			'path'          => '../files/',         // path to files (REQUIRED)
			'URL'           => dirname($_SERVER['PHP_SELF']) . '/../files/', // URL to files (REQUIRED)
			'accessControl' => 'access'             // disable and hide dot starting files (OPTIONAL)
		)
	)
);

// run
$finder = new Finder($opts);
$finder->run();

