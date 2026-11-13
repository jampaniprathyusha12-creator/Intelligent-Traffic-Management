/* =========================================================
   TRAFFICFLOW — MAIN APPLICATION

   Connects:
   1. Brute Force
   2. Divide and Conquer
   3. Dynamic Programming
   4. Greedy

   All four algorithms receive the same traffic scenario.
========================================================= */


/* =========================================================
   1. APPLICATION DATA
========================================================= */

const algorithmInformation = {

    bruteforce: {
        number: "01",
        title: "Brute Force",
        description:
            "Examines every possible combination of traffic signal plans and selects the feasible combination that serves the most vehicles.",
        badge: "Exhaustive Search",

        steps: [
            "Generate all possible green-time plans for each road.",
            "Explore every possible combination recursively.",
            "Calculate the total green time and vehicles served.",
            "Reject combinations that exceed the available budget.",
            "Compare valid combinations and keep the best result."
        ],

        explanation:
            "Brute Force explores all possible combinations. " +
            "Its running time grows rapidly as the number of roads increases."
    },

    divide: {
        number: "02",
        title: "Divide and Conquer",
        description:
            "Divides the roads into two groups, evaluates their possible plans separately, and combines the best compatible results.",
        badge: "Meet in the Middle",

        steps: [
            "Divide the roads into two smaller groups.",
            "Generate possible allocations for the first group.",
            "Generate possible allocations for the second group.",
            "Sort the second group's options by green time.",
            "Combine compatible group results without exceeding the budget.",
            "Select the combination serving the most vehicles."
        ],

        explanation:
            "This implementation uses a meet-in-the-middle strategy. " +
            "It reduces the size of the combinations that must be searched."
    },

    dp: {
        number: "03",
        title: "Dynamic Programming",
        description:
            "Uses a table of previously calculated results to find the best combination of traffic signal plans within the available time.",
        badge: "Multiple-Choice Knapsack",

        steps: [
            "Create a DP table for roads and available green-time budgets.",
            "Initialize the starting state with zero vehicles served.",
            "Process one road at a time.",
            "Try each available signal plan for the current road.",
            "Store the best vehicle count for each reachable time.",
            "Trace the stored choices to reconstruct the final allocation."
        ],

        explanation:
            "Dynamic Programming reuses previously calculated states instead " +
            "of solving the same smaller problems repeatedly."
    },

    greedy: {
        number: "04",
        title: "Greedy Algorithm",
        description:
            "Prioritizes signal plans according to their vehicle-serving efficiency and selects available plans one road at a time.",
        badge: "Local Optimization",

        steps: [
            "Calculate vehicles served per second for every plan.",
            "Sort all plans from highest to lowest efficiency.",
            "Select the most efficient available plan for each road.",
            "Skip plans that exceed the remaining green-time budget.",
            "Check whether every road received a signal plan.",
            "Return the resulting allocation."
        ],

        explanation:
            "Greedy makes locally beneficial choices. It is fast, but it " +
            "does not guarantee the globally optimal allocation."
    }

};


/* =========================================================
   2. APPLICATION STATE
========================================================= */

let currentRoads = [];

let currentBudget = 60;

let resultsByAlgorithm = {};

let selectedAlgorithm = "bruteforce";

let performanceChart = null;


/* =========================================================
   3. DOM ELEMENT REFERENCES
========================================================= */

const trafficForm = document.getElementById("trafficForm");

const greenBudgetInput = document.getElementById("greenBudget");

const approachCountInput = document.getElementById("approachCount");

const demandLevelInput = document.getElementById("demandLevel");

const signalError = document.getElementById("signalError");

const algorithmCards = document.querySelectorAll(".algorithm-card");


/* =========================================================
   4. TRAFFIC DATA GENERATOR
========================================================= */

/**
 * Generates a traffic scenario shared by all algorithms.
 *
 * @param {number} roadCount
 * @param {string} demandLevel
 * @returns {Array}
 */

