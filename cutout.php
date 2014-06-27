<?php
	
	$html=$_POST['cutout'];
	$my_file = 'cutout.svg';
	$handle = fopen("temp/".$my_file, 'w') or die('Cannot open file:  '.$my_file); //implicitly creates file
	fwrite($handle, $html);
	fclose($handle);
	// header('Content-Type: image/svg+xml');
	// header('Content-Description: File Transfer');


	$file_name = 'temp/cutout.svg';

// make sure it's a file before doing anything!
if(is_file($file_name)) {

	/*
		Do any processing you'd like here:
		1.  Increment a counter
		2.  Do something with the DB
		3.  Check user permissions
		4.  Anything you want!
	*/

	// required for IE
	if(ini_get('zlib.output_compression')) { ini_set('zlib.output_compression', 'Off');	}

	// get the file mime type using the file extension
	switch(strtolower(substr(strrchr($file_name, '.'), 1))) {
		case 'pdf': $mime = 'application/pdf'; break;
		case 'zip': $mime = 'application/zip'; break;
		case 'jpeg':
		case 'jpg': $mime = 'image/jpg'; break;
		default: $mime = 'application/force-download';
	}
	header('Pragma: public'); 	// required
	header('Expires: 0');		// no cache
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Last-Modified: '.gmdate ('D, d M Y H:i:s', filemtime ($file_name)).' GMT');
	header('Cache-Control: private',false);
	header('Content-Type: '.$mime);
	header('Content-Disposition: attachment; filename="'.basename($file_name).'"');
	header('Content-Transfer-Encoding: binary');
	header('Content-Length: '.filesize($file_name));	// provide file size
	header('Connection: close');
	readfile($file_name);
	// header('Content-Type: image/force-download');
	// header("Content-Disposition: attachment;filename='"+$my_file+"' ");
	
	// echo 'temp/cutout.svg';
}
?>
