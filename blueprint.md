# Technical Interview Assistant

## Overview

A simple tool to help conduct technical interviews. It allows the interviewer to select a candidate's seniority level, which then loads a relevant set of questions. The interviewer can then record the candidate's performance on each question and add notes.

## Features

- Select seniority level (Junior, Semi-senior, Senior).
- Dynamically loads questions based on seniority.
- Evaluate each question as "No aplica", "Parcial", or "Aplica".
- Add notes for each question.
- A total score is calculated based on the evaluations.

## Architecture

- **Angular v20+**
- **Standalone Components**: The application is built entirely with standalone components.
- **Signals**: State management is handled using Angular Signals.
- **OnPush Change Detection**: All components use `ChangeDetectionStrategy.OnPush` for performance.
- **Built-in Control Flow**: Uses `@if` and `@for` for template logic.

### Component Tree

- `AppComponent`: The root component of the application. It manages the entire state and UI.
