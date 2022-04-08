/**
 * Wrapper to handle HTTP errors
 */
export function handleHttpError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response)
        if (error.response.status === 400) {
            throw Error(error.response.data);
        } else {
            throw Error('Unexpected error occured, check server logs for info.');
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request)
        throw Error('The request was made but no response was received.')
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Something happened in setting up the request that triggered an Error.')
        throw error.message;
    }
}