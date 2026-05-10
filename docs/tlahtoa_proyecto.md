# Tlahtoa — Documento de diseño de juego de mesa
> Documento de referencia para desarrollo del prototipo. Generado desde sesión de diseño colaborativo.

---

## Concepto central

**Tlahtoa** (náhuatl: "hablar / gobernar") es un juego de mesa cooperativo para 4-5 jugadores ambientado en una ciudad-estado mesoamericana del período Posclásico. El consejo de la ciudad debe sobrevivir una serie de crisis — sequías, epidemias, invasiones, eventos rituales — durante 8 a 10 ciclos rituales según el escenario elegido.

**No hay traidor. No hay jugador alfa.** La tensión nace de decisiones colectivas con información incompleta, recursos escasos, y un dado que convierte cada evento en una apuesta.

---

## Estado del diseño

| Sistema | Estado |
|---|---|
| Recursos globales | ✅ Definido |
| Roles y habilidades | ✅ Definido con árbol de objetivos |
| Sistema de votación | ✅ Definido |
| Mazo de eventos + dado | ✅ Definido |
| Ciudades aliadas | ✅ Definido (2 fijas + 2 aleatorias) |
| Sistema militar | ✅ Definido (redadas, sitios, infiltración) |
| Progresión de nivel | ✅ Definido (1 subida por ciclo, votación) |
| Escenarios | ✅ 3 definidos |
| Tablero | ✅ Diseñado conceptualmente |
| Cartas físicas | ⚠️ Pendiente de arte y diagramación |
| Reglamento formal | ⚠️ Pendiente |
| Prototipo físico | ⏳ No iniciado |
| Playtest | ⏳ No iniciado |

---

## Recursos globales

Cinco recursos con marcadores de track (círculos en el tablero). Los valores son cantidad actual / máximo.

| Recurso | Nombre náhuatl | Máximo | Produce | Notas |
|---|---|---|---|---|
| Maíz | Tlaolli | 10 | Barrio norte (+1/ciclo) | Se consume 1 por barrio activo por ciclo |
| Copal | Copalli | 8 | Ritual del Sacerdote | Baja −1 automático si no hubo ritual ese ciclo |
| Jade | Chalchiuitl | 6 | Barrio sur (+1/ciclo) | Recurso de intercambio, no decae solo |
| Fuerza de trabajo | — | 8 | Barrio este (+1/ciclo) | Techo máximo: 7. Cuesta Maíz construir |
| Conocimiento | Toltecayotl | 8 | Barrio oeste (+1/ciclo) | Solo se pierde por eventos, no decae |

### Barrios de la ciudad

| Barrio | Producción | Capacidad inicial |
|---|---|---|
| Norte — Milpa | +1 Maíz/ciclo | Activo |
| Sur — Mercado | +1 Jade/ciclo | Activo |
| Este — Artesanos | +1 FT/ciclo | Activo |
| Oeste — Escribas | +1 Conocimiento/ciclo | Activo |
| Centro — Templo Mayor | +1 Copal/ritual | Activo |

Un barrio caído deja de producir. Su ficha se voltea. Puede reactivarse con acciones específicas según el escenario.

---

## Flujo de un ciclo ritual

Cada ciclo tiene 5 fases en orden estricto:

### Fase 1 — Amanecer
- El Astrónomo (si tiene pasiva desbloqueada) ve la próxima carta de evento en secreto
- Puede comunicar la **categoría** al grupo pero no mostrar la carta
- El grupo decide si usa esta información para prepararse

### Fase 2 — Consejo (dos votaciones)

**Votación A — Prioridad de progresión**
- El grupo vota en secreto quién sube de nivel este ciclo
- Solo 1 jugador puede avanzar por ciclo
- En empate: el jugador con el recurso más bajo en su especialidad gana automáticamente
- Si hay triple empate: nadie sube ese ciclo

