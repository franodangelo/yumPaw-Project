export const fetchCTokenProvider = async (endpoint, data) => {
    const url = `https://proyecto-grupal.herokuapp.com/${endpoint}`;
    const token = localStorage.getItem('token') || '';

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-token': token
        },
        body: JSON.stringify(data)
    })
    return await resp.json();
}