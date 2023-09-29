export const getData = (url) => fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error('Something went wrong');
    })
    .then((data) => data)
    .catch((error) => {
        console.log(error)
    });
