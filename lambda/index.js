// Cuanto Falta con Airtable

const Alexa = require('ask-sdk');
const data = require('./data/cumple.json');
const template = require('./template/cumplet.json');


const BIENVENIDO_MSG = 'Cuanto Falta. ';
const AYUDA_MSG = 'Dime la persona o evento';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
const LaunchRequestHandler = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
  },
handle(handlerInput){
    
     console.log("Cuanto falta saludando!");
    
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    
         data.jrTemplate1.hintText = "";
         data.jrTemplate1.textoPrincipal = "";
         data.jrTemplate1.titulo = "Cuánto Falta";
         data.jrTemplate1.textoPrincipal2 = AYUDA_MSG;
         data.jrTemplate1.textoPrincipal3 = "";
         
        let show = data;

      return handlerInput.responseBuilder
      .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: template,
                datasources: show
            })
      .speak(AYUDA_MSG)
      .reprompt(AYUDA_MSG)
      .getResponse();
   
    } else {
    
    return handlerInput.responseBuilder
      .speak(AYUDA_MSG)
      .reprompt(AYUDA_MSG)
      //.withSimpleCard(handlerInput.t('SKILL_NAME'), cardText)     
      .getResponse();
  }
}  
};
    

function getSlotValue(handlerInput) {
  let slotValue;
  try {
  
    // Toma el Slot del definido y sus sinonimos
    slotValue = handlerInput.requestEnvelope.request.intent.slots.quien.resolutions.resolutionsPerAuthority[0].values[0].value.name;

  } catch (error) {

    slotValue = "error";
  }
  return slotValue;
}

const consultaIntentInProgress = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
    && request.intent.name === 'consultaIntent' 
    && request.dialogState !== 'COMPLETED');
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const responseBuilder = handlerInput.responseBuilder;
    const intent = request.intent;
    
  console.log("Entonces es sobre:");
  
    return responseBuilder
      .addDelegateDirective(intent)
      .getResponse();
  }
}

