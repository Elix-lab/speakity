# Speakity — contexto del proyecto para Claude

Speakity es una app móvil de práctica de inglés: conversás por voz con una IA,
la IA detecta errores reales (gramática, preposiciones, vocabulario, phrasal
verbs, expresiones poco naturales, etc.), esos errores se convierten en
flashcards de oraciones completas, y las repasás con repetición espaciada.
El loop completo: **TALK → AI ANALYZES → FLASHCARDS → SPACED REPETITION → TALK AGAIN**.

Este archivo es el contexto persistente del proyecto. Leelo siempre antes de
tocar código acá. Las decisiones de abajo ya están tomadas — no las
re-propongas ni las cuestiones salvo que el usuario pida explícitamente
cambiarlas.

## Stack

- **Frontend**: Expo + React Native. Distribución: EAS Build → App Store / Play Store.
  No se "hostea" en ningún lado, no usa Vercel.
- **Backend**: Node.js + Express, patrón MVC clásico (no hay capa de "service
  layer" entre Controller y Model — el Controller tiene la lógica de negocio).
  Hosting: Railway/Render/Fly.io (Vercel NO sirve para esto, es serverless de
  corta duración, no para un server Express persistente).
- **Base de datos**: Supabase (Postgres) + Drizzle como ORM.
- **Auth**: BetterAuth, con su adapter de Drizzle.
- **Monorepo**: un solo repo, `frontend/` y `backend/` como carpetas. Elegido
  por ser un desarrollador solo — el monorepo separado en equipos no aplica acá.
- **Package manager**: pnpm (workspace en la raíz: `pnpm-workspace.yaml` +
  un solo `pnpm-lock.yaml`). Nunca usar npm/npx/yarn — usar `pnpm` / `pnpm dlx`.

## Estructura de carpetas

### Backend

```
backend/
  src/
    models/        # schemas de Drizzle (Card, Conversation, User, etc.)
    controllers/     # TODA la lógica de negocio: crear carta, analizar
                      # conversación, actualizar review. El Controller decide,
                      # no es un capa "delgada".
    routes/           # SOLO mapeo de endpoints (GET/POST/etc.) → controller.
                       # Nunca lógica acá.
    services/
      openai.ts          # funciones puras que le hablan a OpenAI:
                          # transcribir(audio), analizarConversacion(texto).
                          # Sin decisiones de negocio adentro — eso es del
                          # Controller.
    middleware/        # BetterAuth, rate limiting, manejo de errores
    db/                 # conexión Drizzle, migraciones
    config/
    types/
```

### Frontend

```
frontend/
  app/              # pantallas (Expo Router, file-based)
  components/
    ui/             # Button, Card, Pill, ProgressBar — primitivas
                     # compartidas por TODA la app. Nunca dupliques un
                     # componente genérico adentro de una carpeta de página.
    Home/
    Library/
    Practice/
    Talk/
  hooks/            # useAuth, useReviewSession, useConversation
  lib/              # funciones tipadas que llaman al backend / Supabase
  store/            # estado global (Zustand)
  theme/            # tokens de color/tipografía (ver prototipo HTML de referencia)
```

## Reglas de arquitectura del producto — NO romper estas

1. **La IA nunca cambia el estado (`status`) de una flashcard.** Solo el
   sistema de rating (Again/Hard/Good/Easy) puede mover una carta entre
   `new` → `learning` → `mastered`. La IA puede: (a) crear flashcards nuevas
   a partir de una conversación, (b) marcar que una carta pendiente se usó
   correctamente en una conversación posterior (esto es solo un flag
   informativo `.win`, nunca toca `.status`).

2. **Sistema de honor, no detección automática de uso correcto.** No se
   implementa IA para verificar si el usuario "realmente" usó una frase
   naturalmente vs. la leyó de la tarjeta. Es honor system, como Anki.

3. **Generación de flashcards: sin tope por conversación.** La IA captura
   todos los errores reales que detecte en una conversación, sin límite
   artificial. Lo que se limita es cuántas entran al repaso del usuario
   (ver punto 4), no cuántas se generan.

4. **Dos topes separados para evitar que el repaso se vuelva una montaña:**
   - **Cartas nuevas que se activan por día**: tope fijo de 5/día (no
     configurable). El resto queda en backlog y se va soltando de a poco
     en los días siguientes.
   - **Tope diario de repaso total** (nuevas + vencidas): elegible por el
     usuario entre opciones fijas (10/15/20/25), default 15. Nunca se le
     muestra al usuario más que este número en un día, sin importar cuánto
     haya crecido la cola real detrás de escena.

5. **Feedback inmediato por sesión, no diferido.** Cada conversación se
   analiza completa (end-to-end, no en vivo) apenas termina, y el feedback
   se muestra al toque. No se espera a que el usuario agote su meta diaria
   de minutos para darle flashcards.

6. **Sesiones cortas no se penalizan ni se bonifican artificialmente.** La
   cantidad de flashcards de una conversación depende de lo que
   efectivamente se dijo, no de la duración. Una charla de 20 segundos sin
   contenido analizable no debería gastar una llamada de análisis — mostrar
   un mensaje liviano en su lugar en vez de un recap completo.

7. **El objetivo diario de minutos es una meta, no un candado.** El usuario
   puede completar su meta en varias conversaciones cortas repartidas en el
   día; no es "la usás toda de una o la perdés".

## Pipeline de conversación (turnos, no voz en tiempo real)

Decisión de costo: NO se usa la Realtime API de OpenAI (voz-a-voz en vivo,
tipo modo de voz de ChatGPT) — sale demasiado caro para el modelo de
negocio (ver cálculos en el README). En su lugar:

1. Usuario graba su turno (botón de mic: tap para empezar, tap para
   cortar — siempre visible, se deshabilita visualmente mientras la IA
   habla o piensa).
2. El audio se transcribe en la nube (STT barato, tipo GPT-transcribe) —
   **nunca STT nativo del device para esto**, porque el motor nativo tiende
   a autocorregir lo que la persona dijo, y necesitamos el error tal cual
   fue dicho para poder corregirlo.
3. El texto transcrito se manda a un modelo de texto barato (no al de
   audio) que genera la respuesta de Monty.
4. La respuesta se lee en voz alta con el motor de TTS **nativo del
   celular** (expo-speech) — acá sí es gratis y no hay ningún problema de
   precisión, porque el texto ya salió correcto del modelo, solo se está
   leyendo en voz alta.
5. Hay un tercer estado visual entre escuchar y hablar: "pensando" (pose
   propia de la tortuga + indicador de puntitos), mientras se hace el viaje
   de ida y vuelta de transcribir + generar respuesta.

## Flujo al terminar una conversación

Talk → **"That's a wrap!"** (`app/recap.tsx`) → **"You spoke for N min"**
(`app/summary.tsx`). Cada paso reemplaza al anterior en la navegación, así
que salir de cualquiera vuelve al Home, nunca a la conversación.

- Las flashcards ya las crea el análisis (regla 3) y quedan en el backlog.
  **No hay botón de "agregar"**: el "Add N sentences to my practice" del
  prototipo NO se usa.
- El summary termina con dos botones: **Practice now** (abre el repaso
  normal de hoy, respetando los topes de la regla 4; las cartas nuevas
  entran solo si caben) y **Back home**.
- Una conversación sin contenido analizable muestra "Nothing caught my eye" (Monty con la pose shrug)
  en vez del recap (regla 6).

## Mascota

Monty, una tortuga (masculino: "he" en los textos en inglés). La app se
llama Speakity; la mascota se llama Monty — no confundir los dos nombres.
Representa consistencia, paciencia, progreso de a poco. Usar con
moderación, nunca infantilizarlo de más.

**Monty es siempre una imagen fija**: sin animaciones (idle, rebote, squash &
stretch) ni confetti, aunque el prototipo las tenga. Cambiar de pose
(talk/listen/think) es un cambio de imagen instantáneo.

## Prototipo de referencia

`frontend/design-reference/prototype.html` (estilo "sticker"/cartoon con
outline grueso, sombra offset). Colores, tamaños, tipografía y textos se
copian de ahí, salvo donde este archivo o una decisión del usuario diga
otra cosa (ej.: la mascota fija, el flujo post-conversación de arriba).

## Lo que el usuario explícitamente NO quiere en el MVP

XP, niveles, leaderboards, logros/achievements, features sociales, perfiles
complejos, cursos, roadmaps de aprendizaje, analytics de pronunciación,
analytics avanzado, filtros complicados, gestión de mazos complicada.

## Próximos pasos pendientes de definir con el usuario

- Elegir y confirmar proveedor/modelo exacto de STT y de texto a usar.
- Decidir la entidad legal (LLC en EEUU vs. empresa/monotributo en Uruguay)
  — pendiente de consulta con un contador, no decidir esto por código.
- Precio de suscripción: hipótesis de trabajo en el rango $9.99-$12.99/mes
  (ver README para el cálculo de costos que lo sostiene).