function generateTrafficData(roadCount, demandLevel) {

    const roadInformation = [

        { name: "North Road", baseVehicles: 14 },

        { name: "South Road", baseVehicles: 18 },

        { name: "East Road", baseVehicles: 12 },

        { name: "West Road", baseVehicles: 16 }

    ];


    const demandMultipliers = {

        low: 0.7,

        medium: 1,

        high: 1.4

    };


    const serviceOptions = [

        { greenTime: 10, serviceMultiplier: 0.75 },

        { greenTime: 15, serviceMultiplier: 1.20 },

        { greenTime: 20, serviceMultiplier: 1.65 }

    ];


    const multiplier = demandMultipliers[demandLevel];


    return roadInformation.slice(0, roadCount).map(road => {

        const plans = serviceOptions.map(option => {

            const vehicles = Math.round(
                road.baseVehicles *
                multiplier *
                option.serviceMultiplier
            );


            return {

                greenTime: option.greenTime,

                vehicles: vehicles

            };

        });


        return {

            name: road.name,

            plans: plans

        };

    });

}


/* =========================================================
   5. INPUT VALIDATION
========================================================= */

/**
 * Checks user input before running algorithms.
 *
 * @returns {Object|null}
 */

function validateInputs() {

    const budget = Number(greenBudgetInput.value);

    const roadCount = Number(approachCountInput.value);

    const demandLevel = demandLevelInput.value;


    if (
        !Number.isInteger(budget) ||
        budget < 1 ||
        budget > 600
    ) {

        return {
            valid: false,
            message:
                "Please enter a whole-number green-time budget between 1 and 600 seconds."
        };

    }


    if (![2, 3, 4].includes(roadCount)) {

        return {
            valid: false,
            message: "Please select 2, 3, or 4 roads."
        };

    }


    if (!["low", "medium", "high"].includes(demandLevel)) {

        return {
            valid: false,
            message: "Please select a valid traffic demand level."
        };

    }


    return {

        valid: true,

        budget: budget,

        roadCount: roadCount,

        demandLevel: demandLevel

    };

}


/* =========================================================
   6. RUN ALL FOUR ALGORITHMS
========================================================= */

/**
 * Every algorithm receives the same roads and budget.
 */

function runAllAlgorithms() {

    const roads = currentRoads;

    const budget = currentBudget;


    try {

        resultsByAlgorithm = {

            bruteforce: runBruteForce(roads, budget),

            divide: runDivideConquer(roads, budget),

            dp: runDynamicProgramming(roads, budget),

            greedy: runGreedy(roads, budget)

        };


        // Update every part of the application.
        updateAlgorithmCards();

        renderAlgorithmDetails(selectedAlgorithm);

        renderPerformanceChart();

        renderPerformanceSummary();


    } catch (error) {

        console.error("Algorithm execution error:", error);

        showError(
            "An algorithm could not complete the calculation. " +
            "Please check the input and try again."
        );

    }

}


/* =========================================================
   7. ERROR DISPLAY
========================================================= */

function showError(message) {

    signalError.textContent = message;

    signalError.style.display = "block";

}


function clearError() {

    signalError.textContent = "";

    signalError.style.display = "none";

}


/* =========================================================
   8. ALGORITHM CARD SELECTION
========================================================= */

function updateAlgorithmCards() {

    algorithmCards.forEach(card => {

        const algorithm = card.dataset.algorithm;

        const result = resultsByAlgorithm[algorithm];


        card.classList.toggle(
            "active",
            algorithm === selectedAlgorithm
        );


        // Add a simple result indicator.
        let status = card.querySelector(".algorithm-status");


        if (!status) {

            status = document.createElement("span");

            status.className = "algorithm-status";

            card.appendChild(status);

        }


        if (result) {

            status.textContent = result.feasible
                ? `${result.totalVehicles} vehicles`
                : "No feasible allocation";

        }

    });

}


/* =========================================================
   9. RENDER ALGORITHM DETAILS
========================================================= */

