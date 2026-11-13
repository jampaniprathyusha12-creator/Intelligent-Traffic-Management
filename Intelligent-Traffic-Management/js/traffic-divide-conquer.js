/* =========================================================
   TRAFFICFLOW — DIVIDE AND CONQUER ALGORITHM

   Technique:
   Meet in the Middle

   Steps:
   1. Divide roads into two groups.
   2. Generate possible allocations for each group.
   3. Sort the second group's allocations.
   4. Find the best matching allocation.
   5. Combine both groups.

   Time Complexity:
   O(k^ceil(n/2) * log(k^ceil(n/2)))

   Space Complexity:
   O(k^ceil(n/2))

   n = number of roads
   k = number of plans per road
========================================================= */


/**
 * Generates every possible allocation for a group of roads.
 *
 * @param {Array} roads - A group of roads.
 * @returns {Array} All possible group allocations.
 */
function generateGroupOptions(roads) {

    const options = [];

    /**
     * Recursively generate combinations.
     */
    function generate(index, time, vehicles, allocation) {

        // All roads in this group have been processed.
        if (index === roads.length) {

            options.push({
                time: time,
                vehicles: vehicles,
                allocation: allocation
            });

            return;
        }

        const road = roads[index];

        // Try every plan for the current road.
        for (const plan of road.plans) {

            generate(
                index + 1,
                time + plan.greenTime,
                vehicles + plan.vehicles,
                [
                    ...allocation,
                    {
                        road: road.name,
                        greenTime: plan.greenTime,
                        vehicles: plan.vehicles
                    }
                ]
            );
        }
    }

    generate(0, 0, 0, []);

    return options;
}


/**
 * Runs the Divide and Conquer algorithm.
 *
 * @param {Array} roads - Traffic data and plans.
 * @param {number} budget - Available green time.
 * @returns {Object} Best allocation and performance details.
 */
function runDivideConquer(roads, budget) {

    const startTime = performance.now();


    // STEP 1: Divide the roads into two groups.

    const middle = Math.ceil(roads.length / 2);

    const firstGroup = roads.slice(0, middle);
    const secondGroup = roads.slice(middle);


    // STEP 2: Generate all possible group allocations.

    const firstOptions = generateGroupOptions(firstGroup);
    const secondOptions = generateGroupOptions(secondGroup);


    // Remove combinations that individually exceed the budget.

    const validFirst = firstOptions.filter(
        option => option.time <= budget
    );

    const validSecond = secondOptions.filter(
        option => option.time <= budget
    );


    // STEP 3: Sort second-group combinations by green time.

    validSecond.sort((a, b) => a.time - b.time);


    // STEP 4: Build a prefix-best array.

    /*
       For every position, store the option with the
       highest vehicle count found up to that position.

       This helps us quickly find the best option that
       fits the remaining time.
    */

    const prefixBest = [];

    let bestSoFar = null;

    for (let i = 0; i < validSecond.length; i++) {

        const current = validSecond[i];

        if (
            bestSoFar === null ||
            current.vehicles > bestSoFar.vehicles ||
            (
                current.vehicles === bestSoFar.vehicles &&
                current.time < bestSoFar.time
            )
        ) {
            bestSoFar = current;
        }

        prefixBest[i] = bestSoFar;
    }


    // STEP 5: Find the best combination of both groups.

    let bestVehicles = -1;
    let bestGreenTime = 0;
    let bestAllocation = [];

    let combinationsTested = 0;


    // Binary search helper.
    function findLastValidIndex(maxTime) {

        let left = 0;
        let right = validSecond.length - 1;

        let answer = -1;

        while (left <= right) {

            const middleIndex = Math.floor(
                (left + right) / 2
            );

            if (validSecond[middleIndex].time <= maxTime) {

                answer = middleIndex;
                left = middleIndex + 1;

            } else {

                right = middleIndex - 1;
            }
        }

        return answer;
    }


    // Examine every valid first-group option.
    for (const first of validFirst) {

        // Calculate how much time is still available.
        const remainingTime = budget - first.time;

        // Find the best second-group option within that time.
        const secondIndex = findLastValidIndex(remainingTime);

        if (secondIndex === -1) {
            continue;
        }

        const second = prefixBest[secondIndex];

        combinationsTested++;

        const totalVehicles =
            first.vehicles + second.vehicles;

        const totalTime =
            first.time + second.time;


        // Keep the best overall combination.
        if (
            totalVehicles > bestVehicles ||
            (
                totalVehicles === bestVehicles &&
                totalTime < bestGreenTime
            )
        ) {

            bestVehicles = totalVehicles;
            bestGreenTime = totalTime;

            bestAllocation = [
                ...first.allocation,
                ...second.allocation
            ];
        }
    }


    // Calculate execution duration.
    const endTime = performance.now();

    const executionTime = endTime - startTime;


    // Return results in a standard format.
    return {

        algorithm: "Divide and Conquer",

        feasible: bestVehicles >= 0,

        allocation: bestAllocation,

        totalVehicles: Math.max(0, bestVehicles),

        totalGreenTime: bestGreenTime,

        remainingTime: budget - bestGreenTime,

        combinationsTested: combinationsTested,

        executionTime: executionTime,

        timeComplexity:
            "O(k^ceil(n/2) log(k^ceil(n/2)))",

        spaceComplexity:
            "O(k^ceil(n/2))",

        explanation:
            "Divides the roads into two groups, generates " +
            "their possible allocations, and combines the " +
            "best compatible results."
    };
}