const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

async function getCoordinatorId(token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?rol=eq.coordinador&select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  return data?.[0]?.id || null;
}

async function isCoordinator(token) {
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` }
  });
  const user = await userRes.json();
  if (!user?.id) return false;
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=rol&limit=1`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` }
  });
  const profile = await profileRes.json();
  return profile?.[0]?.rol === 'coordinador';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  // Verificar que es coordinador
  const coordCheck = await isCoordinator(token);
  if (!coordCheck) return res.status(403).json({ error: 'Solo el coordinador puede gestionar el reto' });

  const coordId = await getCoordinatorId(token);
  if (!coordId) return res.status(404).json({ error: 'Coordinador no encontrado' });

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const base = `${SUPABASE_URL}/rest/v1/positions`;

  if (req.method === 'GET') {
    const r = await fetch(`${base}?user_id=eq.${coordId}&order=created_at.asc`, { headers });
    return res.status(200).json(await r.json());
  }

  if (req.method === 'POST') {
    const body = { ...req.body, user_id: coordId };
    const r = await fetch(base, { method: 'POST', headers, body: JSON.stringify(body) });
    return res.status(201).json(await r.json());
  }

  if (req.method === 'PUT') {
    const { id, ...body } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });
    const r = await fetch(`${base}?id=eq.${id}&user_id=eq.${coordId}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ ...body, updated_at: new Date().toISOString() })
    });
    return res.status(200).json(await r.json());
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });
    await fetch(`${base}?id=eq.${id}&user_id=eq.${coordId}`, { method: 'DELETE', headers });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
