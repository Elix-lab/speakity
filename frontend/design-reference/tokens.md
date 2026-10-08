# Speakity — Design Tokens (extraídos del prototipo)

Esta es la fuente de verdad visual. Todos los valores de acá salen
directamente del CSS de `prototype.html` (mismo folder). No son
aproximaciones — son los hex/px/ms reales que el usuario aprobó.

**Regla para quien construya el frontend:** antes de estilizar cualquier
componente, buscá el selector equivalente en `prototype.html` y copiá el
valor exacto. Si hace falta un valor que no está acá, abrí el archivo y
buscalo — no lo inventes ni lo "interpretes" visualmente a ojo.

## Estética general

"Sticker journal": tarjetas blancas con borde negro de 2px y una sombra
sólida offset (no blur, no alpha) — como si cada elemento fuera un sticker
troquelado sobre papel. El mascot (Mia, la tortuga) tiene además un borde
blanco + negro vía `drop-shadow` apilados, para simular el contorno
troquelado del sticker.

## Colores

```
--outer:  #FFC93C   /* marco exterior del "teléfono" en el prototipo web — no aplica en la app real */
--ink:    #17191B   /* texto principal, bordes, sombras */
--muted:  #66705F   /* texto secundario */
--surface:#FFFFFF   /* fondo de tarjetas */
--bg:     #FFF7DF   /* fondo general de pantalla (papel cálido) */

/* Paleta de 5 roles con variantes -d (dark/ink), -t (tint/fondo suave), -x (texto sobre tint) */
--leaf:   #3FD12B   /* Verde — LA acción primaria (hero). leaf-t:#DFF6D0 */
--shell:  #F3E8C9   /* Beige neutro — tag genérico */
--sun:    #FFC400   /* Amarillo cálido — streak, logros, "nice!". sun-t:#FFF0C2 */
--coral:  #FF4458   /* Rojo — errores de gramática / "needs work". coral-t:#FFE0E4 */
--sea:    #1E9BEB   /* Celeste — "more natural" + info. sea-t:#DCEEFB */
--ok:     #10B374   /* Esmeralda — mastered / progreso. ok-t:#D3F3E5 */
--new:    #DED0A3   /* Piedra cálida — estado "new", sin asociar un hue. new-t:#F3E8C9 */

/* Todas las variantes -d/-x son #17191B (ink) — el texto sobre cualquier tint usa ink, no blanco */
```

## Tipografía

```
--display: "Baloo 2","Nunito",system-ui,-apple-system,"Segoe UI",sans-serif   /* headers, botones, números grandes */
--hand:    "Caveat","Nunito",cursive                                          /* bubbles de Mia, subtítulos "a mano" */
--body:    "Nunito",system-ui,-apple-system,"Segoe UI",sans-serif             /* texto de cuerpo */
```

Tamaños clave (font-size / weight / line-height):
- `h1`: 34px / 800 / 1.05, letter-spacing -.01em
- `h2`: 22px / 800 / 1.05
- `.sub` (subtítulo bajo h1): 16px / 600, color muted, line-height 1.4
- `.small`: 13px / 600, color muted
- Número grande de stat (`.stat b`, `.today-n`): 28px / 700 (display font)
- Número hero de práctica (`.pc-num`): 44px / 600, line-height 1
- Quote en flashcard (`.quote`): 30px / 700 / 1.12
- Bubble de Mia (`.bubble`): 19px, font-family hand, weight 700
- Botón (`.btn`): 17px / 700, letter-spacing -.005em; `.btn.big`: 19px

## Espaciado / layout

- Padding de pantalla (`.scroll`): `0 20px 20px` (20px laterales)
- Topbar: `20px 20px 8px`, min-height 68px
- Border-radius de tarjeta genérica (`.card`): 22px
- Border-radius de card "hero"/con pin (`.win-hero`, `.due-card`): 24px
- Border-radius de botón (`.btn`): 18px
- Border-radius de pill/chip: 99px (full)
- Border de todo: siempre `2px solid var(--ink)` (algunos elementos chicos usan 1.5px o 1px — ver CSS)

## Sombra "sticker" (pop-shadow)

Nada de `blur` — es un offset sólido del color ink, tipo comic/sticker:

```
--pop:    4px   /* sombra estándar: tarjetas, botones secundarios */
--pop-lg: 6px   /* sombra grande: botón primario (talk/sea), hoja de challenge */

.card        → box-shadow: 4px 4px 0 var(--ink)
.btn         → box-shadow: 4px 4px 0 var(--ink)
.btn.talk/.sea (primario) → box-shadow: 6px 6px 0 var(--ink)
.round (botón circular chico) → box-shadow: 2px 2px 0 var(--ink)
```

Al presionar (`:active`), el elemento se traslada exactamente ese mismo
offset y pierde la sombra (simula que se "hunde"):
```
transform: translate(var(--pop), var(--pop)); box-shadow: none;
transition: transform .08s, box-shadow .08s;
```

Varias tarjetas tienen una leve rotación "pegada a mano":
```
.due-card, .review-card, .stat, .win-hero → rotate(-.6deg)
.practice-card → rotate(.5deg)
```
Y un "pin" circular decorativo (círculo amarillo con borde) en la esquina
superior-izquierda de `.win-hero` y `.practice-card`.

## Mascota (Mia) — poses y animación

Filtro de contorno sticker en cualquier imagen con `alt` (doble
drop-shadow blanco + negro, 3px y 2px respectivamente) — así es como se
logra el borde blanco+negro troquelado alrededor de la tortuga.

