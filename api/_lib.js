import pg from 'pg';
import crypto from 'node:crypto';
const {Pool}=pg;
let pool;
export function db(){if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL não configurada');if(!pool)pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false},max:5,idleTimeoutMillis:10000});return pool;}
export function send(res,status,data){res.status(status).json(data);}
export function readBody(req){return new Promise((resolve,reject)=>{let raw='';req.on('data',c=>{raw+=c;if(raw.length>1e6)reject(new Error('Corpo muito grande'))});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(new Error('JSON inválido'))}});req.on('error',reject)});}
export function cookie(req){const raw=req.headers.cookie||'';const part=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith('fm_session='));return part?decodeURIComponent(part.slice('fm_session='.length)):'';}
export function setCookie(res,token,maxAge){res.setHeader('Set-Cookie',`fm_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`);}
export function clearCookie(res){res.setHeader('Set-Cookie','fm_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');}
export async function requireAdmin(req,res){const token=cookie(req);if(!token){send(res,401,{error:'Não autenticado'});return null;}const hash=crypto.createHash('sha256').update(token).digest('hex');const q=await db().query('SELECT u.id,u.email FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>NOW()',[hash]);if(!q.rowCount){clearCookie(res);send(res,401,{error:'Sessão expirada'});return null;}return q.rows[0];}
