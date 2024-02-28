async function fetchData() {
    const url = 'https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=wat';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '70ac4bf157mshd148458076d8deap16ad22jsn849a11e186a3',
            'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
fetchData();