Animaciones de pose (CSS @keyframes, duración orientativa ~0.6-1s salvo
indicado):
```
@keyframes idle  { 0%,100%: rotate(-2deg) translateY(0)      50%: rotate(2deg) translateY(-4px) }
@keyframes chat  { 0%,100%: translateY(0) scale(1,1)         30%: translateY(-12px) scale(.98,1.03)   60%: translateY(0) scale(1.04,.96) }
@keyframes lean  { 0%,100%: rotate(-3deg)                    50%: rotate(4deg) translateY(-3px) }
@keyframes sway  { 0%,100%: rotate(-5deg)                    50%: rotate(3deg) }
```
`chat` es el squash & stretch que se usa al cambiar de pose (hablando).

## Estado "pensando" (thinking) — pantalla Talk

Tres puntitos que laten en secuencia (reemplazan las barras de waveform
mientras se espera la respuesta de la IA):
```
.think-dots i { width:8px; height:8px; border-radius:50%; background:var(--ink); opacity:.3;
                animation: thinkDot 1.3s ease-in-out infinite; }
.think-dots i:nth-child(2) { animation-delay: .18s }
.think-dots i:nth-child(3) { animation-delay: .36s }
@keyframes thinkDot { 0%,80%,100%: opacity:.3 translateY(0)   40%: opacity:1 translateY(-5px) }
```

Barras de waveform (modo listening), por comparación:
```
.bar { width:5px; height:7px; border-radius:3px; background:var(--ink); opacity:.35 }
@keyframes bar { 0%,100%: height:7px   50%: height:var(--h, 34px) }
```

## Botón de mic ("end turn")

Círculo rojo coral, siempre visible, se desactiva visualmente (no se
oculta) cuando el modo es speaking/thinking/muted:
```
.mic-btn {
  width:64px; height:64px; border-radius:50%;
  border:2px solid var(--ink); background:var(--coral); color:#fff;
  box-shadow: 6px 6px 0 var(--ink);           /* --pop-lg */
  transition: transform .08s, box-shadow .08s, opacity .2s;
}
.mic-btn:active { transform:translate(4px,4px); box-shadow:none }

/* deshabilitado visualmente en speaking/thinking/muted: */
background:#D7CDA6; opacity:.5; cursor:not-allowed; box-shadow:none; pointer-events:none;
```
Versión chica (dentro del mini-dock de "Show text"): `.mic-btn-sm` = 40px x
40px, sin margin-top.

## Botones (`.btn`) — reglas generales

- Altura estándar 56px, `.big` 60px
- Border-radius 18px, border 2px ink
- El color de fondo se pasa vía variable `--c`:
  - `.talk` / `.sea` (primario, hero) → `--c: var(--leaf)` (verde), sombra `--pop-lg`
  - `.shell` → `--c: var(--sun)` (amarillo)
  - `.red` → `--c: var(--coral)`
  - `.ghost` → `--c: var(--surface)` (blanco)
- Disabled: fondo `#E7EEE9`, texto/borde `#8FA095`, sin sombra, sin transform

## Chips / pills / tags

- `.pill` (streak, etc.): radius 99px, padding `5px 12px`, border 2px, sombra `2px 2px 0 ink`
- `.chip`: radius 99px, padding `5px 12px`, font-size 13px, weight 700, border 1.5px
- `.tag` (pequeño, inline con texto): radius 99px, padding `3px 8px`, font-size 11px, border 1px

## Texto tachado de error / corrección (flashcards, insights)

El error original se muestra tachado con fondo tint coral (no `text-decoration`, es un `<s>` con background):
```
.said s { text-decoration:none; background:var(--coral-t); color:var(--coral-x);
          padding:1px 6px; border-radius:6px; font-style:normal }
```
La corrección ("better") se muestra en una píldora verde-ok:
```
.better { background:var(--ok-t); padding:6px 12px; border-radius:12px; border:1.5px solid var(--ink);
          font-family:display; font-size:21px; font-weight:600 }
```

## Confetti (celebración)

```
.conf { width:10px; height:16px; border:2px solid var(--ink); border-radius:3px;
        animation: fall 2.6s ease-in forwards }
@keyframes fall { to: translateY(900px) rotate(720deg); opacity:.9 }
```

## Notas de implementación para React Native

- Nada de esto usa blur ni alpha en las sombras — en RN, replicar con un
  segundo `View` offset (no `shadowRadius`/`elevation`, que dan blur). Un
  patrón común: un `View` de fondo `ink` desplazado `pop`/`pop-lg` px
  detrás de la tarjeta, ambos con el mismo `border-radius`.
- Las fuentes "Baloo 2" y "Caveat" no son del sistema — hay que
  importarlas con `expo-font` / `@expo-google-fonts/baloo-2` y
  `@expo-google-fonts/caveat`. Nunati tampoco es del sistema — Google Font
  también.
- El filtro `drop-shadow` doble (borde blanco+negro de la mascota) no
  existe en RN `Image`. Alternativa: exportar las imágenes de Mia ya con
  ese contorno "horneado" en el PNG/WebP (pedir al usuario los assets, o
  regenerarlos con el mismo proceso de recorte que se usó para las poses
  existentes), en vez de intentar replicar el filtro con CSS-in-JS.
- Las animaciones de keyframes se traducen a `Animated` / `Reanimated`
  (react-native-reanimated) con los mismos timings y curvas (ease-in-out,
  cubic-bezier cuando se especifica) — no estimar nuevos timings, usar los
  de acá.
