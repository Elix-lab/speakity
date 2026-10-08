# Prompt inicial para Claude Code (scaffolding del frontend)

Pegar esto en Claude Code apenas lo abras con la carpeta `speakity` como
proyecto:

---

Leé primero `CLAUDE.md` completo y después
`frontend/design-reference/tokens.md`. No toques el backend todavía.

Quiero que inicialices la app de Expo (React Native, con Expo Router) en
la carpeta `frontend/`, siguiendo exactamente la estructura de carpetas
que ya está definida en `CLAUDE.md` (app/, components/ui/,
components/Home|Practice|Talk/, hooks/, lib/, store/, theme/).

Primer paso, antes de ninguna pantalla: armá `theme/` con los tokens de
diseño exactos de `tokens.md` (colores, tipografía, spacing, radios,
sombras) como constantes/objetos tipados reutilizables — nada de valores
hardcodeados sueltos en los componentes después. Instalá y configurá las
fuentes Baloo 2, Caveat y Nunito vía Google Fonts (expo-font /
@expo-google-fonts).

Después armá los componentes primitivos de `components/ui/` (Button,
Card, Pill, ProgressBar) replicando el estilo "sticker" del prototipo:
borde negro 2px + sombra offset sólida sin blur (ver sección "Sombra
sticker" y "Notas de implementación para React Native" en tokens.md para
cómo lograr la sombra sólida en RN).

No uses ningún dato real del backend todavía — mockeá lo que haga falta
en `lib/` o `store/` con datos de ejemplo, dejando los nombres de función
ya pensados para cuando se conecte al backend real más adelante.

Cuando termines cada parte, mostrame cómo correr la app (`expo start`)
para que yo la revise contra el prototipo antes de seguir con la próxima
pantalla.

---
