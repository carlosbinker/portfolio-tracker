const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.body;

  // Update password with recovery token
  if (action === 'update-password') {
    const { token: recoveryToken, password: newPassword } = req.body;
    if (!recoveryToken || !newPassword) return res.status(400).json({ error: 'Token y contraseña requeridos' });
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${recoveryToken}`
      },
      body: JSON.stringify({ password: newPassword })
    });
    const data = await r.json();
    if (data.error) return res.status(400).json({ error: data.error.message || 'Error al cambiar contraseña' });
    return res.status(200).json({ ok: true });
  }

  // Reset password - no token needed, just email
  if (action === 'reset-password') {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });
    const r = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ email })
    });
    return res.status(200).json({ ok: true });
  }

  // Update alias - token required
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  if (action === 'update-alias') {
    const { alias } = req.body;

    // Get user id from token
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` }
    });
    const user = await userRes.json();
    if (!user?.id) return res.status(401).json({ error: 'Token inválido' });

    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ alias: alias?.trim() || null })
    });
    const data = await r.json();
    return res.status(200).json({ ok: true, alias: data?.[0]?.alias || null });
  }

  return res.status(400).json({ error: 'Acción no válida' });
}