**Votación B — Política del ciclo**
- Se revela la carta de política vigente
- Cada jugador vota en secreto entre las dos opciones
- La mayoría decide. Los votos se revelan después.
- Victoria por mayoría: +1 Copal por unidad
- Derrota por rechazo: −1 Copal por desacuerdo
- Empate: el General decide, −1 FT

### Fase 3 — Acciones individuales
Cada jugador tiene **2 puntos de acción** por ciclo. Las acciones son simultáneas.

**Acciones disponibles para cualquier rol:**
- Cultivar: +2 Maíz (cuesta 1 acción)
- Construir: +1 FT (cuesta 1 acción + 1 Maíz)
- Estudiar: +1 Conocimiento (cuesta 1 acción)
- Descansar: recupera 1 recurso propio (cuesta 2 acciones)
- Comerciar: usa una ruta comercial (cuesta 1 acción)
- Ritual: +1 Copal, previene decay automático (cuesta 1 acción, solo Sacerdote o Templo Mayor)

**Acciones especiales de rol:** ver sección de roles.

### Fase 4 — Evento
- Se revela la carta de evento del mazo
- El grupo decide: **aceptar daño fijo** o **apostar con el dado**
- Se aplican modificadores de rol si están disponibles
- Se resuelve el efecto + la política de respuesta votada en fase 2

### Fase 5 — Consumo
- Maíz −1 por barrio activo
- Si no hay Maíz suficiente: FT −1 por barrio sin alimentar
- Copal −1 si no hubo ritual ese ciclo
- Conocimiento: no decae (solo baja por eventos)
- Se avanza el marcador de ciclo

---

## Sistema de dado

Un d6 estándar. Antes de cada evento el grupo decide si acepta el **daño fijo** escrito en la carta o apuesta tirando el dado.

| Cara | Resultado | Efecto |
|---|---|---|
| 1 | Catástrofe | Daño ×2 + efecto secundario de la carta |
| 2 | Grave | Daño ×1.5 redondeado arriba |
| 3 | Normal | Daño base exacto (igual al daño fijo) |
| 4 | Leve | Daño base −1 |
| 5 | Menor | Daño reducido a la mitad |
| 6 | Desviado | Sin daño (no hay ganancia de recursos) |

### Modificadores al dado por rol
- **General**: gasta 1 FT → resta 1 al resultado (mínimo 1). Solo amenazas militares.
- **Sacerdote**: cancela el dado completamente en eventos rituales. Aún se aplica daño base.
- **Curandera**: puede volver a tirar si el resultado fue 1 o 2. Solo epidemias. Cuesta 1 Conocimiento.
- **Astrónomo**: si vio la carta antes, el grupo apuesta con información completa sobre la categoría.

### Regla de diseño
El resultado 6 cancela el daño pero **no otorga recursos extra**. Esto evita que apostar sea una máquina de recursos en eventos leves.

---

## Los cinco roles

### Teopixqui — el Sacerdote
**Especialidad:** Copal y eventos rituales

#### Árbol de objetivos
**Nivel 0 (inicio):** Sin habilidades. *En escenario difícil: pasiva desbloqueada desde el inicio.*

**Nivel 1 — Primera ritual**
- Requisito: realizar la acción de ritual 2 veces en los primeros 3 ciclos
- Desbloquea pasiva: el Copal nunca baja más de 1 por evento, sin importar el dado

**Nivel 2 — Elegir rama:**

*Rama A — Guardián del templo*
- Requisito: mantener Copal en 3 o más durante 2 ciclos consecutivos
- Activa A: cancela el dado de un evento ritual. Cuesta Copal −1.
- Cooldown: 1 ciclo. Se recarga gastando 1 Copal en fase de acciones.

*Rama B — Intérprete de señales*
- Requisito: atravesar 2 eventos rituales sin que Copal llegue a cero
- Activa B: convierte resultado de dado 1 o 2 en resultado 3. Cuesta Copal −2.
- Cooldown: 2 ciclos. Se recarga con ritual completo.

