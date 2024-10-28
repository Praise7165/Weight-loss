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
                legend: {
                    display: false
                }, 

                hover: {
                    mode: 'nearest',
                    intersect: 'true',
                    interaction: {
                        mode: 'index'
                    },
                    onHover: (e, elements) => {
                        const hoverDisplay = document.getElementById('hover-value');

                        if (elements && elements.length) { 
                            let index = Number(elements[0]._index);


                            // const dataPoint = elements[0];
                            const dataset = weightChart.config.data.datasets[0];
                            
                            // Get all relevant information
                            const value = dataset.data[index];
                            const label = weightChart.config.data.labels[index];


                            // Update display element
                            hoverDisplay.textContent = `${label}: ${value}`;
                            hoverDisplay.style.display = 'block';
                    
                            // Position the display near the cursor
                            hoverDisplay.style.left = `${e.clientX + 10}px`;
                            hoverDisplay.style.top = `${e.clientY + 10}px`;
                    
                            // Optional: Change cursor
                            e.target.style.cursor = 'pointer';

                            weightLoss = Math.round(monthlyChange * index * 10) / 10;
                        
                        
                            // to convert the height and weight to metric value(m & kg)
                            userWeight = value * 6.35;
                        
                            BMI = Math.round(userWeight / userHeight ** 2);
                
                        
                            checkBMI(BMI);


                            // split weight loss whereever there is point.
                            weightLossImperial = String(weightLoss).split('.');
                        
                
                            let weightLossp = Math.round(weightChange * (index / monthsToTarget)); 

                            // set the text content of the element.
                            wLoss.textContent = `${weightLossImperial[0]}st ${weightLossImperial[1] || 0}lb`;
                            wLossPercent.textContent = weightLossp + '%';
                            BMIel.textContent = BMI;



                            wUpdate.textContent = `${weightLossImperial[0]}st ${weightLossImperial[1] || 0}lb`;
                            mUpdate.textContent = label;

  
                        }
                    }
                }
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


