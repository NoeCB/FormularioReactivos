# Requirements Document

## Introduction

El formulario reactivo de la página `home` (alta de productos de inventario) necesita un campo adicional de **fecha de nacimiento** que permita al usuario seleccionar una fecha mediante un calendario visual, en lugar de escribirla a mano.

Actualmente existe un intento de implementación en `home.page.html` y `home.page.ts` que compila correctamente pero **no muestra el calendario al pulsar el campo**. El propósito de este spec es fijar con claridad el comportamiento esperado antes de corregir la implementación, evitando seguir probando variantes de componentes a ciegas.

El campo debe integrarse con el `FormGroup` existente (`inventarioForm`), respetar el paradigma de Reactive Forms descrito en el dossier de clase, y usar componentes nativos de Ionic para garantizar una experiencia adecuada en Android e iOS.

Alcance: únicamente el campo de fecha de nacimiento y su integración con el formulario existente. No se modifican los demás campos (SKU, nombre, categoría, stock mínimo) ni la lógica de envío.

## Glossary

- **Calendario**: superficie visual que muestra los días de un mes y permite elegir uno de ellos mediante pulsación.
- **Campo de fecha de nacimiento**: control visible en el formulario que muestra la fecha seleccionada y actúa como punto de apertura del calendario.
- **Control `fechaNacimiento`**: control del formulario reactivo, dentro del `FormGroup` `inventarioForm`, donde se almacena el valor de la fecha.
- **Formato ISO**: representación textual de la fecha del tipo `aaaa-mm-dd`, usada internamente para almacenar el valor.
- **Fecha máxima**: límite superior de fechas seleccionables en el calendario.
- **Campo tocado**: estado de un control del formulario que indica que el usuario ya ha interactuado con él, y que habilita la visualización de sus mensajes de error.
- **Estado de envío**: periodo durante el cual el formulario está simulando el guardado de datos y permanece bloqueado.

## Requirements

### Requirement 1: Visualización del campo en el formulario

**User Story:** Como usuario del formulario, quiero ver un campo claramente identificado como "Fecha de nacimiento", para saber que debo aportar ese dato y en qué parte del formulario está.

#### Acceptance Criteria

1. WHEN el usuario abre la página `home` THEN el sistema SHALL mostrar un campo etiquetado como "Fecha de nacimiento" dentro del formulario de inventario.
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

### Requirement 4: Validación del campo

**User Story:** Como responsable de la calidad de los datos, quiero que la fecha de nacimiento sea obligatoria y coherente, para evitar registros incompletos o imposibles.

#### Acceptance Criteria

1. IF el campo de fecha de nacimiento está vacío THEN el sistema SHALL considerar el control como inválido.
2. WHEN el usuario ha interactuado con el campo y éste es inválido THEN el sistema SHALL mostrar un mensaje de error claro indicando que la fecha de nacimiento es obligatoria.
3. WHEN el calendario está abierto THEN el sistema SHALL impedir la selección de fechas posteriores al día actual.
4. WHILE el campo de fecha de nacimiento sea inválido THE SYSTEM SHALL mantener el botón de envío del formulario deshabilitado.
5. WHEN el usuario envía el formulario estando el campo vacío THEN el sistema SHALL marcar el campo como tocado para que su mensaje de error se haga visible.

### Requirement 5: Integración con el formulario reactivo

**User Story:** Como desarrollador, quiero que el campo se comporte como cualquier otro control del formulario reactivo, para que la lógica de envío y reinicio siga funcionando sin casos especiales.

#### Acceptance Criteria

1. WHEN se construye el formulario THEN el sistema SHALL declarar el control `fechaNacimiento` dentro del `FormGroup` `inventarioForm` con sus validadores.
2. WHEN el formulario se envía con datos válidos THEN el sistema SHALL incluir el valor de `fechaNacimiento` en el objeto de datos resultante.
3. WHEN el formulario se reinicia tras un envío correcto THEN el sistema SHALL dejar el campo sin valor y mostrar de nuevo el texto indicativo.
4. WHILE el formulario esté en estado de envío THE SYSTEM SHALL impedir que el usuario modifique la fecha de nacimiento.

### Requirement 6: Accesibilidad y uso en dispositivos móviles

**User Story:** Como usuario con necesidades de accesibilidad o con un dispositivo móvil, quiero que el campo de fecha sea cómodo de usar y comprensible mediante tecnologías de asistencia, para poder completar el formulario sin barreras.

#### Acceptance Criteria

1. WHEN se renderiza el campo THEN el sistema SHALL asociar la etiqueta "Fecha de nacimiento" al control de forma que las tecnologías de asistencia la anuncien.
2. WHEN el usuario navega con teclado THEN el sistema SHALL permitir enfocar el campo y abrir el calendario sin necesidad de ratón ni pantalla táctil.
3. WHEN el campo muestra un mensaje de error THEN el sistema SHALL comunicarlo de forma visual sin basarse únicamente en el color.
4. WHEN el campo se muestra en una pantalla pequeña THEN el sistema SHALL ofrecer un área pulsable suficientemente amplia para accionarse con el dedo.
5. WHEN el usuario abre el calendario THEN el sistema SHALL evitar que el campo quede oculto tras elementos emergentes del sistema operativo.

## Decisiones y supuestos

Estos puntos los he asumido para poder cerrar los requisitos. Si alguno no encaja con el enunciado, conviene ajustarlo antes de pasar al diseño:

- **No se permiten fechas futuras.** La fecha máxima seleccionable es el día actual (Requirement 4.3).
- **No se exige edad mínima ni máxima.** No se valida que el usuario sea mayor de edad. Si el ejercicio lo pide, habría que añadir un criterio adicional.
- **El campo es obligatorio**, en coherencia con el resto de campos del formulario.
- **El valor se almacena en formato ISO** internamente, aunque al usuario se le muestre como día/mes/año.
- **El campo se añade al formulario de inventario existente**, aunque conceptualmente una fecha de nacimiento corresponde a una persona y no a un producto. Se mantiene así porque es lo pedido sobre el formulario actual.