**Nivel 3 — Gran sacerdote**
- Requisito: llegar al ciclo 6 con Copal en máximo
- Especial: una vez por partida, cancela completamente un evento de cualquier tipo. Sin dado, sin daño.
- Sin recarga. Se pierde permanentemente si Copal llega a cero antes del ciclo 6.

---

### Cuāuhpilli — el General
**Especialidad:** Amenazas militares y Fuerza de trabajo

#### Árbol de objetivos
**Nivel 1 — Primera defensa**
- Requisito: enfrentar cualquier amenaza militar sin perder FT los primeros 2 ciclos
- Desbloquea pasiva: redadas nunca reducen FT más de 1, sin importar el dado

**Nivel 2 — Elegir rama:**

*Rama A — Estratega*
- Requisito: resolver un sitio prolongado antes de que entre en fase 2
- Activa A: gasta 2 FT para detener un sitio en cualquier fase. FT mínima para usarla: 3.
- Cooldown: 2 ciclos. Se recarga construyendo en barrio militar.

*Rama B — Diplomático de guerra*
- Requisito: convertir una tribu nómada en aliada antes del ciclo 5
- Activa B: gasta 1 FT para restar 2 al resultado del dado en eventos militares.
- Cooldown: 1 ciclo. Se recarga si FT termina el ciclo en 5 o más.

**Nivel 3 — Comandante supremo**
- Requisito: mantener FT en 4 o más durante 3 ciclos consecutivos
- Especial: una vez por partida convierte cualquier amenaza militar en aliada temporal (2 ciclos de ruta comercial extra).
- Sin recarga. Se pierde si FT llega a 0 en cualquier momento.

---

### Pochtecatl — el Comerciante
**Especialidad:** Jade y rutas comerciales. *Opcional en partidas de 4 jugadores.*

#### Árbol de objetivos
**Nivel 1 — Primera ruta activa**
- Requisito: usar una ruta comercial en cada uno de los primeros 2 ciclos
- Desbloquea pasiva: al comerciar recibe +1 del recurso obtenido

**Nivel 2 — Elegir rama:**

*Rama A — Mercader mayor*
- Requisito: comerciar 4 veces con la misma ciudad a lo largo de la partida
- Activa A: abre una ruta bloqueada sin gastar acción. Jade −1.
- Cooldown: 2 ciclos. Se recarga comerciando ese ciclo.

*Rama B — Explorador de rutas*
- Requisito: usar las 4 rutas disponibles al menos una vez
- Activa B: puede comerciar dos veces en la misma fase de acciones. Segunda transacción sin bonificación de pasiva.
- Cooldown: 1 ciclo. Se recarga automáticamente.

**Nivel 3 — Señor del mercado**
- Requisito: llegar al ciclo 7 con Jade en 1 o más
- Especial: una vez por partida negocia intercambio libre — cualquier recurso por cualquier recurso en proporción 1:2 sin ciudad aliada.
- Sin recarga. Se pierde si Jade llega a cero en cualquier momento.

---

### Ticitl — la Curandera
**Especialidad:** Fuerza de trabajo y epidemia

#### Árbol de objetivos
**Nivel 1 — Primera sanación**
- Requisito: usar la acción de sanar en 2 ciclos distintos de los primeros 3
- Desbloquea pasiva: la epidemia no avanza en el barrio que ella protege ese ciclo

**Nivel 2 — Elegir rama:**

*Rama A — Sanadora de barrio*
- Requisito: mantener todos los barrios activos hasta el ciclo 5
- Activa A: recupera 2 FT gastando 1 Conocimiento. Solo usable si hay epidemia activa.
- Cooldown: 2 ciclos. Se recarga si la epidemia sigue activa al inicio del ciclo.

