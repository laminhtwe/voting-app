addEventListener('fetch', (event) => {
  console.log('Fetch event received for:', event.request.url);
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  const pathname = url.pathname;

  console.log('Processing request for pathname:', pathname);

  // Handle root path (/)
  if (pathname === '/') {
    return new Response('Welcome to the voting app', {
      status: 200,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Handle favicon.ico
  if (pathname === '/favicon.ico') {
    return new Response('Favicon not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Handle all other paths
  if (pathname === '/api/vote/post') {
    return handleVotePost(request, event, event.env);
  }

  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// POST /api/vote/post - Record a vote
async function handleVotePost(request, event, env) {
  try {
    const { vote } = await request.json();
    if (!['A', 'B', 'C', 'D'].includes(vote)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid vote option' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Use waitUntil to handle KV updates asynchronously
    event.waitUntil(
      (async () => {
        let currentCount = await env['poll-data'].get(vote);
        currentCount = currentCount ? parseInt(currentCount) : 0;
        await env['poll-data'].put(vote, (currentCount + 1).toString());
      })()
    );
    return new Response(
      JSON.stringify({ success: true, message: 'Vote recorded' }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('POST error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}