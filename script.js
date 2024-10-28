'use strict';


const stone = document.querySelector("#stone");
const pounds = document.querySelector("#pounds");
const feet = document.querySelector("#feet");
const inches = document.querySelector("#inches");
const pLoss = document.querySelector('#p-loss')
const button = document.querySelector('button');
const wLoss = document.querySelector('#weight-loss > h3');
const wLossPercent = document.querySelector('#weight-percent > h3');
const BMIel = document.querySelector('#BMI > h3');
const bmiEl = document.querySelector('#BMI');
const hUpdate = document.querySelector('.h-update');
const wUpdate = document.querySelector('.weight');
const mUpdate = document.querySelector('.month');

const form = document.querySelector('.form');
const result = document.querySelector('.result');
let health = document.querySelector('.health');

const arrow = document.querySelector('.arrow');

let weightChart = null;

button.addEventListener('click', calcWeigthLoss);


function calcWeigthLoss() {

    // get input values
    const stoneValue = Number(stone.value)  || 0;
    const poundsValue = Number(pounds.value) || 0;
    const feetValue = Number(feet.value) || 0;
    const inchesValue = Number(inches.value) || 0;
    let weightChange = Number(pLoss.value) || 0;
    
    // to calculate the total pounds(weight) and inches(height) value
    const totalWeight = stoneValue + (poundsValue / 14);
    const totalHeight = feetValue + (inchesValue / 12);


    // to convert the height and weight to metric value(m & kg)
    let userWeight = totalWeight * 6.35;
    const userHeight = totalHeight / 3.281;

    let weightLoss = Math.round(10 * (weightChange / 100)  * totalWeight) / 10;

    
    // converted to kg
    let idealWeight = userWeight - (weightLoss * 6.35);

    let BMI = Math.round(idealWeight / userHeight ** 2);

    checkBMI(BMI);

    // split weight loss whereever there is point.
    let weightLossImperial = String(weightLoss).split('.');


    // set the text content of the element.
    wLoss.textContent = `${weightLossImperial[0]}st ${weightLossImperial[1] || 0}lb`;
    wLossPercent.textContent = weightChange + '%';
    BMIel.textContent = BMI;



    
    
    // calculate weight loss trajectory
    const monthsToTarget = 11;
    let monthlyChange = weightLoss / monthsToTarget;
    let lossProgression = [];



    for (let i = 0; i <= monthsToTarget; i++) {

        let monthlyweight = Math.round(10 * (totalWeight - (monthlyChange * i))) / 10;
        lossProgression.push(monthlyweight);
    };


    // get an array of the next 6 months.

    let nextMonths = getNextMonths(monthsToTarget);

    wUpdate.textContent = `${weightLossImperial[0]}st ${weightLossImperial[1] || 0}lb`;
    mUpdate.textContent = nextMonths[nextMonths.length - 1];


    // Update or create chart
    createWeightChart(nextMonths, lossProgression);




    function createWeightChart(months, projectedWeights) {

        // Destroy existing chart if it exists
        if (weightChart) {
            weightChart.destroy();
        }

        const ctx = document.getElementById('graph').getContext('2d');
    

        weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    data: projectedWeights,
                    borderColor: 'green',
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    borderWidth: 2,
                    fill: true,
                    color: 'linear-gradient(225deg, rgb(236,245,237) 0%, rgb(217,246,220) 100%)',
                }]
            },





            options: {

                tooltips: { enabled: false },

                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },

                legend: {
                    display: false
                },

                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },

                hover: {
                    mode: 'nearest',
                    intersect: true,
                },

                onHover: (e, elements) => {
                    const hoverDisplay = document.getElementById('hover-value');

                    // reset cursor if no elements
                    if (!elements || !elements.length) {
                        e.target.style.cursor = 'default';
                        hoverDisplay.style.display = 'none';

                        return;
                    }

                    // Get data for the hovered point
                    const index = elements[0]._index;  // Update from _index which is deprecated
                    const dataset = weightChart.data.datasets[0];
                    const value = dataset.data[index];
                    const label = weightChart.data.labels[index];


                    // Update hover display
                    hoverDisplay.textContent = `${label}: ${value}`;
                    hoverDisplay.style.display = 'block';

                    // Position the display near cursor with overflow protection
                    const rect = e.target.getBoundingClientRect();
                    const displayRect = hoverDisplay.getBoundingClientRect();
        
                    let left = e.clientX + 10;
                    let top = e.clientY + 10;


                    // Prevent tooltip from going off-screen
                    if (left + displayRect.width > window.innerWidth) {
                        left = e.clientX - displayRect.width - 10;
                    }
                    if (top + displayRect.height > window.innerHeight) {
                        top = e.clientY - displayRect.height - 10;
                    }
        
                    hoverDisplay.style.left = `${left}px`;
                    hoverDisplay.style.top = `${top}px`;


                    // Update cursor
                    e.target.style.cursor = 'pointer';


                    // Calculate weight loss and BMI
                    // const monthlyChange = calculateMonthlyChange(); 
                    const weightLoss = Math.round(monthlyChange * index * 10) / 10;
                    const userWeight = value * 6.35; // Convert to kg
                    const BMI = Math.round(userWeight / (userHeight ** 2));


                    // Update BMI status
                    checkBMI(BMI);


                    // Format weight loss display
                    const weightLossImperial = String(weightLoss).split('.');
                    const weightLossp = Math.round(weightChange * (index / monthsToTarget));


                    // Update DOM elements
                    const updateText = function () {
                        wLoss.textContent = `${weightLossImperial[0]}st ${weightLossImperial[1] || 0}lb`;
                        wLossPercent.textContent = `${weightLossp}%`;
                        BMIel.textContent = BMI;
                        wUpdate.textContent = `${weightLossImperial[0]}st ${weightLossImperial[1] || 0}lb`;
                        mUpdate.textContent = label;
                    };

                    updateText();

                },


            }
        });

    }

    form.classList.toggle('hidden');
    result.classList.toggle('hidden');


}



arrow.addEventListener('click', () => {
    form.classList.toggle('hidden');
    result.classList.toggle('hidden');
});


// function to get the next 6 months.

function getNextMonths(numberOfMonths) {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i <= numberOfMonths; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() + i);
        
        // Format as "Oct 2024"
        const monthName = date.toLocaleString('en-US', { 
            month: 'short',
            year: 'numeric'
        });
        months.push(monthName);
    }
    return months;
}


function checkBMI(bmi) {

        // Determine BMI category
        let hStatus, style;

        if (bmi <= 18.5) {
            hStatus = "(Underweight)";
            style = "underweight";
        } else if (bmi <= 25) {
            hStatus = "(Healthy)";
            style = "healthy";
        } else if (bmi <= 30) {
            hStatus = "(Overweight)";
            style = "overweight";
        } else {
            hStatus = "(Obese)";
            style = "obese";
        }

        // assign health status
        health.textContent = hStatus;
        bmiEl.className = style;
}


