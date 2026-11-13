/* =========================================================
   TRAFFICFLOW — GREEDY ALGORITHM

   Technique:
   Greedy selection based on vehicles served per second.

   Steps:
   1. Calculate the efficiency of every road plan.
   2. Sort plans from highest to lowest efficiency.
   3. Select the best available plan for each road.
   4. Skip plans that exceed the remaining time.
   5. Return the resulting allocation.

   Time Complexity:
   O(n * k * log(n * k))

   Space Complexity:
   O(n * k)

   n = number of roads
   k = number of plans per road
========================================================= */


/**
 * Runs the Greedy algorithm.
 *
 * @param {Array} roads - Traffic data and plans for each road.
 * @param {number} budget - Total available green time.
 * @returns {Object} Allocation and performance information.
 */
function runGreedy(roads, budget) {

    const startTime = performance.now();


    // STEP 1: Collect all available plans.

    const allPlans = [];

    for (const road of roads) {

        for (const plan of road.plans) {

            /*
               Efficiency measures how many vehicles
               a plan can serve per second.

               A zero-time plan serving vehicles is treated
               as infinitely efficient.
            */

            let efficiency;

            if (plan.greenTime === 0) {

                efficiency = plan.vehicles > 0
                    ? Infinity
                    : 0;

            } else {

                efficiency = plan.vehicles / plan.greenTime;
            }


            allPlans.push({

                road: road.name,

                greenTime: plan.greenTime,

                vehicles: plan.vehicles,

                efficiency: efficiency

            });
        }
    }


    // STEP 2: Sort plans by efficiency.

    allPlans.sort((a, b) => {

        if (b.efficiency !== a.efficiency) {
            return b.efficiency - a.efficiency;
        }

        // Prefer shorter plans when efficiencies are equal.
        if (a.greenTime !== b.greenTime) {
            return a.greenTime - b.greenTime;
        }

        // Use road name as a consistent final tie-breaker.
        return a.road.localeCompare(b.road);
    });


    // STEP 3: Select plans greedily.

    const selectedRoads = new Set();

    const allocation = [];

    let totalGreenTime = 0;
    let totalVehicles = 0;

    let plansExamined = 0;


    for (const plan of allPlans) {

        plansExamined++;

        // Only one plan can be selected for each road.
        if (selectedRoads.has(plan.road)) {
            continue;
        }

        // Check the remaining green-time budget.
        const remainingTime = budget - totalGreenTime;

        if (plan.greenTime > remainingTime) {
            continue;
        }


        // Accept this plan.
        allocation.push({

            road: plan.road,

            greenTime: plan.greenTime,

            vehicles: plan.vehicles

        });

        selectedRoads.add(plan.road);

        totalGreenTime += plan.greenTime;

        totalVehicles += plan.vehicles;
    }


    // STEP 4: Check whether every road received a plan.

    const feasible = allocation.length === roads.length;


    const endTime = performance.now();

    const executionTime = endTime - startTime;


    // STEP 5: Return the result.

    return {

        algorithm: "Greedy",

        feasible: feasible,

        allocation: allocation,

        totalVehicles: totalVehicles,

        totalGreenTime: totalGreenTime,

        remainingTime: budget - totalGreenTime,

        combinationsTested: plansExamined,

        executionTime: executionTime,

        timeComplexity: "O(n * k * log(n * k))",

        spaceComplexity: "O(n * k)",

        explanation:
            "Ranks road plans by vehicles served per second " +
            "and selects the most efficient available plan " +
            "for each road."
    };
}