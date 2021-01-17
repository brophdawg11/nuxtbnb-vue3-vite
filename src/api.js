const appId = 'PKLXWAH1SN';
const searchOnlyApiKey = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY;
const baseUrl = `https://${appId}-dsn.algolia.net`;
const headers = {
    'X-Algolia-Application-Id': appId,
    'X-Algolia-API-Key': searchOnlyApiKey,
};

function get(obj, pathString) {
    if (obj == null || typeof pathString !== 'string') {
        return undefined;
    }

    let pointer = obj;
    const toks = pathString.split('.');
    for (let i = 0; i < toks.length; i++) {
        // Note: don't use hasOwnProperty because it doesn't work against
        // prototypical ES6 class properties, such as TokenSession.authToken
        if (pointer &&
            typeof pointer !== 'boolean' &&
            typeof pointer[toks[i]] !== 'undefined') {
            pointer = pointer[toks[i]];
        } else {
            return undefined;
        }
    }

    return pointer;
}

async function unwrap(res, path) {
    const data = await res.json();
    const { ok, status, statusText } = res;
    return {
        ok,
        status,
        statusText,
        data: path ? get(data, path) : data,
    };
}

function getErrorResponse(err) {
    return {
        ok: false,
        status: 500,
        statusText: err.message,
        home: null,
    };
}

export async function getHomes() {
    const url = `${baseUrl}/1/indexes/homes`;
    try {
        const res = await fetch(url, { headers });
        return await unwrap(res, 'hits');
    } catch (e) {
        return getErrorResponse(e);
    }
}

export async function getHome(homeId) {
    const url = `${baseUrl}/1/indexes/homes/${homeId}`;
    try {
        const res = await fetch(url, { headers });
        return await unwrap(res);
    } catch (e) {
        return getErrorResponse(e);
    }
}

export async function getReviewsByHomeId(homeId) {
    const url = `${baseUrl}/1/indexes/reviews/query`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                filters: `homeId:${homeId}`,
                hitsPerPage: 6,
                attributesToHighlight: [],
            }),
        });
        return await unwrap(res, 'hits');
    } catch (e) {
        return getErrorResponse(e);
    }
}

export async function getUserByHomeId(homeId) {
    const url = `${baseUrl}/1/indexes/users/query`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                filters: `homeId:${homeId}`,
                attributesToHighlight: [],
            }),
        });
        return await unwrap(res, 'hits.0');
    } catch (e) {
        return getErrorResponse(e);
    }
}

export async function getHomesByLocation(lat, lng, radiusInMeters = 1500) {
    const url = `${baseUrl}/1/indexes/homes/query`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                aroundLatLng: `${lat},${lng}`,
                aroundRadius: radiusInMeters,
                hitsPerPage: 10,
                attributesToHighlight: [],
            }),
        });
        return await unwrap(res, 'hits');
    } catch (e) {
        return getErrorResponse(e);
    }
}
