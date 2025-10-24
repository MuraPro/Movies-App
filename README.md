# Movies-App

## Description  
A frontend pet project designed to explore movie data management and user interaction.  
The application is built with **React** and **Hooks**, featuring pagination of movie data, data transformation for visual display, and a user rating functionality which sends results to the server.

## Tech Stack  
- React (functional components, Hooks)  
- JavaScript (ES6+)  
- REST API integration (movies data source)  
- Paginated data loading (infinite scroll or page control)  
- Data transformation for UI visualization (e.g., mapping API responses to UI models)  
- User rating system with backend communication  
- CSS/SCSS for styling, responsive layout  
- Optionally: Redux / Context (if used)  

## Architecture & State Management  
- **Single-page architecture (SPA)** using React.  
- State management: built around React Hooks (useState, useEffect, custom Hooks) for handling UI state and data fetching.  
- Data fetching layer handles paginated API calls, transforms raw API response into UI-friendly format (e.g., extract fields, compute derived data).  
- Rating submissions: UI triggers POST/PUT request to server endpoint when user rates a movie.  
- UI layer renders list/grid of movie cards; each card clickable for rating.

## Features  
- Paginated loading of movie data (i.e., “load more” or infinite scroll)  
- Data transformation pipeline to prepare and display movie info (title, poster, rating, etc.)  
- Visual UI elements: movie cards, dynamic color/styling, responsive design  
- User rating feature: users can rate a movie; the rating is sent to server and UI updates accordingly  
- Real-time feedback in UI (score/rating update)  
- Optional logs or error handling for API failures  

## Setup & Installation  
```bash
git clone https://github.com/MuraPro/Movies-App.git
cd Movies-App
npm install
npm run dev


# Live demo: https://movies-app-cra.vercel.app/


