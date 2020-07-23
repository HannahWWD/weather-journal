/* written in ES6 */

/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
// format date
const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
let newDate = formatter.format(d)

// necessary settings to fetch data from OpenWeather api
const apiKey = "5f9c08863894fa8044770058cdc6572d";
const countrycode = "US";
const tempUnit = "imperial"; // metric or imperial

// input elements
const inputZip = document.getElementById("zip");
const inputFeeling = document.getElementById("feelings");
// error message if user input something not valid
const zipInputErrorMsg = document.getElementById("error")

// fetch data from OpenWeather Api
const getOpenWeatherData = async (zipcode, countrycode, apiKey, tempUnit) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${countrycode.toLowerCase()}&appid=${apiKey}&units=${tempUnit}`
    const request = await fetch(url);
    try {
        // note: in some cases the fetch is failed, it is still considered as resloved, 
        //but returns the data object with error msg
        const data = await request.json();
        console.log(data)
        return data
    } catch (error) {
        console.log("error: ", error);

    }
}

// post data to local server
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

// update Ui
const updateUI = async (url) => {
    // get data from local server
    const request = await fetch(url);

    try {
        const serverReturnData = await request.json();
        console.log(serverReturnData)

        // elements that pending to update
        const todayEntry = document.getElementById("date");
        const tempEntry = document.getElementById("temp");
        const contentEntry = document.getElementById("content");

        // hide previous error message (if any)
        inputZip.classList.remove("input-error");
        zipInputErrorMsg.style.visibility = "hidden";

        // update elements
        todayEntry.innerHTML = serverReturnData.currentDate;
        tempEntry.innerHTML = serverReturnData.currentTemp;
        contentEntry.innerHTML = serverReturnData.userInput;

        // reset form
        inputZip.value = "";
        inputFeeling.value = "";

    } catch (error) {
        console.log("error: ", error);
    }

}

performAction = (e) => {
    e.preventDefault();
    // if user enter a (valid or not valid) number in zipcode
    if (!isNaN(inputZip.value) && inputZip.value != "") {
        getOpenWeatherData(inputZip.value, countrycode, apiKey, tempUnit).then((data) => {
            //if the fetch is susscessful (zipcode is recognized in selected country)
            if (data.cod == 200) {
                console.log(data)
                //the data that would be passed to the server
                const sendToServerData = {
                    currentDate: newDate,
                    currentTemp: `${data.main.temp.toFixed()} \xB0F`,
                    userInput: inputFeeling.value
                }
                postData('/save-data', sendToServerData)
            } else {
                // if the fetch is failed because some reasons, then abort the chain
                console.log('aborting!');
                inputZip.classList.add("input-error");
                zipInputErrorMsg.style.visibility = "visible";
                // abort chain
                throw new Error('abort promise chain');
                //below if add .catch(console.log), the chain won't break
            }
        }).then(() => { updateUI('/get-data') })
        /* .then() need to pass a function instead of function call (such as updateUI()),
    otherwise this function will fire first */
    } else {
        // if the zipcode is not valid, display error message
        inputZip.classList.add("input-error");
        zipInputErrorMsg.style.visibility = "visible";

    }


}

/* get button */
button = document.getElementById("generate");

button.addEventListener("click", performAction)
