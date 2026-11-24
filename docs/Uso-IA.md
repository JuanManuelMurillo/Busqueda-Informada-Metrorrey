# Utilización de herramientas de inteligencia artificial

---

## Registros

### IA-01 - Reglas del `.gitignore`

| Campo              | Valor                                  |
|--------------------|----------------------------------------|
| Fecha              | 2026-11-10                             |
| Autor              | Juan Manuel Murillo López              |
| Herramienta        | Claude Code                            |
| Ficheros afectados | `.gitignore`                           |
| Decisión           | Aceptado                               |

#### Motivo

El repositorio se creó con la plantilla de `.gitignore` de Node de GitHub, que no cubría los ficheros generados por un proyecto con frontend en React y backend en Python. Se usó la IA para completar las reglas faltantes.

#### Prompts

1. 
   This .gitignore was created using the Node gitignore in Github, it's missing the configuration to ignore Python and React generated files. Add the rules to dismiss this files, including the Python .venv configuration.

#### Salida obtenida

La IA revisó el `.gitignore` existente para no duplicar reglas ya presentes (`node_modules/`, `dist`, `.env*`, `coverage`, `.cache`, `.vite/`) y añadió al final tres bloques:

- **React:** `build/`, `*.local`, `storybook-static/`, `playwright-report/`, `test-results/`.
- **Python:** bytecode (`__pycache__/`, `*.py[cod]`), empaquetado (`*.egg-info/`, `wheels/`, …), informes de tests y cobertura (`.pytest_cache/`, `htmlcov/`, `.coverage`), Jupyter (`.ipynb_checkpoints`), entornos virtuales (`.venv/`, `venv/`, `env/`, `ENV/`, `.python-version`) y cachés de linters (`.mypy_cache/`, `.ruff_cache/`, …).
- **SO / editores:** `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/*` (excepto `settings.json` y `extensions.json`), `*.swp`.

#### Qué se aceptó y qué se descartó

- **Aceptado:** todas las reglas propuestas, sin modificaciones.


#### Revisión y validación

- Se revisaron las reglas una a una comparándolas con las plantillas oficiales de GitHub para Node y Python.
- Se comprobó con `git status --ignored` que el entorno virtual (`API/.venv/`), las carpetas `__pycache__/` y los ficheros `.env` quedan ignorados, y que los `.env.example` sí se incluyen en el repositorio.

---

### IA-02 - Instrucciones de ejecución y formato del README

| Campo              | Valor                                  |
|--------------------|----------------------------------------|
| Fecha              | 2026-11-10                             |
| Autor              | Juan Manuel Murillo López              |
| Herramienta        | Claude Code                            |
| Ficheros afectados | `README.md`                            |
| Decisión           | Modificado                             |

#### Motivo

Se utilizó la IA para incorporar las instrucciones necesarias para ejecutar el proyecto en Windows, corroborar la consistencia de las instrucciones de ejecución existentes y mejorar la presentación y organización del contenido mediante ajustes de formato Markdown.

#### Prompts

Las instrucciones se generaron y actualizaron de forma incremental, a medida que cambiaba la configuración del proyecto:

1. 
   Add the instructions to run the whole project (client and API) on Windows.
2. 
   Review and verify the existing instructions to ensure they're correct and consistent with the project configuration.
3. 
   Improve the Markdown styling of the README to make it more organized and readable.


#### Salida obtenida

| Prompt | Cambio en el README |
|--------|---------------------|
| 1 | Sección **API (Flask)**: estructura de carpetas, requisitos, instalación (entorno virtual y `pip install`), ejecución (`python run.py`) y comprobación con `curl` del endpoint `/api/health` en Windows. Sección **Cliente (React)**: instalación, ejecución (`npm start`), tabla de variables de `client/.env` y ejemplo de uso de `API_URL` en Windows. |
| 2 | Revisión de secciones **Estructura del proyecto** y **Ejecución del proyecto** al inicio del README: requisitos (Python 3.10+, Node.js 18+), instalación conjunta, ejecución en dos terminales y comprobación. |
| 3 | Estilización de secciones de documentación en el README del proyecto. |

#### Qué se aceptó y qué se descartó

- **Aceptado:** las instrucciones de instalación y ejecución de la API y del cliente y las mejoras del formato Markdown.

#### Revisión y validación

- Se siguieron las instrucciones del README desde cero: creación del entorno virtual, instalación de dependencias, copia de los `.env` y arranque de la API y del cliente en dos terminales.

---

### IA-03 - Tokens de diseño del frontend

