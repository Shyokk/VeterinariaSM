# Veterinaria San Marcos – Frontend

SPA en **React 19 + Vite + React Router + Bootstrap** conectada al backend de microservicios Spring Boot
(`VeterinariaSM_Backend`: ms-usuarios :8081, ms-pacientes :8082, ms-citas :8083).

## Cómo ejecutarlo
1. Tener el backend corriendo (MySQL de XAMPP + los 3 microservicios).
2. En esta carpeta:
   ```
   npm install
   npm run dev
   ```
3. Abrir http://localhost:5173 (el backend ya permite ese origen por CORS).
4. Si los servicios están en otra dirección (AWS, otro puerto), copiar `.env.example` como `.env` y editar las URLs.
5. Pruebas unitarias: `npm test`.

Usuario inicial: `admin@sanmarcos.cl` / `Admin12345`. Desde **Administración → Usuarios** se crean la recepcionista y el veterinario.
Los dueños se registran solos en **Registrarse**.

## Estructura
```
src/
  config.js            URLs de los microservicios y datos de la clínica (mapa)
  api/http.js          Cliente HTTP: agrega el JWT, renueva el token al recibir 401, traduce errores JSON
  api/index.js         Funciones por microservicio (authApi, usuariosApi, mascotasApi, clinicaApi, citasApi...)
  context/AuthContext  Sesión: login, registro, logout, persistencia y restauración al recargar
  components/          RutaProtegida, SinPermiso (403), FichaClinica, MascotaForm, FormularioClinico, Navegacion...
  hooks/               useCargar (carga de datos con estados), useDuenos
  utils/               roles (permisos por ruta), rut, formato, agenda, almacenSesion
  pages/               Una carpeta por área: comun, admin, recepcion, usuario, veterinario
spec/                  Pruebas unitarias (Jasmine): roles, RUT, formatos, acciones de cita
```

## Sesión (gestión de sesiones en el frontend)
- Al iniciar sesión se guardan `accessToken`, `refreshToken` y los datos del usuario en `localStorage` (`utils/almacenSesion.js`). **Nunca** se guarda la contraseña.
- Al recargar la página (F5), `AuthContext` restaura la sesión y la valida con `GET /api/auth/me`; mientras tanto `RutaProtegida` muestra «Verificando sesión...» para no redirigir por error.
- El access token dura 30 minutos. Si el backend responde 401, `api/http.js` pide un token nuevo con el refresh token (una sola renovación aunque fallen varias peticiones a la vez) y repite la petición. Si el refresh token también expiró, se cierra la sesión y se vuelve al login.
- Si se cierra sesión en otra pestaña, esta también se entera (evento `storage`).
- Al cerrar sesión se borra todo lo guardado.

## Restricciones de acceso por rol
La tabla única está en `src/utils/roles.js` (`ACCESO`). La usan `RutaProtegida` (bloquea) y el menú (oculta), así no se desincronizan.

| Ruta | Administrador | Recepcionista | Veterinario | Dueño |
|---|:-:|:-:|:-:|:-:|
| Citas (`/agendar`), Perfil | ✔ | ✔ | ✔ | ✔ |
| Mis mascotas (`/mis-mascotas`) | | | | ✔ |
| Pacientes, Historial, Crear ficha | ✔ | ✔ | ✔ | |
| Diagnóstico, Vacuna, Receta, Examen | ✔ | | ✔ | |
| Reportes | ✔ | ✔ | | |
| Panel de gestión, Usuarios | ✔ | | | |

- Sin sesión → redirige a `/login` y vuelve a la página pedida después de ingresar.
- Con sesión pero sin permiso → pantalla **403 «Acceso restringido»**.
- Los botones de las citas también dependen del rol y del estado (`utils/agenda.js`).
- **Importante:** esto mejora la experiencia, pero la seguridad real la aplica el backend (JWT + roles en cada endpoint).

## Integración con el backend
| Pantalla | Microservicio / endpoints principales |
|---|---|
| Login / Registro / Perfil | ms-usuarios: `POST /api/auth/login`, `/registro`, `/refresh`, `GET /api/auth/me` |
| Administración de usuarios | ms-usuarios: `GET/POST /api/usuarios`, `PUT/DELETE /api/usuarios/{id}`, `PATCH .../activar` |
| Pacientes, Crear ficha, Mis mascotas | ms-pacientes: `/api/mascotas` (+ `GET /api/usuarios/duenos` de ms-usuarios para elegir al dueño) |
| Historial, Diagnóstico, Vacuna, Receta, Examen | ms-pacientes: `/api/mascotas/{id}/consultas|vacunas|recetas|examenes` |
| Aviso de vacunas por vencer | ms-pacientes: `GET /api/vacunas/por-vencer` |
| Citas | ms-citas: `/api/citas` (solicitar, confirmar, proponer-horario, aceptar-horario, cancelar, atender, no-asistio, disponibilidad) |
| Reportes | ms-pacientes `/api/reportes/resumen` + ms-citas `/api/citas/reporte` |
| Nosotros (mapa Leaflet) | OpenStreetMap + «Cómo llegar» con Google Maps desde la ubicación del usuario |

Flujo de datos: *Componente → función de `api/index.js` → `api/http.js` (agrega `Authorization: Bearer`) → microservicio → JSON → estado del componente*. Los errores del backend (JSON con `mensaje` y `detalles`) se muestran tal cual al usuario.

## Notas
- Los datos de contacto y las coordenadas del mapa están en `src/config.js`; ajustarlos a la dirección real de la clínica.
- `src/assets/js`, `src/assets/data`, `backup_html`, `perfil.html` y `register.html` son restos de la versión HTML anterior; ya no se usan y pueden eliminarse del repositorio cuando quieran.
