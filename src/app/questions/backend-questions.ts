import { InterviewQuestion } from '../models/interview-question.model';

export const BACKEND_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    question: 'Tienes una lista de 10.000 usuarios y debes filtrar los activos. ¿Cuándo usarías un for tradicional y cuándo un Stream? ¿Por qué?',
    expectedAnswer: 'Uso Stream cuando busco código declarativo, legible y sin efectos colaterales (filter/map/collect). Uso for tradicional cuando necesito máximo performance, cortar la iteración temprano, mutar estructuras o evitar overhead. La decisión depende del contexto, no de preferencia personal.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 2,
    question: '¿Cómo centralizas el manejo de excepciones en Spring Boot y por qué es importante?',
    expectedAnswer: 'Uso @RestControllerAdvice con @ExceptionHandler para manejar errores de forma global. Defino un modelo estándar de error (código, mensaje, traceId) y mapeo errores de negocio a 4xx e infraestructura a 5xx. Esto desacopla la lógica de negocio del manejo de errores y mejora mantenibilidad y observabilidad.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 3,
    question: 'Explica el problema N+1 en JPA y menciona al menos dos formas correctas de solucionarlo.',
    expectedAnswer: 'Ocurre cuando se ejecuta una query principal y luego N queries adicionales por relaciones lazy. Se soluciona con fetch join, @EntityGraph, batch fetching o proyecciones DTO. Evitar OSIV como solución “mágica” porque oculta el problema y genera impactos en producción.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 4,
    question: 'Un proceso de generación de PDF tarda 20 minutos. ¿Usarías AWS Lambda? ¿Cómo lo diseñarías?',
    expectedAnswer: 'No usaría Lambda estándar por el límite de tiempo. Diseñaría un flujo asíncrono con SQS + ECS Fargate o AWS Batch. El cliente dispara el job, se procesa en background, se guarda el PDF en S3 y se notifica el estado. Step Functions puede orquestar el flujo.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 5,
    question: '¿Qué haces si no estás de acuerdo con una decisión técnica tomada por el arquitecto o líder técnico?',
    expectedAnswer: 'Primero entiendo el contexto y restricciones. Presento el desacuerdo con argumentos técnicos, trade-offs y evidencia. Propongo alternativas. Si la decisión se mantiene, me alineo y ejecuto, documentando riesgos. Escalo solo si hay impacto crítico en seguridad, estabilidad o negocio.',
    evaluation: null,
    score: 0,
    notes: ''
  }
];
