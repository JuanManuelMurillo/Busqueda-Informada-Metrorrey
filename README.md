# Busqueda-Informada-Metrorrey

Práctica curso 2026-27: Metro de Monterrey (Metrorrey). Inteligencia Artificial GII (+ ADE).

## Autores

**Grupo de trabajo nº:** 220 · **Grupo de clase:** 5S2M

| Nombre                             | Rol          |
|------------------------------------|--------------|
| _Cisneros Sánchez Adrián_          | Miembro      |
| _De Amorim Arciniegas Jesús David_ | Miembro      |
| _Macías Vicente León_              | Miembro      |
| _Murillo López Juan Manuel_        | Miembro      |
| _Sánchez Martín Daniel_            | Miembro      |
| _Zhu Zhang Zhende_                 | Coordinador  |

## Resumen de la práctica

El objetivo es desarrollar una **aplicación con interfaz gráfica** que calcule y muestre el **trayecto óptimo entre dos estaciones** del metro de Monterrey (Metrorrey) usando el **algoritmo de búsqueda A***.

El cálculo del camino óptimo puede tener en cuenta factores como el número y la longitud de los transbordos, la dificultad del recorrido (escaleras, pendientes, ascensores, accesibilidad), el clima, la hora o el día del trayecto, o el uso de otros medios de transporte.

### Red de metro considerada

| Línea | Color    | Recorrido                                          |
|-------|----------|----------------------------------------------------|
| 1     | Amarillo | Talleres → Exposición                              |
| 2     | Verde    | Sendero → General Ignacio Zaragoza                 |
| 3     | Rojo     | General Ignacio Zaragoza → Hospital Metropolitano  |

**Transbordos:**

- **Cuauhtémoc:** Línea 1 ↔ Línea 2
- **General Ignacio Zaragoza:** Línea 2 ↔ Línea 3
- **Félix U. Gómez:** Línea 1 ↔ Línea 3

El resto de líneas y estaciones de la red no se contemplan.

El enunciado completo está en [docs/Enunciado.pdf](docs/Enunciado.pdf).

## Estructura del proyecto

```
Busqueda-Informada-Metrorrey/
├── API/       # Backend en Python (Flask) → http://localhost:8080
└── client/    # Frontend en React          → http://localhost:3000
```

El cliente hace peticiones a la API, así que **ambos deben estar en ejecución a la vez**.

## Ejecución del Proyecto

### Requisitos

- Python 3.10 o superior
- Node.js 18 o superior (incluye `npm`)

### 1. Instalación (solo la primera vez)

Desde la raíz del repositorio:

```bash
# API
cd API
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Windows: copy .env.example .env
deactivate
cd ..

# Cliente
cd client
npm install
cp .env.example .env             # Windows: copy .env.example .env
cd ..
```

### 2. Ejecución

Abre **dos terminales** en la raíz del repositorio.

**Terminal 1 — API:**

```bash
cd API
source .venv/bin/activate        # Windows: .venv\Scripts\activate
python run.py
```

**Terminal 2 — Cliente:**

```bash
cd client
npm start
```

El navegador se abrirá en `http://localhost:3000`. Para detener cualquiera de los dos, pulsa `Ctrl+C` en su terminal.

### 3. Comprobar que funciona

- API: `curl http://localhost:8080/api/health` → `{"status":"ok"}`
- Cliente: abre `http://localhost:3000` en el navegador.

> Si cambias el puerto de la API (`PORT` en `API/.env`), actualiza también `REACT_APP_API_PORT` en `client/.env` y reinicia ambos.

---

## API (Flask)

### Estructura

```
API/
├── app/
│   ├── __init__.py        # create_app(): app factory, CORS y registro de blueprints
│   └── routes/
│       ├── __init__.py    # register_blueprints()
│       └── health.py      # GET /api/health
├── .env.example           # Plantilla de variables de entorno
├── config.py              # Carga .env y expone la configuración
├── requirements.txt       # Dependencias
└── run.py                 # Punto de entrada
```

