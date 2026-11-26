import pg from 'pg';
import bcrypt from 'bcryptjs';
const {Pool}=pg;
const [,,email,password]=process.argv;
if(!process.env.DATABASE_URL||!email||!password||password.length<12){console.error('Uso: DATABASE_URL=... npm run admin:create -- email senha-com-pelo-menos-12-caracteres');process.exit(1);}
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});
try{const hash=await bcrypt.hash(password,12);await pool.query('INSERT INTO admin_users(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash',[email.toLowerCase(),hash]);console.log('Administrador criado/atualizado:',email.toLowerCase());}finally{await pool.end();}