function renderAlgorithmDetails(algorithm) {

    const information = algorithmInformation[algorithm];

    const result = resultsByAlgorithm[algorithm];


    if (!information) {
        return;
    }


    // Update the algorithm heading.

    document.getElementById("algorithmNumber").textContent =
        information.number;

    document.getElementById("algorithmTitle").textContent =
        information.title;

    document.getElementById("algorithmDescription").textContent =
        information.description;

    document.getElementById("algorithmBadge").textContent =
        information.badge;


    // Render the step-by-step explanation.

    const stepsContainer = document.getElementById("algorithmSteps");

    stepsContainer.replaceChildren();


    information.steps.forEach(step => {

        const item = document.createElement("li");

        item.textContent = step;

        stepsContainer.appendChild(item);

    });


    // Update complexity information.

    const complexityData = {

        bruteforce: {
            time: "O(kⁿ)",
            space: "O(n)"
        },

        divide: {
            time: "O(kᵐ log kᵐ)",
            space: "O(kᵐ)"
        },

        dp: {
            time: "O(n × B × k)",
            space: "O(n × B)"
        },

        greedy: {
            time: "O(n × k log(n × k))",
            space: "O(n × k)"
        }

    };


    document.getElementById("timeComplexity").textContent =
        complexityData[algorithm].time;

    document.getElementById("spaceComplexity").textContent =
        complexityData[algorithm].space;

    document.getElementById("complexityExplanation").textContent =
        information.explanation;


    // Show the actual result when available.

    if (!result) {

        document.getElementById("resultStatus").textContent =
            "Waiting for simulation";

        document.getElementById("resultMessage").textContent =
            "Generate a traffic scenario to see the algorithm's result.";

        document.getElementById("allocationResult").replaceChildren();

        document.getElementById("resultVehicles").textContent = "—";

        document.getElementById("resultGreenTime").textContent = "—";

        document.getElementById("resultRemaining").textContent = "—";

        document.getElementById("resultExecution").textContent = "—";

        return;

    }


    renderResult(result);

}


/* =========================================================
   10. RENDER ALLOCATION RESULT
========================================================= */

function renderResult(result) {

    const statusElement = document.getElementById("resultStatus");

    const messageElement = document.getElementById("resultMessage");

    const allocationContainer =
        document.getElementById("allocationResult");


    allocationContainer.replaceChildren();


    if (!result.feasible) {

        statusElement.textContent = "No feasible allocation";

        messageElement.textContent =
            "The available green-time budget is insufficient to assign a plan to every road.";


        document.getElementById("resultVehicles").textContent = "0";

        document.getElementById("resultGreenTime").textContent = "0 sec";

        document.getElementById("resultRemaining").textContent =
            `${currentBudget} sec`;

        document.getElementById("resultExecution").textContent =
            formatExecutionTime(result.executionTime);

        return;

    }


    statusElement.textContent = "Simulation completed";

    messageElement.textContent =
        `${result.algorithm} serves ${result.totalVehicles} vehicles ` +
        `using ${result.totalGreenTime} seconds of green time.`;


    // Display one allocation row per road.

    result.allocation.forEach(item => {

        const row = document.createElement("div");

        row.className = "allocation-item";


        const roadName = document.createElement("span");

        roadName.className = "allocation-road";

        roadName.textContent = item.road;


        const timing = document.createElement("span");

        timing.className = "allocation-time";

        timing.textContent = `${item.greenTime} sec`;


        const vehicles = document.createElement("span");

        vehicles.className = "allocation-vehicles";

        vehicles.textContent = `${item.vehicles} vehicles`;


        row.append(roadName, timing, vehicles);

        allocationContainer.appendChild(row);

    });


    document.getElementById("resultVehicles").textContent =
        result.totalVehicles;

    document.getElementById("resultGreenTime").textContent =
        `${result.totalGreenTime} sec`;

    document.getElementById("resultRemaining").textContent =
        `${result.remainingTime} sec`;

    document.getElementById("resultExecution").textContent =
        formatExecutionTime(result.executionTime);

}


/* =========================================================
   11. EXECUTION TIME FORMATTING
========================================================= */

