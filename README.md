# Alexa-Airtable-Cumpleaños
Skill para preguntar a Alexa cuanto falta para los cumples de casa. Ejemplo de Skill Multimodal.

La tabla está creada en Airtable. Se creó también un formulario de la tabla para que cada miembro de la familia llenase sus datos.

La Skill es una Alexa Hosted Skill en Node.js. Dada mi experiencia en PHP la Skill solo consulta una API creada por mi en un servidor propio que se comunica con Airtable y realiza todos los calculos con las fechas, devolviendo la frase directamente a Alexa y datos adicionales para mostrar en pantalla.

Por facilidad, se creo un solo template y se muestran u ocultan los items de acuerdo a conveniencia.

Airtable https://airtable.com/invite/r/ZvkBiioY

Video de DEMO:
https://www.youtube.com/watch?v=ueWYFTMsIJk

Campos de la tabla en Airtable

fecha: fecha de nacimiento o fecha del evento

nombre: nombre de la persona o del evento

id: el que usará el slot de Alexa para encontrarlo

nombre_dicho: Como Alexa pronunciará el nombre de la persona o del evento

tipo: Cumple/EventoRepetible/EventoNoRepetible


NOTA: Esta tabla puede alimentar una Skill más grande, la uso para otra Skill que maneja datos personales. Direcciónes, números de teléfono, lugar de nacimiento, identificación, etc. Con Airtable es muy fácil editar las tablas.
