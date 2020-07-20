/* written in ES6 */

/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
const formatter = new Intl.DateTimeFormat('en-US',{weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
let newDate = formatter.format(d)

const apiKey = "5f9c08863894fa8044770058cdc6572d";
const countrycode = "us";
const tempUnit = "metric"; // metric or imperial


const getOpenWeatherData = async (zipcode) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${countrycode.toLowerCase()}&appid=${apiKey}&units=${tempUnit}`
    const request = await fetch(url);
    try {
        const data = await request.json();
        console.log(data)
        return data
    } catch (error) {
        console.log("error: ", error);
    }
}

const postData = async (url = '', data = {}) => {
    console.log(data)
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}

const updateUI = async (url) => {
    const request = await fetch(url);

    try {
        const serverReturnData = await request.json();
        console.log(serverReturnData)
        const todayEntry = document.getElementById("date");
        const tempEntry = document.getElementById("temp");
        const contentEntry = document.getElementById("content");
        todayEntry.textContent = serverReturnData.currentDate;
        tempEntry.textContent = serverReturnData.currentTemp;
        contentEntry.textContent = serverReturnData.userInput;

    } catch (error) {
        console.log("error: ", error);
    }

}

performAction = (e) => {
    e.preventDefault();
    const inputZip = document.getElementById("zip").value
    const inputFeeling = document.getElementById("feelings").value
    getOpenWeatherData(inputZip).then((data) => {
        const sendToServerData = {
            currentDate: newDate,
            currentTemp: data.main.temp,
            userInput: inputFeeling
        }
        postData('/save-data', sendToServerData)
    }).then(() => { updateUI('/get-data') })
    /* .then() need to pass a function instead of function call (such as updateUI()),
     otherwise this function will fire first */


}

/* get button */
button = document.getElementById("generate");

button.addEventListener("click", performAction)
