# Technical Interview Assistant

## Overview

A simple tool to help conduct technical interviews. It allows the interviewer to select a candidate's seniority level, which then loads a relevant set of questions. The interviewer can then record the candidate's performance on each question and add notes.

## Features

- **Candidate Name Input**: A dedicated section at the top to enter the candidate's name.
- **Evaluator Name Input**: A field to enter the interviewer's name.
- **Dynamic Questions**: Loads a relevant set of questions based on a predefined backend evaluation.
- **Evaluation Options**: For each question, the interviewer can choose from "No aplica", "Parcial", or "Aplica".
- **Interviewer Notes**: A textarea is available for each question to add specific observations.
- **Real-time Summary**: A summary panel displays the candidate's name, the calculated total score, and the final result ("Aceptado" or "Rechazado").
- **Export to XLSX**: A button to export the complete evaluation to an `.xlsx` file. The file includes the candidate's name, the date, the evaluator's name, the selected answers, the final score, and the result.

## UI/UX Design

- **Header**: The header now includes the GFT logo for a branded and professional look.
- **Layout**: A two-column layout with the evaluation form on the left and a summary panel on the right.
- **Styling**: Modern and clean design with a professional color palette. Interactive elements like radio buttons are styled for a better user experience.
- **Responsiveness**: The layout is designed to be responsive and work on different screen sizes.

## Architecture

- **Angular v20+**
- **Standalone Components**: The application is built entirely with standalone components.
- **Signals**: State management is handled using Angular Signals.
- **OnPush Change Detection**: All components use `ChangeDetectionStrategy.OnPush` for performance.
- **Built-in Control Flow**: Uses `@if` and `@for` for template logic.

### Component Tree

- `AppComponent`: The root component of the application. It manages the entire state and UI.
