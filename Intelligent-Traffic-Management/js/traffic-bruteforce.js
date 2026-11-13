/* =========================================================
   TRAFFICFLOW — BRUTE FORCE ALGORITHM

   Purpose:
   Find the allocation that serves the maximum number
   of vehicles within the available green-time budget.

   Technique:
   Generate and examine every possible combination.

   Time Complexity:
   O(k^n)

   Space Complexity:
   O(n)

   n = number of roads
   k = number of time plans per road
========================================================= */


/**
 * Runs the Brute Force algorithm.
 *
 * @param {Array} roads - Traffic data and plans for each road.
 * @param {number} budget - Total available green time.
 * @returns {Object} Best allocation and performance information.
 */
function runBruteForce(roads, budget) {

    // Record when the algorithm starts.
    const startTime = performance.now();

    // Store the best solution found so far.
    let bestAllocation = [];
    let bestVehicles = -1;
    let bestGreenTime = 0;

    // Count how many combinations were examined.
    let combinationsTested = 0;

    // This array stores the currently selected plan for each road.
    const currentAllocation = [];


    /**
     * Recursively examine all possible plans.
     *
     * roadIndex tells us which road we are currently processing.
     * currentTime is the green time already allocated.
     * currentVehicles is the number of vehicles served so far.
     */
    function explore(roadIndex, currentTime, currentVehicles) {

        // Base case: all roads have been processed.
        if (roadIndex === roads.length) {

            combinationsTested++;

            // Check whether this combination is better.
            if (
                currentVehicles > bestVehicles ||
                (
                    currentVehicles === bestVehicles &&
                    currentTime < bestGreenTime
                )
            ) {

                bestVehicles = currentVehicles;
                bestGreenTime = currentTime;

                // Copy the allocation so later changes do not affect it.
                bestAllocation = currentAllocation.map(plan => ({
                    road: plan.road,
                    greenTime: plan.greenTime,
                    vehicles: plan.vehicles
                }));
            }

            return;
        }


        // Get the current road.
        const road = roads[roadIndex];

        // Try every available plan for this road.
        for (const plan of road.plans) {

            // Calculate the new total green time.
            const newTime = currentTime + plan.greenTime;

            // Ignore plans that exceed the budget.
            if (newTime > budget) {
                continue;
            }

            // Select this plan.
            currentAllocation[roadIndex] = {
                road: road.name,
                greenTime: plan.greenTime,
                vehicles: plan.vehicles
            };

            // Explore the next road.
            explore(
                roadIndex + 1,
                newTime,
                currentVehicles + plan.vehicles
            );
        }
    }


    // Start exploring from the first road.
    explore(0, 0, 0);


    // Record the finishing time.
    const endTime = performance.now();

    // Calculate execution duration.
    const executionTime = endTime - startTime;


    // Return the complete result.
    return {

        algorithm: "Brute Force",

        feasible: bestVehicles >= 0,

        allocation: bestAllocation,

        totalVehicles: Math.max(0, bestVehicles),

        totalGreenTime: bestGreenTime,

        remainingTime: budget - bestGreenTime,

        combinationsTested: combinationsTested,

        executionTime: executionTime,

        timeComplexity: "O(k^n)",

        spaceComplexity: "O(n)",

        explanation:
            "Examines every possible combination of road plans " +
            "and selects the best valid allocation."
    };
}