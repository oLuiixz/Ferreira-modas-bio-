import {db,send,readBody,requireAdmin} from '../lib/server.js';
export default async function handler(req,res){
 try{
  if(req.method==='GET'){const q=await db().query('SELECT id,name,description,category,price_cents,image_url,product_url,is_featured,sort_order,is_active FROM products WHERE is_active=true ORDER BY is_featured DESC,sort_order ASC,created_at DESC');return send(res,200,{products:q.rows});}
  const user=await requireAdmin(req,res);if(!user)return;
  if(req.method==='POST'){const b=await readBody(req);if(!b.name?.trim())return send(res,400,{error:'Nome do produto é obrigatório'});const q=await db().query('INSERT INTO products(name,category,description,price_cents,image_url,product_url,is_featured,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7,COALESCE((SELECT MAX(sort_order)+1 FROM products),0)) RETURNING *',[b.name.trim(),b.category||'',b.description||'',b.price_cents??null,b.image_url||'',b.product_url||'',!!b.is_featured]);return send(res,201,{product:q.rows[0]});}
  if(req.method==='PATCH'){const b=await readBody(req);if(!b.id)return send(res,400,{error:'ID obrigatório'});const q=await db().query('UPDATE products SET name=$1,category=$2,description=$3,price_cents=$4,image_url=$5,product_url=$6,is_featured=$7,updated_at=NOW() WHERE id=$8 RETURNING *',[b.name,b.category||'',b.description||'',b.price_cents??null,b.image_url||'',b.product_url||'',!!b.is_featured,b.id]);if(!q.rowCount)return send(res,404,{error:'Produto não encontrado'});return send(res,200,{product:q.rows[0]});}
  if(req.method==='DELETE'){const b=await readBody(req);if(!b.id)return send(res,400,{error:'ID obrigatório'});await db().query('UPDATE products SET is_active=false,updated_at=NOW() WHERE id=$1',[b.id]);return send(res,200,{ok:true});}
  return send(res,405,{error:'Método não permitido'});
 }catch(e){console.error(e);return send(res,500,{error:'Erro ao acessar os produtos'});}
}