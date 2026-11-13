# TrafficFlow – Traffic Signal Time Optimization Using Four Algorithms

## Project Overview

TrafficFlow is a web-based algorithm visualization tool that demonstrates how different algorithms can be used to optimize traffic signal timings.

The application considers multiple roads with different traffic demands and a limited amount of green-light time. It compares four algorithms to determine how the available time can be allocated to serve the maximum number of vehicles.

## Problem Statement

Traffic congestion is a common problem in cities. Giving equal green-light time to every road may not always be efficient because different roads have different numbers of vehicles.

TrafficFlow explores how algorithms can help allocate limited green-light time more effectively based on traffic demand.

## Objectives

- Understand traffic signal time optimization.
- Implement four different algorithms for the same problem.
- Compare the results produced by each algorithm.
- Visualize and explain how each algorithm works.
- Display time and space complexity.

## Algorithms Implemented

### 1. Brute Force
Checks different possible combinations to find the best allocation of green-light time.

### 2. Divide and Conquer
Breaks the problem into smaller subproblems and combines their results.

### 3. Dynamic Programming
Uses previously calculated results to avoid solving the same subproblems repeatedly.

### 4. Greedy Algorithm
Makes locally optimal choices at each step to find a solution.

## Features

- User input for traffic information.
- Input validation.
- Four algorithm options.
- Easy switching between algorithms.
- Step-by-step algorithm explanations.
- Time complexity and space complexity display.
- Results based on user input.
- Dark Mode and Light Mode.

## Technologies Used

- HTML
- CSS
- JavaScript
- Visual Studio Code
- GitHub
- GitHub Pages

## Project Structure

```text
TrafficFlow/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── traffic-bruteforce.js
│   ├── traffic-divide-conquer.js
│   ├── traffic-dp.js
│   └── traffic-greedy.js
│
├── assets/
│   └── images/
│
└── README.md
```

## How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html`.
4. Run the application using the Live Server extension.
5. Enter the traffic details.
6. Select an algorithm.
7. View the results and algorithm explanation.

## Team Members

1. **Ch.Manvitha Reddy**
2. **J.Prathyusha**
3. **V.Surya**

## Project Outcome

TrafficFlow provides an interactive way to understand and compare four algorithmic approaches to traffic signal time optimization. It helps users learn how different algorithms solve the same problem and how their results and complexities can be compared.

---

**Project:** TrafficFlow – Traffic Signal Time Optimization Using Four Algorithms  
**Domain:** Data Structures and Algorithms  
**Developed by:** Manvitha, Prathyusha, and Surya
