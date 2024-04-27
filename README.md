<h1 align="center">Tugas Besar 2 IF2211 Strategi Algoritma</h1>
<h1 align="center">Kelompok 25 - PathFinder</h3>
<h3 align="center">Pemanfaatan Algoritma BFS dan IDS Dalam Permainan WIKIRACE</p>

## Table of Contents

- [Overview](#overview)
- [Abstraction](#abstraction)
- [Built With](#built-with)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Links](#links)

## Overview
![Foto](/src/fe/public/img/foto.jpg)
Our Team members :
- 13522047 - Farel Winalda
- 13522077 - Enrique Yanuar
- 13522113 - William Glory Henderson

<p>Our Lecturer : Dr. Ir. Rinaldi Munir, M.T.</p>

Here is the purpose of making this project :
- To fulfill the requirements of the second big assignment for the course IF2211 Algorithm Strategy.
- To implement Breadth First Search and Iterative Deepening Search Algorithm in looking for the fastest route to wikipedia site
- To compare the most efficient and fastest Algorithm between BFS and IDS

## Abstraction

In this project, users are provided with a tool to find the shortest path connecting two Wikipedia pages by inputting their source and destination URLs. They have the option to choose between Breadth-First Search (BFS) and Iterative Deepening Search (IDS) algorithms. The frontend is developed using Next JS and styled with Tailwind CSS, while the backend uses the Gin framework implemented in Golang, which handles the server-side logic for both the BFS and IDS algorithms. The GoColly library is employed for web scraping, and PostgreSQL is used to store the scraped data. The interface, designed with NextUI, is divided into three main pages: Home, App, and About. The App page features a form with toggle buttons for selecting the search algorithm and choosing between a single path or multiple paths. It also allows users to input and swap the URLs of the Wikipedia articles, with dropdown suggestions provided. The search is initiated by a 'GO' button, and the results are dynamically displayed using the d3.js library after the backend processes the data.

## Built With
- Frontend
    - [NextJs](https://nextjs.org/)
    - [Typescript](https://www.typescriptlang.org/)
    - [NextUI](https://nextui.org/)
    - [Node](https://nodejs.org/en)
    - [Tailwind](https://tailwindcss.com/)
    - [D3.Js](https://d3js.org/)

- Backend
    - [GoLang](https://go.dev/)
    - [GIN](https://gin-gonic.com/)
    - [Go-Colly](https://go-colly.org/)
    - [PostgreSQL](https://www.postgresql.org/)
    - [SQLC](https://sqlc.dev/)

- [Docker](https://www.docker.com/)

## Prerequisites

To run this project, you will need to perform several installations, including:
- `docker` : docker is really important because this contains the database and all the package in one container

## Installation

If you want to run this program you will have a terminal on the root directory

1. Clone this repository :
```shell
git clone https://github.com/mybajwk/Tubes2_PathFinder
```

2. Open directory : 
```shell
cd Tubes2_PathFinder
```

3. Open Docker desktop in your PC

4. Build the docker image :
```shell
docker compose build
```

5. Run the docker container :
``` shell
docker compose up
```

Congratulations !! The web application (client side) will run in [localhost:7781](http://localhost:7781/)
While, the API (server side) run in [localhost:7780](http://localhost:7780/)

## Links
- Repository : https://github.com/mybajwk/Tubes2_PathFinder
- Issue tracker :
   - If you encounter any issues with the program, come across any disruptive bugs, or have any suggestions for improvement, please don't hesitate to tell the author
- Github main contributor :
   - Contributor 1 (Farel Winalda) - https://github.com/FarelW
   - Contributor 2 (Enrique Yanuar) - https://github.com/mybajwk
   - Contributor 3 (William Glory Henderson) - https://github.com/BocilBlunder
- This is our video presentation : https://youtu.be/ppclPQN7KVw
- Also, this is our db sql dump : https://drive.google.com/drive/folders/1LdG0G6ACDiKLjNpuCZNurzo-erRHypNv?usp=sharing