<?php
$today = date("Y-m-d");   
$fecha=gmdate("Y-m-d\TH:i:s\Z");
$url = "https://api.airtable.com/v0/[YOUR AIRTABLE API]/personas";
	$ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER,
				array('Content-Type: application/json',
                      'Authorization: Bearer [YOUR AIRTABLE KEY]'));				   
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    $response = curl_exec($ch);
    curl_close($ch);
    //echo $response;
$result = json_decode($response);
$i=-1;
$diferencia_menor=366;
foreach ($result->records as $registro) {
	$i++;
	$id[$i] = $result->records[$i]->id;
	$fecha[$i] = strtotime($result->records[$i]->fields->Fecha);
	$tipo[$i] = $result->records[$i]->fields->Tipo;
	$nombre[$i] = $result->records[$i]->fields->Nombre;
	$nombre_dicho[$i] = $result->records[$i]->fields->Nombre_dicho;	
	$relacion[$i] = $result->records[$i]->fields->Relacion;
	$fecha_db[$i]=date("-m-d", strtotime($result->records[$i]->fields->Fecha));
	$ano = date("Y");
	$fecha_db[$i]=$ano.$fecha_db[$i]; 
	
	
	//$diferencia[$i] = (diferencia ($today, $fecha_db[$i]));
	$diferencia[$i] = (diferencia ($fecha_db[$i], $today));
	
	if ($diferencia[$i]<=0) {
		continue;
	}
	
	//echo abs($diferencia[$i])."<br>";
	
	$diferencia[$i]=abs($diferencia[$i]);
	
	if ($diferencia[$i]<$diferencia_menor) {
		$diferencia_menor=$diferencia[$i];
		$nombre_menor=$nombre_dicho[$i];
		
		if ($tipo[$i]=="Cumple") {
			$mensaje_menor = "cumpleaños será el de";
		} else {
			$mensaje_menor= "evento será";
		}
		
	}
	
}
function diferencia ($hoy, $cumple) {
		$date1=date_create("$cumple");
		$date2=date_create("$hoy");
		$diff=date_diff($date1,$date2);
		$diferencia = $diff->format("%R%a");
		return $diferencia;
}
if ($diferencia_menor>1) {
				$dias="dias";
				$mensaje_dentro="dentro de";
			} else {
				if ($diferencia==1) {
				$dias = "";
				$diferencia="";	
				$mensaje_dentro="y será mañana.";
				} else {
					
				}
			}
$result= "el próximo $mensaje_menor $nombre_menor, $mensaje_dentro $diferencia_menor $dias.";
$text=$result;
//print_r($result->records);
if (isset($result->records)|| ($fecha=="") ) {
	$text="no lo sé";
}
$json_response = array("frase" => $text);
echo json_encode($json_response);
?>
