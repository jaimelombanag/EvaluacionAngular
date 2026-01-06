
// Definición de la estructura para una pregunta de entrevista
export interface InterviewQuestion {
  id: string; // <-- ¡EL CAMPO QUE FALTABA!
  text: string;
  idealAnswer: string;
}

// Array con las preguntas de backend para la evaluación
export const BACKEND_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'solid',
    text: '¿Puedes explicar los principios SOLID?',
    idealAnswer: 'El candidato debe ser capaz de nombrar y explicar cada uno de los cinco principios (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) y dar un ejemplo práctico de al menos uno de ellos.'
  },
  {
    id: 'cqrs',
    text: '¿Qué es CQRS y en qué escenario lo usarías?',
    idealAnswer: 'Explicar que CQRS significa Command Query Responsibility Segregation. Se usa para separar los modelos de escritura (Commands) de los de lectura (Queries). Ideal para sistemas complejos con altos requerimientos de rendimiento en lectura y/o escritura, donde un único modelo no es eficiente.'
  },
  {
    id: 'rest_graphql',
    text: 'Compara y contrasta REST con GraphQL.',
    idealAnswer: 'REST es un estilo arquitectónico basado en recursos y verbos HTTP, tiende a tener múltiples endpoints y puede sufrir de over/under-fetching. GraphQL es un lenguaje de consulta que usa un único endpoint, permite al cliente solicitar exactamente los datos que necesita, evitando el over/under-fetching. REST es más simple de cachear a nivel de HTTP.'
  },
  {
    id: 'microservices',
    text: '¿Cuáles son los mayores desafíos al trabajar con microservicios?',
    idealAnswer: 'Debe mencionar desafíos como la complejidad de la comunicación entre servicios (latencia, consistencia de datos), la dificultad del debugging y monitoreo distribuido, la gestión de transacciones distribuidas (sagas), y la sobrecarga operacional (deployments, versionado).'
  },
  {
    id: 'db_indexing',
    text: '¿Por qué son importantes los índices en una base de datos y cuál es su desventaja?',
    idealAnswer: 'Los índices aceleran drásticamente las operaciones de lectura (SELECT) al permitir al motor de la base de datos encontrar rápidamente los datos sin escanear toda la tabla. La principal desventaja es que ralentizan las operaciones de escritura (INSERT, UPDATE, DELETE) porque el índice también debe ser actualizado, y ocupan espacio adicional en disco.'
  }
];