### Requisitos

- Python 3.10 o superior

### Instalación

```bash
cd API
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Windows: copy .env.example .env
```

### Ejecución

```bash
cd API
source .venv/bin/activate        # Windows: .venv\Scripts\activate
python run.py
```

La API arranca en `http://localhost:8080`. La configuración se lee de `API/.env` (no se sube al repositorio); las variables de entorno del sistema tienen prioridad sobre las del archivo:

| Variable      | Por defecto | Descripción                     |
|---------------|-------------|---------------------------------|
| `HOST`        | `0.0.0.0`   | Interfaz de red donde escucha   |
| `PORT`        | `8080`      | Puerto de la API                |
| `FLASK_DEBUG` | `0`         | `1` activa el modo debug/reload |

Ejemplo sin tocar `.env`: `FLASK_DEBUG=1 PORT=8000 python run.py`

### Comprobar que funciona

```bash
curl http://localhost:8080/api/health
# {"status":"ok"}
```

## Cliente (React)

### Estructura (MVVM)

El cliente sigue una arquitectura **MVVM** (Model–View–ViewModel) sencilla:

```
client/src/
├── models/                     # Model: entidades y reglas de negocio (sin React)
│   └── HealthStatus.js
├── services/                   # Model: acceso a la API
│   ├── apiClient.js            # Cliente HTTP base (usa API_URL)
│   └── healthService.js        # GET /api/health → HealthStatus
├── viewmodels/                 # ViewModel: hooks con el estado y las acciones de cada vista
│   └── useHealthViewModel.js
├── views/                      # View: componentes de presentación
│   ├── HomeView.js
│   └── HomeView.css
├── config.js                   # API_URL a partir de client/.env
├── App.js                      # Composición de vistas
└── index.js                    # Punto de entrada
```

Flujo de dependencias: **View → ViewModel → Service → Model**. Cada capa solo conoce a la siguiente:

- **Model** (`models/`, `services/`): datos y comunicación con la API. No importa nada de React.
- **ViewModel** (`viewmodels/`): un hook `useXxxViewModel` por vista. Llama a los servicios, guarda el estado (datos, carga, errores) y expone datos ya preparados para pintar y acciones.
- **View** (`views/`): solo presentación. Obtiene todo del ViewModel y nunca llama a la API directamente.

Para añadir una funcionalidad (por ejemplo, el cálculo de rutas):

1. Crear el modelo en `models/` (p. ej. `Route.js`).
2. Crear el servicio en `services/` (p. ej. `routeService.js`) usando `get` de `apiClient.js`.
3. Crear el ViewModel en `viewmodels/` (p. ej. `useRouteViewModel.js`).
4. Crear la vista en `views/` (p. ej. `RouteView.js`) y añadirla en `App.js`.

### Instalación

```bash
cd client
npm install
cp .env.example .env             # Windows: copy .env.example .env
```

### Ejecución

```bash
cd client
npm start
```

El cliente arranca en `http://localhost:3000`. La configuración se lee de `client/.env` (no se sube al repositorio):

| Variable             | Por defecto | Descripción                                            |
|----------------------|-------------|--------------------------------------------------------|
| `HOST`               | `localhost` | Host del servidor de desarrollo                        |
| `PORT`               | `3000`      | Puerto del servidor de desarrollo                      |
| `REACT_APP_API_HOST` | `localhost` | Host de la API Flask                                   |
| `REACT_APP_API_PORT` | `8080`      | Puerto de la API Flask (debe coincidir con `API/.env`) |

La URL de la API se construye en `src/config.js` y solo la usa `services/apiClient.js`; el resto de servicios llaman a `get('/ruta')`.

### Tests

```bash
cd client
npm test
```

> Tras cambiar `client/.env` hay que reiniciar `npm start` para que se apliquen los cambios.
