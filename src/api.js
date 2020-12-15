const appId = 'PKLXWAH1SN';
const searchOnlyApiKey = 'c6819e479a69b72e2fc877e0a1fd18e4';
const baseUrl = `https://${appId}-dsn.algolia.net`;
const headers = {
    'X-Algolia-Application-Id': appId,
    'X-Algolia-API-Key': searchOnlyApiKey,
};

async function unwrap(res) {
    const data = await res.json();
    const { ok, status, statusText } = res;
    return {
        ok,
        status,
        statusText,
        data,
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
        return await unwrap(res);
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
        return await unwrap(res);
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
        return await unwrap(res);
    } catch (e) {
        return getErrorResponse(e);
    }
}
