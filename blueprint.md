
# Proyecto: Dashboard de Evaluación de Candidatos Backend

## Descripción General

Esta aplicación es un dashboard interactivo construido con Angular para ayudar en el proceso de pre-filtrado de candidatos para roles de desarrollador backend. Permite a los evaluadores calificar a los candidatos basándose en un conjunto predefinido de preguntas técnicas, calcular su puntuación total en tiempo real y exportar los resultados.

## Diseño y Estilo

- **Tema:** Moderno y oscuro para reducir la fatiga visual.
- **Layout:** Centrado y de una sola columna, optimizado para la legibilidad.
- **Componentes:**
  - **Tarjetas de Preguntas:** Cada pregunta se presenta en una "tarjeta" individual con un borde sutil, sombra y espaciado interno.
  - **Inputs:** Campos de entrada estilizados para una apariencia limpia y consistente.
  - **Tipografía:** Clara y jerarquizada para distinguir entre títulos, preguntas y criterios.
- **Paleta de Colores:**
  - **Fondo Principal:** Un gris muy oscuro (`#1a1a1a`).
  - **Fondo de Tarjetas:** Un gris ligeramente más claro (`#2a2a2a`).
  - **Texto Principal:** Blanco (`#f0f0f0`).
  - **Acentos y Títulos:** Un azul vibrante (`#007bff`) para elementos interactivos y encabezados.

## Plan de Implementación Actual

### Fase 1: Construcción del Dashboard de Evaluación (MVP)

El objetivo de esta fase es crear la interfaz principal y la lógica de negocio para la evaluación.

**Pasos:**

1.  **Crear la Estructura de Datos:** Definir una interfaz `Question` en `app.ts` y poblar una señal (`signal`) con las preguntas y criterios proporcionados.
2.  **Desarrollar la Interfaz de Usuario (`app.html`):**
    -   Añadir un encabezado principal y un campo de texto para el nombre del candidato.
    -   Utilizar la sintaxis `@for` para renderizar dinámicamente cada pregunta en una tarjeta separada.
    -   Dentro de cada tarjeta, usar otro `@for` para mostrar los criterios de evaluación.
    -   Incluir campos de entrada (`<input type="number">`) para que el evaluador ingrese los puntajes de cada criterio.
3.  **Implementar la Lógica Reactiva (`app.ts`):**
    -   Usar una señal (`signal`) para almacenar los puntajes ingresados.
    -   Crear una señal computada (`computed`) para calcular la puntuación total de la evaluación en tiempo real.
    -   Crear otra señal computada para los subtotales de cada pregunta.
4.  **Aplicar Estilos (`app.css`):**
    -   Implementar el tema oscuro, el estilo de las tarjetas, los campos de entrada y la tipografía para lograr una interfaz de usuario pulida y profesional.
5.  **Verificación:** Compilar el proyecto usando `ng build` para asegurar que no haya errores de sintaxis o de tipo.
