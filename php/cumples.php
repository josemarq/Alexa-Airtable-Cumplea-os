<?php
$today = date("Y-m-d");   
$quien = $_REQUEST['quien'];
$fecha=gmdate("Y-m-d\TH:i:s\Z");
$url = "https://api.airtable.com/v0/[YOUR AIRTABLE API]/personas?view=Grid%20view&filterByFormula=SEARCH('".$quien."'%2C+%7Bid%7D)";
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
foreach ($result->records as $registro) {
	$i++;
	$id = $result->records[$i]->id;
	$fecha = strtotime($result->records[$i]->fields->Fecha);
	$tipo = $result->records[$i]->fields->Tipo;
	$nombre = $result->records[$i]->fields->Nombre;
	$nombre_dicho = $result->records[$i]->fields->Nombre_dicho;	
}
	// Fecha de cumpleaños en formato Y-M-D
	$fecha_db = date("Y-m-d", $fecha);
	//echo $fecha_db;
	//Fecha del próximo cumpleaños
	$time = $fecha;
  $dateInLocal = date("-m-d", $time);
	$ano = date("Y"); 
	$dateInLocal = $ano.$dateInLocal
if ($tipo=="Cumple") {	
	$result= calcula3($today, $dateInLocal, $nombre_dicho, "El cumpleaños de", $fecha_db);
}
if ($tipo=="EventoRepetible") {
	$result= calcula($today, $dateInLocal, $nombre_dicho, "");
}
if ($tipo=="EventoNoRepetible") {
if ($_REQUEST['quien']=="viaje") {
	$result= calcula2($today, $fecha_db, $nombre_dicho, "Tu ");
} else {
	$result= calcula2($today, $fecha_db, $nombre_dicho, "");
}
}
// Funciones
function diferencia ($hoy, $cumple) {
		$date1=date_create("$cumple");
		$date2=date_create("$hoy");
		$diff=date_diff($date1,$date2);
		$diferencia = $diff->format("%R%a");
		return $diferencia;
}
function edad ($hoy, $cumple) {
	$d1 = new DateTime($cumple);
	$d2 = new DateTime($hoy);
	$diff = $d2->diff($d1);
	$anos=  $diff->y;
		$date1=date_create("$cumple");
		$date2=date_create("$hoy");
		$diff=date_diff($date1,$date2);
		$diferencia = $diff->format("%R%a");
		return $anos;
}
function calcula ($today, $f_cumple, $quien, $mensaje) {
	if ($today==date($f_cumple)) {
		$result="Hoy es $mensaje $quien. ";
	} else {
		if ($today < date($f_cumple)) {
		$diferencia = abs (diferencia ($today, $f_cumple));
			if ($diferencia>1) {
				$dias="dias";
				$mensaje_dentro="será dentro de";
			} else {
				if ($diferencia==1) {
				$dias = "";
				$diferencia="";	
				$mensaje_dentro="será mañana";
				} else {
					
				}
			}
			
		$result = $mensaje." $quien $mensaje_dentro ".$diferencia." ".$dias;
	
		} else {
			
		$f_cumple = date ("Y-m-d", strtotime("+1 year", strtotime($f_cumple)));			
		
			$diferencia=  abs(diferencia ($today, $f_cumple));
		
			if ($diferencia>1) {
				$dias="dias";
			} else {
				$dias = "dia";
			}
			$result = "$mensaje $quien será dentro de ".$diferencia." ".$dias;	
	}
	}
	return($result);
}
// CALCULA CON EDAD
function calcula3 ($today, $f_cumple, $quien, $mensaje, $f_nac) {
	if ($today==date($f_cumple)) {
$years = abs (edad($f_nac, $f_cumple));
			
			if ($years>1) {
				$years_name="años";
			} else {
				$years="un";
				$years_name = "año";
			}		$result="Hoy es $mensaje $quien. Cumple: ".$years." $years_name.";
	} else {
		if ($today < date($f_cumple)) {
		$diferencia = abs (diferencia ($today, $f_cumple));
			if ($diferencia>1) {
				$dias="días";
				$mensaje_dentro="será dentro de";
			} else {
				if ($diferencia==1) {
				$dias = "";
				$diferencia="";	
				$mensaje_dentro="será mañana";
				} else {
					
				}
			}
			
			$years = abs (edad($f_nac, $f_cumple));
			
			if ($years>1) {
				$years_name="años";
			} else {
				$years="un";
				$years_name = "año";
			}
			
	
			$result = $mensaje." ".$quien." ".$mensaje_dentro." ".$diferencia." ".$dias. ". Cumple: ".$years." $years_name.";
	
		} else {
			
		$f_cumple = date ("Y-m-d", strtotime("+1 year", strtotime($f_cumple)));			
		
			$diferencia=  abs(diferencia ($today, $f_cumple));
		
			if ($diferencia>1) {
				$dias="días";
			} else {
				$dias = "día";
			}
			
			
			$years = abs (edad($f_cumple, $f_nac));
			//$years = $years % 365; 
			//
			
			if ($years>1) {
				$years_name="años";
			} else {
				$years_name = "año";
			}
	
			
			//<say-as interpret-as=\"unit\">
			
			$result = $mensaje." $quien será dentro de ".$diferencia." ".$dias. ". Cumple: ".$years." $years_name";
			//$result = "$mensaje $quien será dentro de ".$diferencia." ".$dias;	
	}
	}
	return($result);
}
	
	$GLOBALS['$dias_g'] = $diferencia;
	return($result);
}
function calcula2 ($today, $f_cumple, $quien, $mensaje) {
	if ($today==date($f_cumple)) {
		$result="Hoy es $mensaje $quien.";
	} else {
		if ($today < date($f_cumple)) {
		$diferencia = abs (diferencia ($today, $f_cumple));
			if ($diferencia>1) {
				$dias="días";
				$mensaje_dentro="será dentro de ";
			} else {
				if ($diferencia==1) {
				$dias = "";
				$diferencia="";	
				$mensaje_dentro="será mañana";
				} else {
					
				}
			}
			
			$result = $mensaje." $quien $mensaje_dentro".$diferencia." ".$dias;
	
		} else {
			
				setlocale(LC_ALL,"es_ES.UTF-8");
				$dayname = date('D', strftime($row["date"])); // returns the three letter representation of the day.
				$date = DateTime::createFromFormat("Y-m-d", $f_cumple);
		
				$ano = strftime("%A %d de %B de %Y",$date->getTimestamp());
			$result = "$mensaje $quien ya ha pasado, fúe el ".$ano;	
	}
	}
	return($result);
}
if ($_REQUEST['quien']=="error") {
		$result= "Eso  no lo sé. Cada día aprendo un poco más, porqué no me preguntas eso luego.";
}
$text=$result;
if (isset($result->records)) {
	$text="no lo sé";
}
$json_response = array("frase" => $text, "resta" => $diferencia, "quien" => $nombre_dicho, "tipo" => $tipo);
echo json_encode($json_response);
?>
