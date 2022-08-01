export const fetchCToken = async (endpoint, data) => {
    const url = `https://proyecto-grupal.herokuapp.com/${endpoint}`;
    const token = localStorage.getItem('token') || '';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-token': token
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}