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

