# Speakity

App móvil para practicar inglés hablando con una IA. Pensada para gente que
ya tiene algo de nivel (intermedio en adelante), no principiantes totales.

## La idea en una frase

Hablás con una IA en inglés → la IA detecta tus errores reales → esos
errores se convierten en flashcards de oraciones (no palabras sueltas) →
las repasás con repetición espaciada → volvés a hablar y mostrás que ya no
cometés ese error.

```
TALK → LA IA ANALIZA → FLASHCARDS → REPETICIÓN ESPACIADA → TALK AGAIN
```

## Por qué existe

La mayoría de las apps de inglés (Duolingo, etc.) enseñan vocabulario
aislado o gramática en abstracto. Acá el loop es al revés: primero hablás
de verdad, y el contenido de estudio sale de tus propios errores reales en
conversación, no de un temario genérico. Las flashcards son oraciones
completas y corregidas, no palabras sueltas.

## Cómo funciona por dentro (resumen, ver CLAUDE.md para el detalle técnico)

1. **Hablás con Monty** (la tortuga, nuestra IA). No es voz-a-voz en tiempo
   real estilo ChatGPT — es por turnos: grabás, se transcribe, te contesta
   en texto, se lee en voz alta. Se siente como una nota de voz yendo y
   viniendo, no como una llamada telefónica. Esto es una decisión de costo:
   la voz en tiempo real de OpenAI sale ~5-10x más cara.

2. **Al terminar, se analiza toda la conversación de una.** No en vivo
   mientras hablás — una vez que termina la charla, se manda la
   transcripción completa a analizar. De ahí salen las correcciones.

3. **Se generan flashcards** — oraciones con tu error y la versión
   correcta. No hay tope artificial de cuántas se generan por conversación:
   si cometiste 2 errores, son 2 cartas; si cometiste 8, son 8. Lo que se
   limita es cuántas te aparecen para estudiar por día (ver abajo), no
   cuántas se capturan.

4. **Repasás con repetición espaciada**, estilo Anki: calificás cada carta
   como Again/Hard/Good/Easy, y eso (y solo eso) decide si pasa de New a
   Learning a Mastered. La IA que generó la carta nunca vuelve a tocar su
   estado — si usaste la frase bien en una conversación después, eso se
   marca como un "logro" informativo, pero la carta solo avanza de verdad
   cuando la repasás y la calificás bien.

## Por qué hay dos topes de cartas, no uno

Para que el repaso diario nunca se sienta como una montaña imposible, sin
perder ninguna corrección real:

- Cada día entran **5 cartas nuevas** al sistema de repaso (de todas las
  que se generaron — el resto espera su turno).
- El usuario elige cuántas cartas en total quiere repasar por día (10, 15,
  20 o 25 — 15 por defecto). Nunca ve más que eso, sin importar cuánto haya
  crecido la cola de fondo.

Esto es exactamente el mismo mecanismo que usa Anki para evitar que a
alguien con meses de uso se le acumulen cientos de cartas vencidas de
golpe.

## Por qué el modelo de voz no es tiempo real

Hicimos el cálculo: la Realtime API de OpenAI (voz-a-voz en vivo) sale
aproximadamente **$3-16+ por usuario al mes** solo en costo de IA para una
conversación diaria de 5-10 minutos, porque cobra el audio en los dos
sentidos como tokens de audio (carísimos). Cambiando a transcribir tu voz
(barato) + un modelo de texto normal (barato) + voz nativa del celular para
la respuesta (gratis), el costo baja a **menos de $3-4/usuario/mes**. Con
eso, un precio de suscripción en el rango de **$9.99-$12.99/mes** deja un
margen razonable incluso después de la comisión de las tiendas de apps
(15-30%) e impuestos.

## Lo que la app NO es (a propósito)

No tiene XP, niveles, leaderboards, logros, features sociales, cursos
estructurados, ni analíticas complicadas. El objetivo del MVP es que el
loop hablar → corregir → repasar se sienta bien, no construir un juego
alrededor.

## Mascota

Monty, una tortuga. Representa consistencia y progreso de a poco — no
rapidez ni perfección. Aparece de forma selectiva en la app, no en cada
pantalla.

## Estado del proyecto

Recién arrancando. El prototipo visual (todas las pantallas, estilo e
interacciones) está construido como un demo interactivo HTML — pedirle el
link al dueño del proyecto para usarlo de referencia visual exacta mientras
se construye la app real en Expo/React Native + Node/Express.
