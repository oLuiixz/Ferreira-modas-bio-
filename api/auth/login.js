import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import {db,send,readBody,setCookie} from '../../lib/server.js';
export default async function handler(req,res){
 if(req.method!=='POST')return send(res,405,{error:'Método não permitido'});
 try{
  const {email,password}=await readBody(req);
  if(typeof email!=='string'||typeof password!=='string'||password.length>200)return send(res,400,{error:'Informe e-mail e senha válidos'});
  const q=await db().query('SELECT id,email,password_hash FROM admin_users WHERE lower(email)=lower($1)',[email.trim()]);
  if(!q.rowCount||!(await bcrypt.compare(password,q.rows[0].password_hash)))return send(res,401,{error:'E-mail ou senha incorretos'});
  const token=crypto.randomBytes(32).toString('hex'),hash=crypto.createHash('sha256').update(token).digest('hex');
  await db().query('INSERT INTO admin_sessions(user_id,token_hash,expires_at) VALUES($1,$2,NOW()+INTERVAL \'7 days\')',[q.rows[0].id,hash]);
  await db().query('UPDATE admin_users SET last_login_at=NOW() WHERE id=$1',[q.rows[0].id]);
  setCookie(res,token,604800);return send(res,200,{ok:true,email:q.rows[0].email});
 }catch(e){console.error(e);return send(res,500,{error:'Falha interna ao autenticar'});}
}