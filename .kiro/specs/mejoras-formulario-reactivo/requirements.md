# Requirements Document

## Introduction

Este spec recoge las mejoras pedidas sobre el formulario reactivo de la página `home` del proyecto **FormularioReactivo** (Ionic + Angular standalone).

El formulario ya existe y captura los datos de un producto de inventario (SKU, nombre, categoría y stock mínimo), con validación mediante Reactive Forms según el dossier de clase. Sobre esa base se abordan cinco bloques de trabajo:

1. **Campo de fecha de nacimiento con calendario.** Existe un intento de implementación en `home.page.html` y `home.page.ts` que compila pero **no abre el calendario al pulsar el campo**. Hay que dejarlo funcionando.
2. **Notificación de envío correcto**, para informar al usuario de que el formulario se ha enviado.
3. **Restricción de la fecha de nacimiento** para que no pueda ser posterior al día de hoy.
4. **Alternancia entre modo oscuro y modo claro** mediante un botón, con una paleta de color definida.
5. **Descarga en PDF** de los datos del formulario recién enviado.

Alcance: la página `home`, el tema global de la aplicación y la generación del PDF en el navegador. No se añade backend ni persistencia remota; el guardado sigue siendo simulado.

## Glossary

- **Calendario**: superficie visual que muestra los días de un mes y permite elegir uno mediante pulsación.
- **Campo de fecha de nacimiento**: control visible en el formulario que muestra la fecha seleccionada y actúa como punto de apertura del calendario.
- **Control `fechaNacimiento`**: control del formulario reactivo, dentro del `FormGroup` `inventarioForm`, donde se almacena el valor de la fecha.
- **Formato ISO**: representación textual de la fecha del tipo `aaaa-mm-dd`, usada internamente para almacenar el valor.
- **Fecha máxima**: límite superior de fechas seleccionables en el calendario.
- **Campo tocado**: estado de un control que indica que el usuario ya ha interactuado con él, y que habilita la visualización de sus mensajes de error.
- **Estado de envío**: periodo durante el cual el formulario simula el guardado de datos y permanece bloqueado.
- **Envío correcto**: finalización satisfactoria del proceso de envío, sin errores.
- **Notificación de confirmación**: aviso visible en pantalla que informa al usuario de que el envío ha concluido correctamente.
- **Modo oscuro**: tema visual de fondos oscuros, que corresponde al aspecto que la aplicación presenta actualmente.
- **Modo claro**: tema visual de fondo crema y botones en lila claro.
- **Lavanda**: color principal de los botones en modo oscuro.
- **Lila claro**: variante más clara del color principal, usada para los botones en modo claro.
- **Crema**: color de fondo de la aplicación en modo claro.
- **Últimos datos enviados**: copia de los valores del formulario correspondientes al último envío correcto, conservada para poder generar el PDF.

## Requirements

### Requirement 1: Visualización del campo de fecha de nacimiento

**User Story:** Como usuario del formulario, quiero ver un campo claramente identificado como "Fecha de nacimiento", para saber que debo aportar ese dato y en qué parte del formulario está.

#### Acceptance Criteria

1. WHEN el usuario abre la página `home` THEN el sistema SHALL mostrar un campo etiquetado como "Fecha de nacimiento" dentro del formulario.
2. WHEN el campo no tiene ninguna fecha seleccionada THEN el sistema SHALL mostrar un texto indicativo que invite a seleccionar una fecha.
3. WHEN el campo tiene una fecha seleccionada THEN el sistema SHALL mostrar esa fecha en formato de día, mes y año legible para el usuario, por ejemplo 25/03/1998.
4. WHEN se renderiza el campo THEN el sistema SHALL presentarlo con el mismo estilo visual que el resto de campos del formulario.

### Requirement 2: Apertura del calendario

**User Story:** Como usuario en un dispositivo móvil, quiero que al pulsar el campo de fecha de nacimiento se abra un calendario visual, para elegir la fecha sin teclearla.

#### Acceptance Criteria

1. WHEN el usuario pulsa sobre el campo de fecha de nacimiento THEN el sistema SHALL abrir un calendario visible en pantalla.
2. WHEN el calendario se abre THEN el sistema SHALL mostrar únicamente selección de fecha, sin selector de hora.
3. WHEN el calendario se abre y el campo ya tiene una fecha seleccionada THEN el sistema SHALL posicionar el calendario en esa fecha.
4. WHEN el calendario se abre y el campo está vacío THEN el sistema SHALL posicionar el calendario en una fecha de partida razonable para introducir una fecha de nacimiento.
5. WHEN el calendario está abierto THEN el sistema SHALL mostrar los nombres de meses y días en español.

### Requirement 3: Selección y confirmación de la fecha

**User Story:** Como usuario, quiero poder confirmar o descartar la fecha que he elegido en el calendario, para tener control sobre el dato que queda guardado en el formulario.