*Rama B — Médica de campo*
- Requisito: atravesar 2 cartas de epidemia sin que FT llegue a cero
- Activa B: en eventos de epidemia puede repetir el dado una vez si el resultado fue 1 o 2. Cuesta Conocimiento −1.
- Cooldown: 1 ciclo. Se recarga automáticamente.

**Nivel 3 — Gran sanadora**
- Requisito: gastar 3 Conocimiento en una sola fase de acciones cuando la epidemia está activa
- Especial: elimina el marcador de epidemia del tablero permanentemente.
- Efecto permanente. Es la única forma de eliminar la epidemia del juego.

---

### Tonalpouhqui — el Astrónomo
**Especialidad:** Conocimiento y predicción de eventos

#### Árbol de objetivos
**Nivel 1 — Primera observación**
- Requisito: mantener Conocimiento en 3 o más durante los primeros 2 ciclos
- Desbloquea pasiva: ve la próxima carta de evento al inicio de cada ciclo. Solo puede comunicar la **categoría**, no el contenido exacto.

**Nivel 2 — Elegir rama:**

*Rama A — Calculador de ciclos*
- Requisito: mantener Conocimiento en 2 o más durante 3 ciclos consecutivos
- Activa A: retrasa un evento un ciclo completo. La carta vuelve al mazo en posición aleatoria. Conocimiento −2.
- Cooldown: 3 ciclos. Se recarga estudiando 2 veces en el mismo ciclo.

*Rama B — Lector de presagios*
- Requisito: el grupo apuesta el dado en 3 eventos donde el Astrónomo avisó correctamente la categoría
- Activa B: ve las 2 próximas cartas y puede revelar el tipo exacto al grupo. Conocimiento −1.
- Cooldown: 1 ciclo. Se recarga si Conocimiento termina el ciclo en 3 o más.

**Nivel 3 — Maestro del calendario**
- Requisito: llegar al ciclo 5 con Conocimiento en máximo
- Especial: una vez por partida reorganiza las 3 próximas cartas del mazo en el orden que elija. Conocimiento −3.
- Sin recarga. Se pierde si Conocimiento llega a cero en cualquier momento.

---

## Sistema de amenazas militares

Tres tipos con diferente frecuencia según dificultad.

### Redadas — frecuentes, impacto inmediato
Golpean un recurso o barrio y desaparecen ese mismo ciclo.

| Carta | Daño base | Efecto secundario (dado=1) |
|---|---|---|
| Guerreros chichimecas | FT −2 | Copal −1 por pánico |
| Emboscada en ruta | Jade −2 si se usó esa ruta | Jade −1 adicional |
| Saqueo de milpa | Maíz −2 | Barrio norte inactivo 1 ciclo |

### Sitios prolongados — ocasionales, escalan por fases
Se instalan y empeoran cada ciclo hasta que el General los resuelve.

| Carta | Fase 1 | Fase 2 (si no se resuelve) |
|---|---|---|
| Ejército purépecha | Copal −1, rutas este y oeste bloqueadas | FT −2/ciclo, barrio en pánico |
| Campamento otomí | Maíz −1 por saqueo menor | Redada automática cada ciclo |

### Infiltración — raros, silenciosos
Solo el Astrónomo los detecta antes de que activen su efecto.

| Carta | Efecto si no se detectan | Respuesta del General |
|---|---|---|
| Espías tlaxcaltecas | El voto del próximo consejo se invierte | Activa B: 1 FT los expulsa |
| Comerciantes mayas | Conocimiento −1/ciclo sin que el marcador sea visible hasta fin de ciclo | Activa B: expulsarlos devuelve 1 Conocimiento |

### Frecuencia por dificultad

| Tipo | Fácil | Normal | Difícil |
|---|---|---|---|
| Redadas | 3 cartas | 5 cartas | 7 cartas |
| Sitios | 1 carta | 2 cartas | 3 cartas |
| Infiltración | 0 cartas | 1 carta | 2 cartas |

---

## Ciudades aliadas

