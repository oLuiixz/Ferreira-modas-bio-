import bcrypt from 'bcryptjs';
import {db,send,readBody} from '../_lib.js';
export default async function handler(req,res){
 if(req.method!=='POST')return send(res,405,{error:'Método não permitido'});
 try{
  const b=await readBody(req);
  if(!process.env.ADMIN_SETUP_TOKEN||b.setupToken!==process.env.ADMIN_SETUP_TOKEN)return send(res,403,{error:'Código de configuração inválido'});
  if(typeof b.email!=='string'||typeof b.password!=='string'||b.password.length<12)return send(res,400,{error:'Informe e-mail e senha com pelo menos 12 caracteres'});
  const count=await db().query('SELECT COUNT(*)::int AS total FROM admin_users');
  if(count.rows[0].total>0)return send(res,409,{error:'A configuração inicial já foi concluída. Use o login.'});
  const hash=await bcrypt.hash(b.password,12);
  const user=await db().query('INSERT INTO admin_users(email,password_hash) VALUES($1,$2) RETURNING id,email',[b.email.trim().toLowerCase(),hash]);
  return send(res,201,{ok:true,email:user.rows[0].email});
 }catch(e){console.error(e);return send(res,500,{error:'Não foi possível configurar o administrador'});}
}