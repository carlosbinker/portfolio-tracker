const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

function setCors(res, req) {
  const origin = req.headers.origin || '';
  if (['http://localhost:3000','http://127.0.0.1:3000'].includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');
}

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(400).json({ error: 'x-user-id header required' });

  const base = `${SUPABASE_URL}/rest/v1/positions`;

  // GET — traer todas las posiciones del usuario
  if (req.method === 'GET') {
    const r = await fetch(`${base}?user_id=eq.${encodeURIComponent(userId)}&order=created_at.asc`, { headers });
    const data = await r.json();
    return res.status(200).json(data);
  }

  // POST — crear posición
  if (req.method === 'POST') {
    const body = { ...req.body, user_id: userId };
    const r = await fetch(base, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await r.json();
    return res.status(201).json(data);
  }

  // PUT — actualizar posición
  if (req.method === 'PUT') {
    const { id, ...body } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });
    const r = await fetch(`${base}?id=eq.${id}&user_id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH', headers, body: JSON.stringify({ ...body, updated_at: new Date().toISOString() })
    });
    const data = await r.json();
    return res.status(200).json(data);
  }

  // DELETE — eliminar posición
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });
    await fetch(`${base}?id=eq.${id}&user_id=eq.${encodeURIComponent(userId)}`, { method: 'DELETE', headers });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