#### Acceptance Criteria

1. WHEN el calendario está abierto THEN el sistema SHALL ofrecer una acción para confirmar la selección y otra para cancelarla.
2. WHEN el usuario confirma la selección THEN el sistema SHALL cerrar el calendario y reflejar la fecha elegida en el campo del formulario.
3. WHEN el usuario cancela la selección THEN el sistema SHALL cerrar el calendario y mantener el valor que el campo tenía antes de abrirlo.
4. WHEN el usuario confirma la selección THEN el sistema SHALL almacenar la fecha en el control `fechaNacimiento` del `FormGroup`.

### Requirement 4: Validación de la fecha de nacimiento

**User Story:** Como responsable de la calidad de los datos, quiero que la fecha de nacimiento sea obligatoria y nunca posterior a hoy, para evitar registros incompletos o imposibles.

#### Acceptance Criteria

1. IF el campo de fecha de nacimiento está vacío THEN el sistema SHALL considerar el control como inválido.
2. WHEN el usuario ha interactuado con el campo y éste es inválido THEN el sistema SHALL mostrar un mensaje de error claro indicando el motivo.
3. WHEN el calendario está abierto THEN el sistema SHALL impedir la selección de fechas posteriores al día actual.
4. IF el control `fechaNacimiento` contiene una fecha posterior al día actual THEN el sistema SHALL considerar el control como inválido y mostrar un mensaje que indique que la fecha no puede ser posterior a hoy.
5. WHILE el campo de fecha de nacimiento sea inválido THE SYSTEM SHALL mantener el botón de envío del formulario deshabilitado.
6. WHEN el usuario envía el formulario estando el campo vacío THEN el sistema SHALL marcar el campo como tocado para que su mensaje de error se haga visible.

### Requirement 5: Integración con el formulario reactivo

**User Story:** Como desarrollador, quiero que el campo de fecha se comporte como cualquier otro control del formulario reactivo, para que la lógica de envío y reinicio siga funcionando sin casos especiales.

#### Acceptance Criteria

1. WHEN se construye el formulario THEN el sistema SHALL declarar el control `fechaNacimiento` dentro del `FormGroup` `inventarioForm` con sus validadores.
2. WHEN el formulario se envía con datos válidos THEN el sistema SHALL incluir el valor de `fechaNacimiento` en el objeto de datos resultante.
3. WHEN el formulario se reinicia tras un envío correcto THEN el sistema SHALL dejar el campo sin valor y mostrar de nuevo el texto indicativo.
4. WHILE el formulario esté en estado de envío THE SYSTEM SHALL impedir que el usuario modifique la fecha de nacimiento.

### Requirement 6: Notificación de envío correcto

**User Story:** Como usuario que acaba de rellenar el formulario, quiero recibir un aviso en pantalla cuando el envío se complete, para saber con certeza que mis datos se han enviado.

#### Acceptance Criteria

1. WHEN el envío del formulario finaliza correctamente THEN el sistema SHALL mostrar una notificación de confirmación visible que informe de que el formulario se ha enviado correctamente.
2. WHEN se muestra la notificación de confirmación THEN el sistema SHALL emplear un color semántico de éxito, sin transmitir el significado únicamente mediante el color.
3. WHEN transcurre un tiempo breve desde que aparece la notificación THEN el sistema SHALL ocultarla automáticamente sin requerir acción del usuario.
4. IF el proceso de envío termina con error THEN el sistema SHALL mostrar un aviso de error en lugar del de confirmación.
5. WHEN el formulario es inválido y el usuario intenta enviarlo THEN el sistema SHALL NOT mostrar la notificación de confirmación.

### Requirement 7: Alternancia entre modo oscuro y modo claro

**User Story:** Como usuario, quiero un botón que cambie la aplicación entre modo oscuro y modo claro, para adaptar la interfaz a mis preferencias o a la luz del entorno.

#### Acceptance Criteria

1. WHEN el usuario abre la aplicación THEN el sistema SHALL mostrar un control visible para cambiar el tema.
2. WHEN la aplicación está en modo oscuro y el usuario acciona el control THEN el sistema SHALL cambiar la interfaz a modo claro.
3. WHEN la aplicación está en modo claro y el usuario acciona el control THEN el sistema SHALL cambiar la interfaz a modo oscuro.
4. WHEN el tema cambia THEN el sistema SHALL aplicarlo a toda la aplicación y no solo al formulario.
5. WHEN el tema cambia THEN el sistema SHALL actualizar el icono o texto del control para reflejar la acción disponible.
6. WHEN el usuario recarga la aplicación THEN el sistema SHALL conservar el último tema que el usuario eligió.
7. WHEN el usuario no ha elegido ningún tema todavía THEN el sistema SHALL partir del modo oscuro, que es el aspecto actual de la aplicación.
8. WHEN se renderiza el control de tema THEN el sistema SHALL proporcionar un nombre accesible que las tecnologías de asistencia puedan anunciar.