**2 ciudades fijas** — siempre presentes, nunca se bloquean.
**2 ciudades aleatorias** — se roban de un mazo de 8 al inicio. Posición también aleatoria.

### Ciudades fijas

| Ciudad | Posición | Intercambio | Condición especial |
|---|---|---|---|
| Teotihuacan | Norte | 1 Jade → 2 Maíz | Si Conocimiento ≥ 4: 1 Jade → 3 Maíz |
| Monte Albán | Sur | 2 Maíz → 1 Conocimiento | Si Copal ≥ 3: también 1 Maíz → 1 Copal (1×/ciclo) |

### Mazo de ciudades aleatorias (8 cartas)

| Ciudad | Intercambio | Condición | Dificultad |
|---|---|---|---|
| Cholula | 1 Copal → 2 FT | Se bloquea con evento de ciudad rival | Normal |
| Tula | 1 Jade → 1 Maíz + 1 Conocimiento | Sin condición especial | Normal |
| Mitla | 1 FT → 2 Conocimiento | Solo activa si FT ≥ 4 | Normal |
| Xochicalco | 2 Jade → 3 Maíz + 1 Copal | Condición: ningún evento militar ese ciclo | Normal |
| El Tajín | Variable | Chip aleatorio: ×0.5 / ×1 / ×1.5 / ×2 del intercambio base | Normal |
| Palenque | 1 Copal → 1 Jade | Solo activa si el Sacerdote realizó ritual ese ciclo | Normal |
| Tenochtitlan | 1 FT → 1 Jade + 1 Maíz | Inactiva los primeros 3 ciclos | Normal |
| Cantona | Sin intercambio | Genera evento de ciudad rival cada 3 ciclos. Posición siempre sur. Primer evento en ciclo 4. | Solo difícil |

### Configuración por dificultad
- **Fácil:** excluir Cantona y El Tajín del mazo
- **Normal:** mazo completo sin Cantona
- **Difícil:** mazo completo incluyendo Cantona

---

## Escenarios

### Escenario 1 — La primera cosecha *(Fácil)*

**Narrativa:** La ciudad es joven. Los campos son fértiles. El consejo aprende a gobernar.

**Recursos iniciales:** Maíz 6, Copal 5, Jade 4, FT 6, Conocimiento 4

**Configuración:**
- Ciclos: 8
- Barrios: 5 de 5 activos
- Ciudades aleatorias: 2, sin Cantona ni El Tajín
- Eventos graves: solo ciclos 5−8
- Mazo militar: 3 redadas, 1 sitio, 0 infiltración
- **Dado desactivado** — daño fijo siempre
- **Objetivos de nivel 2 desactivados** — solo pasivas de nivel 1
- **Ciudades aleatorias desactivadas** — solo las 2 fijas

**Condición de victoria:** Completar la Gran Milpa antes del final del ciclo 8.
- Requiere: Conocimiento ≥ 5, FT ≥ 4
- Acción: gastar 3 Maíz + 2 Jade en una sola fase con votación unánime del consejo

**Derrotas inmediatas:**
- Maíz en cero 2 ciclos consecutivos
- Copal en cero
- 3 o más barrios caídos simultáneamente

**Nota de diseño:** No hay victoria parcial. Sobrevivir sin completar la Gran Milpa es derrota.

---

### Escenario 2 — El año del hambre *(Normal)*

**Narrativa:** Las lluvias fallaron. Los graneros menguan. El consejo debe tomar decisiones imposibles.

**Recursos iniciales:** Maíz 3, Copal 4, Jade 3, FT 5, Conocimiento 3

**Configuración:**
- Ciclos: 9
- Barrios: 4 de 5 — barrio norte cerrado al inicio
- Ciudades aleatorias: 2, mazo completo sin Cantona
- Eventos graves: desde ciclo 3
- Mazo militar: 5 redadas, 2 sitios, 1 infiltración
- **Dado activo**
- **Objetivos nivel 2 activos**
- **Ciudades aleatorias activas**

