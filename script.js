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

const form = document.querySelector('.form');
const result = document.querySelector('.result');

const arrow = document.querySelector('.arrow');





button.addEventListener('click', calcWeigthLoss);




function calcWeigthLoss() {

    const stoneValue = Number(stone.value);
    const poundsValue = Number(pounds.value);
    const feetValue = Number(feet.value);
    const inchesValue = Number(inches.value);
    const weightChange = Number(pLoss.value);
    


    // to calculate the total pounds(weight) and inches(height) value
    const totalWeight = stoneValue + (poundsValue / 14);
    const totalHeight = feetValue + (inchesValue / 12);


    // to convert the height and weight to metric value(m & kg)
    const userWeight = totalWeight * 6.35;
    const userHeight = totalHeight / 3.281;




    const weightLoss = Math.round(10 * (weightChange / 100)  * totalWeight) / 10;

    // converted to kg
    const idealWeight = userWeight - (weightLoss * 6.35);

    const BMI = Math.round(idealWeight / userHeight ** 2);


    console.log(`${weightChange}%, ${weightLoss}stone, ${BMI}`);


    // set the text content of the element.
    wLoss.textContent = weightLoss + 'Stone';
    wLossPercent.textContent = weightChange + '%';
    BMIel.textContent = BMI;



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