| Campo              | Valor                                  |
|--------------------|----------------------------------------|
| Fecha              | 2026-11-20                             |
| Autor              | Juan Manuel Murillo López              |
| Herramienta        | Claude Code                            |
| Ficheros afectados | `client/src/token.css`                 |
| Decisión           | Aceptado                               |

#### Motivo

Se usó la IA para definir los tokens de diseño (variables CSS) del frontend a partir de la identidad visual de Metrorrey, de modo que todos los componentes compartan la misma paleta de colores.

#### Prompts

1. 
   Using the colour palette of the image MapaMetroMonterrey.png, generate a set of tokens for a web application frontend using the material design 3 guidelines.

#### Salida obtenida

Fichero `client/src/token.css` con variables CSS en `:root`:

- **Colores base** del plano y del logotipo de Metrorrey: fondo del mapa (`#ECE7DD`), azul marino del aro del logotipo (`#013A73`), rojo de la "m" (`#E40A20`) y blanco.
- **Escalas de cada color** generadas a partir de los colores base.
- **Colores de las líneas** del plano: L1 `#F9B036`, L2 `#68B75D` y L3 `#E9511C`.
- **Tokens semánticos** que usan los componentes (`--color-bg`, `--color-surface`, `--color-text`, `--color-heading`, `--color-primary`, `--color-accent`, …), definidos a partir de las escalas.

#### Qué se aceptó y qué se descartó

- **Aceptado:** los tokens generados.

#### Revisión y validación

- Se utilizaron los tokens en el desarrollo de la aplicación.

---

### IA-04 - Coordenadas de las estaciones para el mapa del frontend

| Campo              | Valor                                  |
|--------------------|----------------------------------------|
| Fecha              | 2026-11-20                             |
| Autor              | Juan Manuel Murillo López              |
| Herramienta        | Claude Code                            |
| Ficheros afectados | `client/src/shared/data/stations.js`   |
| Decisión           | Aceptado                               |

#### Motivo

El mapa de la interfaz dibuja cada estación en una posición `(x, y)`. Se usó la IA para extraer posiciones aproximadas de las estaciones a partir de la imagen del plano del Metrorrey que acompaña al enunciado (`docs/MapaMetroMonterrey.png`), de forma que el mapa de la aplicación reproduzca la forma del plano oficial.

#### Prompts

1. 
   Using the image MapaMetroMonterrey.png, add to stations.js the aproximated coordinates (x, y) to each station.

#### Salida obtenida

Lista de las 38 estaciones actualizadas en `client/src/shared/data/stations.js`, cada una con sus coordenadas `x`/`y` en píxeles del plano.

Estas coordenadas solo se usan para dibujar el mapa de la interfaz. El algoritmo A* usa las coordenadas geográficas reales de `API/app/data/metro.json`.

#### Qué se aceptó y qué se descartó

- **Aceptado:** coordenadas de las estaciones.

#### Revisión y validación

- Se comparó el gráfico generado con el mapa de la imagen y se corroboró su correctitud.

---

### IA-05 - Tamaños de imagen para el favicon

| Campo              | Valor                                                                   |
|--------------------|-------------------------------------------------------------------------|
| Fecha              | 2026-11-20                                                              |
| Autor              | Juan Manuel Murillo López                                               |
| Herramienta        | Claude Code                                                             |
| Ficheros afectados | `client/public/favicon.ico`, `client/public/logo192.png`, `client/public/logo512.png` |
| Decisión           | Aceptado                                                                |

#### Motivo

Se usó la IA para sustituir el icono por defecto de Create React App por el logotipo de Metrorrey y generar los distintos tamaños de imagen que necesita la aplicación (pestaña del navegador e iconos de instalación).

#### Prompts

1. 
   Add the Metrorrey icon to the favicon of the app

#### Salida obtenida

- Al no existir el logotipo como archivo en el proyecto, la IA lo recortó de la esquina superior derecha del plano `docs/MapaMetroMonterrey.png` y aplicó una máscara circular para que el fondo alrededor del logotipo quedara transparente.
- A partir de esa imagen generó con ImageMagick:
  - `favicon.ico` con los tamaños 16, 32, 48 y 64 px (icono de la pestaña del navegador).
  - `logo192.png` (192 × 192 px) y `logo512.png` (512 × 512 px), usados por `index.html` y `manifest.json` como iconos de la aplicación.

#### Qué se aceptó y qué se descartó

- **Aceptado:** el recorte del logotipo y los tres ficheros de icono, sin modificaciones.

#### Revisión y validación

- Se comprobó la visualización correcta del icono en la pestaña del navegador

---