**Condición de victoria:** Reabre el barrio norte Y termina con Maíz ≥ 5 al final del ciclo 9.

Abrir el barrio norte:
- Todos los jugadores gastan su turno completo ese ciclo
- Cuesta: Conocimiento −2 + Jade −1
- Solo puede intentarse una vez. Si falla los requisitos, el barrio queda permanentemente cerrado.
- Antes de intentarlo el grupo puede revisar una carta de "Evaluación de barrio" que muestra exactamente qué recursos se necesitan.

**Roles recomendados:** Comerciante (rutas comerciales para compensar Maíz bajo) + Curandera (proteger FT)

**Derrotas inmediatas:**
- Maíz en cero cualquier ciclo (sin margen de 2 ciclos)
- Copal en cero
- 2 o más barrios caídos simultáneamente
- Intento fallido de abrir barrio norte

---

### Escenario 3 — El fin del quinto sol *(Difícil)*

**Narrativa:** El calendario marca el cierre de un ciclo cósmico. El consejo tiene 10 ciclos para completar el Gran Templo antes de que el sol se apague para siempre.

**Recursos iniciales:** Maíz 4, Copal 3, Jade 2, FT 4, Conocimiento 2

**Configuración:**
- Ciclos: 10
- Barrios: 3 de 5 — barrios este y oeste cerrados
- Ciudades aleatorias: 2, incluye Cantona (siempre en posición sur, primer evento en ciclo 4)
- Eventos graves: desde ciclo 1
- Mazo militar: 7 redadas, 3 sitios, 2 infiltraciones
- **Sacerdote empieza con pasiva de nivel 1 desbloqueada**
- **Sacerdote requerido — su nivel 3 es condición de victoria**

**Condición de victoria — 3 fases obligatorias:**

*Fase 1 — Cimientos (ciclos 1−4)*
Gastar acumulado: 4 FT + 3 Maíz en acciones de construcción distribuidas entre cualquier jugador.

*Fase 2 — Cuerpo del templo (ciclos 5−7)*
Gastar: 3 Jade + 4 Conocimiento + votación unánime en dos ciclos consecutivos.

*Fase 3 — Consagración (ciclos 8−10)*
El Sacerdote debe tener nivel 3 desbloqueado y usar su habilidad especial para consagrar. Copal debe estar en 4 o más en ese momento.

**Roles requeridos:** Sacerdote (obligatorio), General (obligatorio para manejar Cantona)
**Roles recomendados:** Astrónomo (para navegar eventos desde ciclo 1)

**Derrotas inmediatas:**
- Maíz en cero cualquier ciclo
- Copal en cero
- Cualquier barrio activo cae
- Cantona no neutralizada antes del ciclo 6 (genera sitio automático que destruye un barrio)
- El Sacerdote pierde su nivel 3 en cualquier momento

**Derrota narrativa:** llegar al ciclo 10 sin completar la fase 3 — la ciudad sobrevive pero el sol se apaga. Derrota total aunque todos los recursos estén altos.

---

## Exploits conocidos y sus soluciones

