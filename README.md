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

Aplicación web que calcula y muestra el **trayecto óptimo entre dos estaciones** del metro de Monterrey (Metrorrey) usando el **algoritmo de búsqueda A***.

| Línea | Color    | Recorrido                                          |
|-------|----------|----------------------------------------------------|
| 1     | Amarillo | Talleres → Exposición                              |
| 2     | Verde    | Sendero → General Ignacio Zaragoza                 |
| 3     | Rojo     | General Ignacio Zaragoza → Hospital Metropolitano  |

Transbordos: **Cuauhtémoc** (L1 ↔ L2), **General Ignacio Zaragoza** (L2 ↔ L3) y **Félix U. Gómez** (L1 ↔ L3).

El enunciado completo está en [docs/Enunciado.pdf](docs/Enunciado.pdf) y las fuentes de los datos en [docs/Referencias-datos.txt](docs/Referencias-datos.txt).

## Estructura

```
API/                          Backend en Python (Flask) → http://localhost:8080
├── app/
│   ├── data/metro.json       Estaciones, líneas, transbordos y longitud de cada tramo
│   ├── models/metro.py       Grafo del metro (lista de adyacencia)
│   ├── search/
│   │   ├── a_star.py         Algoritmo A*
│   │   ├── cost.py           g(n): km recorridos por la vía
│   │   └── heuristic.py      h(n): km en línea recta hasta el destino
│   ├── services/             Lógica del cálculo de rutas
│   └── routes/               Endpoints de la API
└── run.py                    Punto de entrada

client/                       Frontend en React → http://localhost:3000
└── src/
    ├── views/                Pantalla principal
    ├── viewmodels/           Estado y acciones de la vista
    ├── services/             Llamadas a la API
    ├── models/               Modelo de la ruta
    └── shared/               Componentes (mapa, selectores, ruta) y datos de dibujo
```

## Requisitos

- **Python 3.10** o superior
- **Node.js 18** o superior (incluye `npm`)

## Instalación (solo la primera vez)

Desde la carpeta raíz del proyecto.

**macOS / Linux** (Terminal):

```bash
cd API
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cd ../client
npm install
cd ..
```

**Windows** (PowerShell o CMD; si `py` no existe, usa `python`):

```bat
cd API
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
cd ..\client
npm install
cd ..
```

## Ejecución

Hacen falta **dos terminales** abiertas en la carpeta raíz del proyecto: una para la API y otra para el cliente.

**macOS / Linux**

Terminal 1 (API):

```bash
cd API
.venv/bin/python run.py
```

Terminal 2 (cliente):

```bash
cd client
npm start
```

**Windows**

Terminal 1 (API):

```bat
cd API
.venv\Scripts\python run.py
```

Terminal 2 (cliente):

```bat
cd client
npm start
```

El navegador se abre en **http://localhost:3000**. Para detener cada parte, pulsa `Ctrl+C` en su terminal.

## Comprobar que funciona

- Abre http://localhost:3000, elige una estación de origen y otra de destino y pulsa **Calcular ruta**.
- La API también se puede probar directamente: http://localhost:8080/api/health debe responder `{"status":"ok"}`.

## API

| Método | Ruta          | Body                                               | Respuesta                                         |
|--------|---------------|----------------------------------------------------|---------------------------------------------------|
| GET    | `/api/health` | —                                                  | `{"status": "ok"}`                                |
| POST   | `/api/route`  | `{"origin": "talleres", "destination": "regina"}`  | `{"stations": ["talleres", …, "regina"], "distance_km": 13.91}` |

Los identificadores de estación son los de [API/app/data/metro.json](API/app/data/metro.json).

## Configuración (opcional)

Por defecto la API usa el puerto **8080** y el cliente el **3000**. Para cambiarlos, copia los archivos de ejemplo y edítalos:

- `API/.env.example` → `API/.env` (`PORT` de la API)
- `client/.env.example` → `client/.env` (`PORT` del cliente y `REACT_APP_API_PORT`, que debe coincidir con el de la API)

Después de cambiarlos, reinicia las dos partes.
