# Configuración del Load Balancer

## Resumen de Cambios

El proyecto ha sido configurado para conectarse al load balancer de AWS con nginx como proxy reverso.

## Infraestructura

- **Load Balancer DNS**: `http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/`
- **Proxy**: nginx mapeando puertos internos a rutas

## Mapeo de Servicios

| Servicio | Puerto Interno | Ruta nginx | URL Final |
|----------|----------------|------------|-----------|
| User Service | 5000 | `/users/` | `http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/users` |
| Theater Service | 8001 | `/theaters/` | `http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/theaters` |
| Movie Service | 8080 | `/movie/` | `http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/movie` |
| Booking Service | 3000 | `/booking/` | `http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/booking` |
| Analytics Service | 8085 | `/analytics/` | `http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/analytics` |

## Configuración de nginx

```nginx
events { }

http {
    server {
        listen 80;

        # === User Microservice ===
        location /users/ {
            proxy_pass http://users-microservice:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # === Theaters Microservice ===
        location /theaters/ {
            proxy_pass http://theaters-microservice:8001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # === Booking Microservice ===
        location /booking/ {
            proxy_pass http://booking-microservice:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # === Movie Microservice ===
        location /movie/ {
            proxy_pass http://movie-microservice:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # === Analytics Microservice ===
        location /analytics/ {
            proxy_pass http://analytics-microservice:8085;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

## Archivos Modificados

### 1. `src/config/env.ts`
- Actualizado para usar el load balancer como URL base
- Configurado cada servicio con su ruta correspondiente

### 2. `src/api/getMovies.tsx`
- Corregido el uso de `movieServiceClient` en lugar de `API_URL` indefinida

### 3. `env.example`
- Creado archivo de ejemplo con todas las variables de entorno
- Incluye configuración para desarrollo local

## Variables de Entorno

```bash
# Configuración de producción (load balancer)
VITE_API_BASE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com
VITE_USER_SERVICE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/users
VITE_THEATER_SERVICE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/theaters
VITE_MOVIE_SERVICE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/movie
VITE_BOOKING_SERVICE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/booking
VITE_PAYMENT_SERVICE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/booking/payments
VITE_NOTIFICATION_SERVICE_URL=http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/analytics/notifications
```

## Desarrollo Local

Para desarrollo local, descomenta las líneas correspondientes en `env.example`:

```bash
# Desarrollo local
VITE_USER_SERVICE_URL=http://localhost:5000
VITE_THEATER_SERVICE_URL=http://localhost:8001
VITE_MOVIE_SERVICE_URL=http://localhost:8080
VITE_BOOKING_SERVICE_URL=http://localhost:3000
VITE_PAYMENT_SERVICE_URL=http://localhost:3000/payments
VITE_NOTIFICATION_SERVICE_URL=http://localhost:8085/notifications
```

## Verificación

Para verificar que la configuración funciona:

1. Ejecuta `npm run dev` para desarrollo
2. Verifica que las peticiones se dirijan al load balancer
3. Revisa la consola del navegador para logs de peticiones
4. Comprueba que no hay errores de CORS o conectividad

## Notas Importantes

- El load balancer maneja el enrutamiento interno
- nginx actúa como proxy reverso mapeando rutas a puertos
- Los headers de proxy están configurados para mantener la información del cliente
- La autenticación se mantiene a través de tokens en localStorage
