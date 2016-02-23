<?php

require "/usr/share/elasticsearch/work/vendor/autoload.php";

$params = array();
$params['hosts'] = array (
	'192.168.33.10:9200',                 // IP + Port
	'http://192.168.33.10:9200',         // http + IP + Port
	);

$client = new Elasticsearch\Client($params);

$price = $_POST['price'];

$searchparams = array();
$searchparams['index'] = 'hamalocation1';
$searchparams['type'] = 'api';

$query = array();

$query=array("match_all" =>array());

$input=$_POST['points'];

$inputArray = explode('),(', mb_substr($input, 1, mb_strlen($input) - 2));
$points = array_map(function($row) {
	return array_map('floatval', explode(',', $row));
	}, $inputArray);

$must = array(
	array("geo_polygon"=>array("api.pin"=>array("points" =>$points))),
	array("range"=> array("price" => array("from" =>$price)) )
	);

$filter = array();
$filter['bool']['must']= $must;


$searchparams['body']['query']['filtered'] = array(
	"filter" => $filter,
	"query" => $query
	);


$results = $client->search($searchparams);
print_r(json_encode($results));

?>
