export default function parseQueryParams(search) {
    const params = {};
    search.slice(search.indexOf('?') + 1).split('&').forEach(hash => {
        const [key, val] = hash.split('=');
        params[key] = decodeURIComponent(val);
    });
    return params;
}
