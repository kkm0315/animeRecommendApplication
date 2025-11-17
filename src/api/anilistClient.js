const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

function sanitizeVariables(variables = {}) {
  return Object.fromEntries(
    Object.entries(variables).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  );
}

export async function fetchAniList(query, variables = {}) {
  const payload = {
    query,
    variables: sanitizeVariables(variables),
  };

  const res = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`AniList error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('AniList GraphQL error');
  }
  return json.data;
}