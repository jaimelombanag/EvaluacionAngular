import { InterviewQuestion } from '../models/interview-question.model';

export const BACKEND_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    question: 'Describe la diferencia entre una API RESTful y una API SOAP.',
    expectedAnswer: 'REST es un estilo arquitectónico que utiliza los métodos estándar de HTTP (GET, POST, PUT, DELETE) y se basa en recursos, mientras que SOAP es un protocolo con un formato de mensaje XML estricto. REST es generalmente más ligero y flexible.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 2,
    question: '¿Qué son los microservicios y qué ventajas ofrecen sobre una arquitectura monolítica?',
    expectedAnswer: 'Los microservicios son un enfoque arquitectónico en el que una aplicación se estructura como una colección de servicios pequeños, autónomos y débilmente acoplados. Sus ventajas incluyen escalabilidad independiente, resiliencia (un fallo no detiene todo el sistema), y flexibilidad tecnológica.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 3,
    question: 'Explica el propósito de un ORM (Object-Relational Mapping).',
    expectedAnswer: 'Un ORM es una técnica que crea un \"puente\" entre un modelo de objetos de un lenguaje de programación y una base de datos relacional. Permite a los desarrolladores manipular los datos de la base de datos utilizando objetos del lenguaje, en lugar de escribir consultas SQL directamente.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 4,
    question: '¿Qué es la inyección de dependencias (DI) y por qué es útil?',
    expectedAnswer: 'La inyección de dependencias es un patrón de diseño en el que un objeto recibe sus dependencias de una fuente externa en lugar de crearlas internamente. Esto promueve el desacoplamiento, facilita las pruebas unitarias y mejora la mantenibilidad del código.',
    evaluation: null,
    score: 0,
    notes: ''
  },
  {
    id: 5,
    question: '¿Cuál es la diferencia entre la autenticación y la autorización?',
    expectedAnswer: 'La autenticación es el proceso de verificar la identidad de un usuario (quién eres), mientras que la autorización es el proceso de verificar qué recursos puede acceder un usuario autenticado (qué puedes hacer). Un ejemplo es iniciar sesión (autenticación) y luego acceder a un panel de administración (autorización).',
    evaluation: null,
    score: 0,
    notes: ''
  }
];