const consultaIntent = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'consultaIntent');
  },
  
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';
    let quien = getSlotValue(handlerInput);
    let cardText;
    let restantes;
    let restantes_string;
    let separador;
    let nombre_dicho
    let tipo
    console.log("Consultando---->" + quien);

    await getRemoteData('[YOUR PHP API URL]?quien=' + quien)
   
   // Ejemplo de respuesta:
    //{"frase":"El cumplea\u00f1os de mam\u00e1 pig ser\u00e1 dentro de 245 d\u00edas. Cumple: 27","resta":null,"quien":"mam\u00e1","tipo":"Cumple"}
    
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `${data.frase}`+ "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>";
        cardText = `${data.frase}`;
        nombre_dicho = capitalizeFirstLetter(`${data.quien}`);
        tipo = `${data.tipo}`;
        
            console.log(`${data.frase}`);
            
            //EXTRAE SOLO NUMEROS
            var numberPattern = /\d+/g;
            restantes = `${data.frase}`.match( numberPattern )
            restantes_string = restantes.toString()
            separador = restantes_string.split(',');
        
        var str = `${data.frase}`;
        var substr = "mañana";
        var result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech = `${data.name}` + " Ya no falta nada!" + "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>";
        }
        
        str = `${data.frase}`;
        substr = "no lo sé";
        result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech = "<say-as interpret-as=\"interjection\">ay ay ay</say-as>. " + `${data.name}`;
           cardText = "Qué pena, eso no lo sé por ahora."
        }
        
       
        if (`${data.frase}`=="") {
           outputSpeech = "<say-as interpret-as=\"interjection\">ay ay ay</say-as>. " + `${data.name}`;
           cardText = "Qué pena, eso no lo sé por ahora."
        }
        
        //Activar cuando Pepa lloré porquñé no es su cumpleaños, para que Alexa igualmente la felicite.
        /*str = `${data.name}`;
        substr = "El cumpleaños de Pepa será";
        result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech =`${data.name}`+"<say-as interpret-as=\"interjection\">feliz no-cumpleaños</say-as>.";
        }*/
        
        substr = "Hoy";
        result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech = `${data.name}` + "<say-as interpret-as=\"interjection\">Felicidades</say-as>." + "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>";
        }
        
        substr = "Hoy es El cumplea\u00f1os";
        result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech = `${data.name}` + "<say-as interpret-as=\"interjection\">Felicidades</say-as>";
        }
        
        substr = "viaje";
        result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech = `${data.name}` + "<audio src='soundbank://soundlibrary/transportation/amzn_sfx_airplane_takeoff_whoosh_01'/>";
        }
        
        substr = "mamá";
        result = str.indexOf(substr) > -1;
        if (result == true) {
           outputSpeech = `${data.name}` + "<audio src='soundbank://soundlibrary/musical/amzn_sfx_test_tone_01'/> años." + "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>";
        }
      })
      .catch((err) => {
        //set an optional error message here
        console.log("Error" + err);
        outputSpeech = "En este momento no puedo saber esos datos, pregúntame más tarde";
      });

       if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
           
        
         //Ya que se usa una solo templeta para Multimodal, se modifica ocultando o mostrando los distintos items dependiendo del caso
         if (tipo=="Cumple") {
         data.jrTemplate1.hintText = "Cumplirá " + separador[1] + " años.🎂";
         data.jrTemplate1.textoPrincipal = separador[0];
         data.jrTemplate1.titulo = nombre_dicho;
         data.jrTemplate1.textoPrincipal2 = "";
         data.jrTemplate1.textoPrincipal3 = "días";
         } else {
        
        if (tipo=="EventoRepetible") {
         data.jrTemplate1.hintText = "";
         data.jrTemplate1.textoPrincipal = separador[0];
         data.jrTemplate1.titulo = nombre_dicho;
         data.jrTemplate1.textoPrincipal2 = "";
         data.jrTemplate1.textoPrincipal3 = "días";
         
         } else {
         
         if (tipo=="EventoNoRepetible") {
         data.jrTemplate1.hintText = outputSpeech;
         data.jrTemplate1.textoPrincipal = "";
         data.jrTemplate1.titulo = "";
         data.jrTemplate1.textoPrincipal2 = nombre_dicho;
         data.jrTemplate1.textoPrincipal3 = "";
         
         } else {
         
          if (tipo=="Viaje") {
         data.jrTemplate1.hintText = outputSpeech;
         data.jrTemplate1.textoPrincipal = "";
         data.jrTemplate1.titulo = "";
         data.jrTemplate1.textoPrincipal2 = "";
         data.jrTemplate1.textoPrincipal3 = nombre_dicho;
         
         } else {
        
         data.jrTemplate1.hintText = outputSpeech;
         data.jrTemplate1.textoPrincipal = "";
         data.jrTemplate1.titulo = "";
         data.jrTemplate1.textoPrincipal2 = "";
         data.jrTemplate1.textoPrincipal3 = nombre_dicho;
         }
         }
         }
         }

        let show = data;

      return handlerInput.responseBuilder
      .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: template,
                datasources: show
            })
      .speak(outputSpeech)
      .reprompt(AYUDA_MSG)
      .withShouldEndSession(true)
      .getResponse();
   
    } else {
    
     return handlerInput.responseBuilder
      .speak(outputSpeech)
      .withSimpleCard(SKILL_NAME, cardText)
      .withShouldEndSession(true)
      //.reprompt("Dime que deseas?")
      .getResponse();
  }
}  
};
      

const proximoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'proximoIntent';
    },
    
    async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';
    //let quien = getSlotValueQuien(handlerInput);
   
    let cardText;
    console.log("Próximo");

    await getRemoteData('[YOUR API TO GET NEXT EVENT]')

      .then((response) => {
        const data = JSON.parse(response);
        
        outputSpeech = `${data.name}`
         outputSpeech = `${data.name}`
         cardText = outputSpeech; 
        
        console.log(`${data.name}`);
      
      })
      .catch((err) => {
        //set an optional error message here
        console.log("Error" + err);
        outputSpeech = "En este momento no puedo saber esos datos, pregúntame más tarde";
      });
      
    return handlerInput.responseBuilder
      .speak(outputSpeech + ". Qué deseas hacer?")
      .withSimpleCard(SKILL_NAME, cardText)
      //.withShouldEndSession(true)
      .reprompt("Qué deseas hacer?. Di ayuda si necesitas más información.")
      .getResponse();

  },
};


const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt("Si quieres realizar otra búsqueda dime de, y el nombre, sino, di salir.")
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(ERROR)
      .reprompt(ERROR)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ERROR = 'Lo siento, ha ocurrido un error';
const SKILL_NAME = 'Cuanto falta';
const HELP_MESSAGE = AYUDA_MSG;
const HELP_REPROMPT = 'Como te puedo ayudar?';
const STOP_MESSAGE = 'Adiós!';


const UnhandledHandler = {
  canHandle(handlerInput){
    return true;
  },
  handle(handlerInput){
    return handlerInput.responseBuilder
      .speak('No se como hacer eso')
      //.speak(handlerInput.requestEnvelope.request.intent.name)
      .getResponse();
  }
}

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    consultaIntentInProgress,
    consultaIntent,
    proximoIntentHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    UnhandledHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