function formatExecutionTime(time) {

    if (!Number.isFinite(time)) {
        return "Unavailable";
    }

    if (time < 0.01) {
        return "< 0.01 ms";
    }

    return `${time.toFixed(3)} ms`;

}


/* =========================================================
   12. PERFORMANCE CHART
========================================================= */

function renderPerformanceChart() {

    const canvas = document.getElementById("performanceChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const algorithms = [

        { key: "bruteforce", label: "Brute Force" },

        { key: "divide", label: "Divide & Conquer" },

        { key: "dp", label: "Dynamic Programming" },

        { key: "greedy", label: "Greedy" }

    ];


    const executionTimes = algorithms.map(item => {

        const result = resultsByAlgorithm[item.key];

        return result
            ? Math.max(result.executionTime, 0.001)
            : 0;

    });


    const vehiclesServed = algorithms.map(item => {

        const result = resultsByAlgorithm[item.key];

        return result && result.feasible
            ? result.totalVehicles
            : 0;

    });


    if (performanceChart) {

        performanceChart.destroy();

    }


    performanceChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: algorithms.map(item => item.label),

            datasets: [

                {

                    label: "Execution time (ms)",

                    data: executionTimes,

                    backgroundColor: [
                        "#c66c4b",
                        "#a0a17a",
                        "#56594b",
                        "#d9a477"
                    ],

                    borderRadius: 7,

                    yAxisID: "y"

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true
                },

                tooltip: {

                    callbacks: {

                        label: context =>
                            `${context.dataset.label}: ${context.parsed.y.toFixed(4)} ms`

                    }

                }

            },


            scales: {

                y: {

                    beginAtZero: true,

                    title: {

                        display: true,

                        text: "Execution time (milliseconds)"

                    }

                }

            }

        }

    });


    // Keep vehicle counts available for the summary.
    return vehiclesServed;

}


/* =========================================================
   13. PERFORMANCE SUMMARY
========================================================= */

function renderPerformanceSummary() {

    const summary = document.getElementById("performanceSummary");

    if (!summary) {
        return;
    }


    const results = Object.entries(resultsByAlgorithm)

        .filter(([, result]) => result.feasible);


    if (results.length === 0) {

        summary.textContent =
            "No algorithm found a feasible allocation. Increase the green-time budget.";

        return;

    }


    const bestResult = results.reduce((best, current) => {

        return current[1].totalVehicles > best[1].totalVehicles
            ? current
            : best;

    });


    const fastestResult = results.reduce((fastest, current) => {

        return current[1].executionTime < fastest[1].executionTime
            ? current
            : fastest;

    });


    summary.textContent =
        `Highest vehicle count: ${bestResult[1].algorithm} ` +
        `(${bestResult[1].totalVehicles} vehicles). ` +
        `Fastest measured execution: ${fastestResult[1].algorithm}. ` +
        `Execution times can vary between runs, especially for small inputs.`;

}


/* =========================================================
   14. FORM SUBMISSION
========================================================= */

trafficForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearError();


    const validation = validateInputs();


    if (!validation.valid) {

        showError(validation.message);

        return;

    }


    // Save the validated scenario.

    currentBudget = validation.budget;


    currentRoads = generateTrafficData(

        validation.roadCount,

        validation.demandLevel

    );


    // Run every algorithm using the same scenario.

    runAllAlgorithms();

});


/* =========================================================
   15. ALGORITHM CARD CLICK EVENTS
========================================================= */

algorithmCards.forEach(card => {

    card.addEventListener("click", function () {

        const algorithm = this.dataset.algorithm;


        if (!algorithmInformation[algorithm]) {
            return;
        }


        selectedAlgorithm = algorithm;


        updateAlgorithmCards();

        renderAlgorithmDetails(algorithm);

    });

});


/* =========================================================
   16. INITIAL APPLICATION DISPLAY
========================================================= */

function initializeApplication() {

    clearError();


    // Show the default algorithm before the first simulation.

    renderAlgorithmDetails(selectedAlgorithm);


    // Highlight the default algorithm card.

    updateAlgorithmCards();

}


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", initializeApplication);