| Exploit | Descripción | Solución implementada |
|---|---|---|
| Astrónomo omnisciente | Ver 2 cartas hace la apuesta predecible | Pasiva bloqueada al inicio, solo ve 1 carta, solo la categoría |
| Acumulación de FT | FT alta hace al General invencible | Techo de FT en 7, construir cuesta Maíz |
| Apostar siempre en primeros ciclos | Dado es estadísticamente favorable al inicio | Resultado 6 no da recursos, solo cancela daño |
| Sacerdote + Astrónomo cancelan todos los rituales | Dos roles eliminan una categoría entera | Activa del Sacerdote cancela el dado pero no el daño base |
| Xochicalco trivial con voto coordinado | Condición de unidad fácil de manipular | Condición cambiada a algo no controlable por el grupo |
| Curandera bloquea derrota indefinidamente | Rotación de barrios protegidos | Epidemia tiene marcador propio que avanza aunque haya protección |
| Jade acumulado sin Comerciante | En 4 jugadores el Jade no tiene salida | Cartas de evento que afectan Jade independientemente del rol |
| Mazo muy complejo para primera partida | 8 sistemas activos simultáneos | Escenario fácil desactiva dado, nivel 2 y ciudades aleatorias |
| Cuello de botella de progresión en escenario difícil | 8 subidas para demasiados niveles requeridos | Sacerdote empieza con nivel 1 desbloqueado en escenario difícil |
| Objetivo de Astrónomo nivel 2B inverificable | "Acertar 3 veces" es subjetivo | Reemplazar por objetivo concreto y medible |
| Victoria parcial desincentiva objetivo real | Sobrevivir sin Gran Milpa es igual de bueno | Eliminada la victoria parcial del escenario fácil |
| Cantona destruye partida en ciclo 2 | Recursos mínimos + dos amenazas simultáneas | Cantona siempre en posición sur, primer evento en ciclo 4 |
| Punto de no retorno oculto en escenario normal | El grupo no sabe que ya perdió | Carta de "Evaluación de barrio" antes del intento |
| Algunos escenarios injugables sin ciertos roles | Sin General el difícil es casi imposible | Cada escenario especifica roles requeridos y recomendados |

---

## Pendientes de diseño

### Alta prioridad (necesarios para prototipo)
- [ ] Definir el mazo de eventos completo: cuántas cartas exactas de cada tipo por escenario
- [ ] Balancear el daño base de cada evento contra los recursos iniciales de cada escenario
- [ ] Resolver el objetivo de nivel 2B del Astrónomo con una condición verificable
- [ ] Diseñar la carta de "Evaluación de barrio" del escenario normal
- [ ] Definir exactamente qué pasa con el marcador de epidemia — cómo avanza, qué lo activa

### Media prioridad (necesarios antes del primer playtest)
- [ ] Fichas físicas de cada rol con árbol de objetivos impreso
- [ ] Cartas de evento con formato final (evento + política en una sola carta)
- [ ] Cartas de ciudades aliadas
- [ ] Tablero físico con tracks de recursos y mapa de barrios
- [ ] Fichas de votación para el consejo (anverso/reverso por opción)
- [ ] Marcadores de barrio activo/caído
- [ ] Marcador de epidemia con track de avance propio
- [ ] Tokens de progresión de nivel para cada rol

### Baja prioridad (post-playtest)
- [ ] Arte e identidad visual
- [ ] Nombre definitivo del juego
- [ ] Reglas de variante para 2-3 jugadores
- [ ] Expansión con más escenarios
- [ ] Versión digital para prototipado rápido en Tabletopia

---

## Herramientas recomendadas para prototipo

| Herramienta | Uso | URL |
|---|---|---|
| Canva | Diseño de cartas y componentes | canva.com |
| Tabletopia | Prototipo digital jugable en navegador | tabletopia.com |
| nanDECK | Generación automática de mazos desde hoja de datos | nandeck.com |
| Notion / Google Docs | Reglamento y documentación colaborativa | — |

---

## Preguntas abiertas para próxima sesión de diseño

1. ¿Cómo avanza exactamente el marcador de epidemia? ¿Barrio por barrio o nivel global?
2. ¿El Comerciante tiene algún rol en partidas de 4 jugadores o se elimina completamente?
3. ¿Las cartas de evento tienen texto de sabor narrativo o solo mecánicas?
4. ¿La votación de progresión de nivel ocurre aunque nadie pueda subir ese ciclo?
5. ¿Qué pasa si el General y el Sacerdote son los roles requeridos en el escenario difícil pero solo hay 4 jugadores?

---

*Documento generado desde sesión de diseño colaborativo con Claude. Versión 1.0.*
