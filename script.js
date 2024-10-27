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
    const weightChange = Number(pLoss.value) || 0;
    


    // to calculate the total pounds(weight) and inches(height) value
    const totalWeight = stoneValue + (poundsValue / 14);
    const totalHeight = feetValue + (inchesValue / 12);


    // to convert the height and weight to metric value(m & kg)
    const userWeight = totalWeight * 6.35;
    const userHeight = totalHeight / 3.281;





    let weightLoss = Math.round(10 * (weightChange / 100)  * totalWeight) / 10;

    

    // converted to kg
    const idealWeight = userWeight - (weightLoss * 6.35);

    const BMI = Math.round(idealWeight / userHeight ** 2);




    // split weight loss whereever there is point.
    const weightLossImperial = String(weightLoss).split('.');


    // set the text content of the element.
    wLoss.textContent = `${weightLossImperial[0]}s ${weightLossImperial[1] || 0}lb`;
    wLossPercent.textContent = weightChange + '%';
    BMIel.textContent = BMI;


    // Determine BMI category
    let healthStatus, styleClass; 

    if (BMI <= 18.5) {
        healthStatus = "(Underweight)";
        styleClass = "underweight";
    } else if (BMI <= 25) {
        healthStatus = "(Healthy)";
        styleClass = "healthy";
    } else if (BMI <= 30) {
        healthStatus = "(Overweight)";
        styleClass = "overweight";
    } else {
        healthStatus = "(Obese)";
        styleClass = "obese";
    }


    // assign health status
    health.textContent = healthStatus;
    bmiEl.className = styleClass;
    



    // calculate weight loss trajectory
    const monthsToTarget = 11;
    let targetWeight = totalWeight - weightLoss;
    let monthlyChange = weightLoss / monthsToTarget;

    let lossProgression = [];

    for (let i = 0; i <= monthsToTarget; i++) {

        let monthlyweight = Math.round(10 * (totalWeight - (monthlyChange * i))) / 10;
        lossProgression.push(monthlyweight);
    };

    console.log(totalWeight);
    console.log(targetWeight);
    console.log(lossProgression);


    // get an array of the next 6 months.

    let nextMonths = getNextMonths(monthsToTarget);


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
                    borderColor: '#4CAF50',
                    borderJoinStyle: 'round',
                    cubicInterpolationMode: 'monotone',
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    spanGaps: true
                }]
            },
            options: {
                legend: {
                    display: false
                },

                animation: {
    
                    // Animation duration in milliseconds
                    duration: 10000, 
                    
                    onProgress: function(animation) {
                        // You can add custom animation logic here
                    },

                    onComplete: function() {
                        console.log('Animation completed');
                    }
                      
                },

                
            }
        });


        weightChart.options.animation = {
            x: {
              type: 'number',
              easing: 'linear',
              duration: 10000,
              from: NaN, // the point is initially skipped
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                  return 0;
                }
                ctx.xStarted = true;
                return ctx.index * 100;
              }
            }
        };
    }








    form.classList.toggle('hidden');
    result.classList.toggle('hidden');


}





arrow.addEventListener('click', () => {
    form.classList.toggle('hidden');
    result.classList.toggle('hidden');
})





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


