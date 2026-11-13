/* =========================================================
   TRAFFICFLOW — DYNAMIC PROGRAMMING ALGORITHM

   Technique:
   Multiple-Choice Knapsack

   Steps:
   1. Create a DP table.
   2. Process roads one by one.
   3. Try every available plan for each road.
   4. Store the maximum vehicles served for each exact time.
   5. Reconstruct the best allocation.

   Time Complexity:
   O(n * B * k)

   Space Complexity:
   O(n * B)

   n = number of roads
   B = available green-time budget
   k = number of plans per road
========================================================= */


/**
 * Runs the Dynamic Programming algorithm.
 *
 * @param {Array} roads - Traffic data and plans for each road.
 * @param {number} budget - Total available green time.
 * @returns {Object} Best allocation and performance details.
 */
function runDynamicProgramming(roads, budget) {

    const startTime = performance.now();

    const numberOfRoads = roads.length;


    // DP requires an integer time budget.
    if (
        !Number.isInteger(budget) ||
        budget < 0 ||
        roads.some(road =>
            road.plans.some(plan =>
                !Number.isInteger(plan.greenTime) ||
                plan.greenTime < 0
            )
        )
    ) {
        throw new Error(
            "Dynamic Programming requires a non-negative integer time budget and integer green-time plans."
        );
    }


    /*
       dp[i][t] represents the maximum number of vehicles
       served by the first i roads using exactly t seconds.

       -Infinity means that the state is not possible.
    */

    const dp = Array.from(
        { length: numberOfRoads + 1 },
        () => Array(budget + 1).fill(-Infinity)
    );


    /*
       choice[i][t] stores which plan was selected
       for road i - 1 to reach that state.
    */

    const choice = Array.from(
        { length: numberOfRoads + 1 },
        () => Array(budget + 1).fill(-1)
    );


    // Base case: zero roads require zero time and serve zero vehicles.
    dp[0][0] = 0;


    // STEP 1: Process roads one by one.

    for (let i = 1; i <= numberOfRoads; i++) {

        const road = roads[i - 1];

        // STEP 2: Try every available plan.
        for (let t = 0; t <= budget; t++) {

            // Ignore unreachable states.
            if (dp[i - 1][t] === -Infinity) {
                continue;
            }

            for (
                let planIndex = 0;
                planIndex < road.plans.length;
                planIndex++
            ) {

                const plan = road.plans[planIndex];

                const newTime = t + plan.greenTime;

                // Ignore plans that exceed the budget.
                if (newTime > budget) {
                    continue;
                }

                const newVehicles =
                    dp[i - 1][t] + plan.vehicles;


                // STEP 3: Update the DP table.
                if (newVehicles > dp[i][newTime]) {

                    dp[i][newTime] = newVehicles;

                    choice[i][newTime] = planIndex;
                }
            }
        }
    }


    // STEP 4: Find the best final state.

    let bestVehicles = -Infinity;
    let bestGreenTime = -1;

    for (let t = 0; t <= budget; t++) {

        const vehiclesServed = dp[numberOfRoads][t];

        if (
            vehiclesServed > bestVehicles ||
            (
                vehiclesServed === bestVehicles &&
                vehiclesServed !== -Infinity &&
                (
                    bestGreenTime === -1 ||
                    t < bestGreenTime
                )
            )
        ) {

            bestVehicles = vehiclesServed;
            bestGreenTime = t;
        }
    }


    // STEP 5: Reconstruct the selected allocation.

    let bestAllocation = [];

    if (bestVehicles !== -Infinity) {

        let remainingTime = bestGreenTime;

        // Work backwards through the DP table.
        for (let i = numberOfRoads; i >= 1; i--) {

            const road = roads[i - 1];

            const selectedPlanIndex = choice[i][remainingTime];

            // Find the plan selected for this road.
            const selectedPlan = road.plans[selectedPlanIndex];

            bestAllocation.push({

                road: road.name,

                greenTime: selectedPlan.greenTime,

                vehicles: selectedPlan.vehicles

            });

            // Remove its time to reach the previous state.
            remainingTime -= selectedPlan.greenTime;
        }

        // Restore the original road order.
        bestAllocation.reverse();
    }


    const endTime = performance.now();

    const executionTime = endTime - startTime;


    // Return the result in the standard format.
    return {

        algorithm: "Dynamic Programming",

        feasible: bestVehicles !== -Infinity,

        allocation: bestAllocation,

        totalVehicles:
            bestVehicles === -Infinity ? 0 : bestVehicles,

        totalGreenTime:
            bestGreenTime === -1 ? 0 : bestGreenTime,

        remainingTime:
            budget - (bestGreenTime === -1 ? 0 : bestGreenTime),

        combinationsTested: null,

        executionTime: executionTime,

        timeComplexity: "O(n * B * k)",

        spaceComplexity: "O(n * B)",

        explanation:
            "Stores the best result for each road count " +
            "and exact time, then reconstructs the best allocation."
    };
}