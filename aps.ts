// Simple Deno server to handle /api endpoints
// - GET /api/?send=message: Stores the message in memory and returns JSON confirmation
// - GET /api/receive: Returns the last stored message as JSON
// Run locally with: deno run --allow-net server.ts
// For Deno Deploy: Deploy this file to dash.deno.com as the entry point.
// Note: In-memory storage is not persistent and not shared across isolates in Deno Deploy.
// For production, use a database like Deno KV.

let storedMessage = ''; // In-memory storage for the message (simple, not persistent)

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname === '/api/') {
    const sendParam = url.searchParams.get('send');
    if (sendParam !== null) {
      storedMessage = sendParam;
      return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Missing send parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (pathname === '/api/receive') {
    return new Response(JSON.stringify({ success: true, message: storedMessage || 'No message available' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Not Found', { status: 404 });
  }
});
