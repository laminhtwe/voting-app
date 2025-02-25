addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === '/') {
    return new Response('Welcome to the voting app', {
      status: 200,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  } else if (pathname === '/favicon.ico') {
    return new Response('Favicon not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  } else if (pathname === '/api/vote/post') {
    if (request.method === 'POST') {
      return handleVotePost(request, env);
    } else if (request.method === 'GET') {
      if (url.searchParams.get('vote')) {
        return handleVotePost(request, env);
      } else {
        return handleGetVotePost(env);
      }
    } else if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
    return new Response('Method Not Allowed', { status: 405 });
  }
  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
}

async function handleVotePost(request, env) {
  let vote;
  if (request.method === 'POST') {
    const requestData = await request.json();
    vote = requestData.vote;
  } else if (request.method === 'GET') {
    const url = new URL(request.url);
    vote = url.searchParams.get('vote');
  }

  if (!vote) {
    return new Response('Bad Request: No vote option provided.', { status: 400 });
  }

  const currentVoteCount = (await poll_kv.get(vote)) || 0;
  await poll_kv.put(vote, parseInt(currentVoteCount) + 1);

  const updatedVoteCount = parseInt(currentVoteCount) + 1;
  return new Response(JSON.stringify({ success: true, count: updatedVoteCount }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handleGetVotePost(env) {
  const votes = {};
  votes['A'] = (await poll_kv.get('A')) || 0;
  votes['B'] = (await poll_kv.get('B')) || 0;
  votes['C'] = (await poll_kv.get('C')) || 0;
  votes['D'] = (await poll_kv.get('D')) || 0;

  return new Response(JSON.stringify(votes), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}