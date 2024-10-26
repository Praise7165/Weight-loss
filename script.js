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
    weightLoss = String(weightLoss).split('.');


    // set the text content of the element.
    wLoss.textContent = `${weightLoss[0]}s ${weightLoss[1]}lb`;
    wLossPercent.textContent = weightChange + '%';
    BMIel.textContent = BMI;


    // Determine BMI category

    let healthStatus, styleClass; 
    
    
    

    if (BMI < 18.5) {
        healthStatus = "Underweight";
        styleClass = "underweight";
    } else if (BMI < 25) {
        healthStatus = "Healthy";
        styleClass = "healthy";
    } else if (BMI < 30) {
        healthStatus = "Overweight";
        styleClass = "overweight";
    } else {
        healthStatus = "Obese";
        styleClass = "obese";
    }

    // assign health status
    health.textContent = healthStatus;
    bmiEl.className = styleClass;


    form.classList.toggle('hidden');
    result.classList.toggle('hidden');


}


arrow.addEventListener('click', () => {
    form.classList.toggle('hidden');
    result.classList.toggle('hidden');
})









/*


// to calculate the total pounds(weight) and inches(height) value
const totalPounds = (stoneValue * 14) + poundsValue;
const totalInches = (feetValue / 12) * inchesValue;
*/