### Requirement 8: Paleta de color de la aplicación

**User Story:** Como usuario, quiero que los botones y los fondos sigan una paleta de color concreta en cada tema, para que la aplicación resulte agradable y coherente.

#### Acceptance Criteria

1. WHEN la aplicación está en modo oscuro THEN el sistema SHALL mostrar los botones en color lavanda.
2. WHEN la aplicación está en modo claro THEN el sistema SHALL mostrar el fondo de la aplicación en color crema.
3. WHEN la aplicación está en modo claro THEN el sistema SHALL mostrar los botones en color lila claro.
4. WHEN se muestra texto sobre un botón THEN el sistema SHALL emplear un color de texto que mantenga el contraste suficiente para su lectura en ambos temas.
5. WHEN el tema cambia THEN el sistema SHALL aplicar la paleta correspondiente a todos los botones de la interfaz de forma uniforme.

### Requirement 9: Descarga de los datos enviados en PDF

**User Story:** Como usuario que ha enviado el formulario, quiero descargar un PDF con los datos que acabo de enviar, para conservar un justificante del registro.

#### Acceptance Criteria

1. WHILE no se haya completado ningún envío correcto THE SYSTEM SHALL mantener el control de descarga de PDF no disponible para el usuario.
2. WHEN un envío finaliza correctamente THEN el sistema SHALL poner a disposición del usuario un control para descargar los datos en PDF.
3. WHEN el usuario acciona el control de descarga THEN el sistema SHALL generar un archivo PDF y entregarlo al navegador como descarga.
4. WHEN se genera el PDF THEN el sistema SHALL incluir el código de barras, el nombre del producto, la categoría, el stock mínimo y la fecha de nacimiento correspondientes al último envío correcto.
5. WHEN se genera el PDF THEN el sistema SHALL mostrar la fecha de nacimiento en formato de día, mes y año legible, no en formato ISO.
6. WHEN se genera el PDF THEN el sistema SHALL incluir un título que identifique el documento y la fecha en que se generó.
7. WHEN el formulario se reinicia tras el envío THEN el sistema SHALL conservar los últimos datos enviados para que el PDF siga siendo descargable.
8. WHEN se genera el PDF THEN el sistema SHALL realizar la generación en el propio navegador, sin enviar los datos a ningún servicio externo.

### Requirement 10: Accesibilidad y uso en dispositivos móviles

**User Story:** Como usuario con necesidades de accesibilidad o con un dispositivo móvil, quiero que los campos y botones sean cómodos de usar y comprensibles mediante tecnologías de asistencia, para poder completar el formulario sin barreras.

#### Acceptance Criteria

1. WHEN se renderiza el campo de fecha THEN el sistema SHALL asociar su etiqueta al control de forma que las tecnologías de asistencia la anuncien.
2. WHEN el usuario navega con teclado THEN el sistema SHALL permitir enfocar el campo de fecha y abrir el calendario sin necesidad de ratón ni pantalla táctil.
3. WHEN un campo muestra un mensaje de error THEN el sistema SHALL comunicarlo de forma visual sin basarse únicamente en el color.
4. WHEN los controles se muestran en una pantalla pequeña THEN el sistema SHALL ofrecer un área pulsable suficientemente amplia para accionarse con el dedo.
5. WHEN el usuario abre el calendario THEN el sistema SHALL evitar que el campo quede oculto tras elementos emergentes del sistema operativo.

## Decisiones y supuestos

Estos puntos los he asumido para poder cerrar los requisitos. Si alguno no encaja con lo que pide el profesor, conviene ajustarlo antes de implementar:

- **Fecha máxima igual al día actual.** No se permiten fechas futuras (Requirement 4.3 y 4.4). No se valida edad mínima ni máxima: no se comprueba que el usuario sea mayor de edad.
- **La notificación de confirmación se resuelve como un aviso emergente temporal** del estilo del que ya existe en el formulario, no como un diálogo que obligue a pulsar "Aceptar". El profesor admite "alert o notificación"; si prefiere específicamente un diálogo modal, es un cambio menor.
- **El tema por defecto es el oscuro**, por ser el aspecto actual de la aplicación (Requirement 7.7). Al elegir tema manualmente se deja de seguir la preferencia del sistema operativo.
- **El tema elegido se recuerda entre recargas** guardándolo en el navegador (Requirement 7.6).
- **El botón de PDF aparece deshabilitado u oculto hasta el primer envío correcto**, ya que su contenido depende de datos ya enviados.
- **El PDF se genera en el navegador** y contiene solo los campos del formulario, sin logotipos ni formato corporativo.
- **El campo de fecha de nacimiento se mantiene en el formulario de inventario**, aunque conceptualmente corresponda a una persona y no a un producto, porque es lo pedido sobre el formulario actual.
