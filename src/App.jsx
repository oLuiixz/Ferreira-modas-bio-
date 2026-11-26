import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Instagram, MapPin, Menu, MessageCircle, ShieldCheck, ShoppingBag, X } from 'lucide-react';

const products = [
  { id: 1, name: 'Camiseta Essential', category: 'Básicos que elevam', price: 'R$ 69,90', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', tag: 'MAIS VENDIDO' },
  { id: 2, name: 'Look urbano', category: 'Estilo sem esforço', price: 'R$ 129,90', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=85', tag: 'NOVO' },
  { id: 3, name: 'Camisa casual', category: 'Do trabalho ao encontro', price: 'R$ 99,90', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Street collection', category: 'Sua identidade', price: 'R$ 149,90', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85' }
];
const links = [
  { title: 'Fale com a gente', detail: 'Atendimento direto pelo WhatsApp', href: 'https://wa.me/5535999999999', icon: MessageCircle },
  { title: 'Como chegar', detail: 'Avenida Dona Floriana, 845 · Centro', href: 'https://www.google.com/maps/search/?api=1&query=Avenida+Dona+Floriana+845', icon: MapPin },
  { title: 'Instagram', detail: '@ferreira.m0das', href: 'https://instagram.com/ferreira.m0das', icon: Instagram }
];

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}>
    <div className="brand-mark"><span>F</span><i>✦</i></div>
    <div><strong>FERREIRA</strong><small>MODAS</small></div>
  </div>;
}

function AdminPreview() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return <main className="admin-page">
    <a className="back-link" href="/"><ArrowLeft size={16}/> Voltar à página</a>
    <div className="admin-card"><Brand/><div className="eyebrow">ÁREA RESTRITA</div><h1>Painel administrativo</h1><p>Entre para gerenciar produtos, destaques e links da Ferreira Modas.</p>
      <form onSubmit={e => { e.preventDefault(); alert('A autenticação será conectada ao servidor na próxima etapa. Nenhuma senha foi validada ou armazenada.'); }}>
        <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" required /></label>
        <label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha" required /></label>
        <button className="gold-button" type="submit">Entrar no painel <ArrowUpRight size={16}/></button>
      </form>
      <div className="secure-note"><ShieldCheck size={15}/> Acesso protegido será ativado com autenticação no servidor.</div>
    </div>
  </main>;
}

function Storefront() {
  const rail = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scroll = dir => rail.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  return <main>
    <div className="announcement">MODA MASCULINA • GUAXUPÉ, MG <span>—</span> ESTILO QUE COMBINA COM VOCÊ</div>
    <header className="site-header">
      <a href="#" aria-label="Ferreira Modas início"><Brand/></a>
      <nav><a href="#destaques">Destaques</a><a href="#sobre">A loja</a><a href="#contato">Contato</a></nav>
      <a className="header-cta" href="https://wa.me/5535999999999">Fale conosco <ArrowUpRight size={15}/></a>
      <button className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen?<X/>:<Menu/>}</button>
    </header>
    <AnimatePresence>{menuOpen && <motion.div className="mobile-nav" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><a href="#destaques" onClick={()=>setMenuOpen(false)}>Destaques</a><a href="#sobre" onClick={()=>setMenuOpen(false)}>A loja</a><a href="#contato" onClick={()=>setMenuOpen(false)}>Contato</a></motion.div>}</AnimatePresence>
    <section className="hero" id="sobre">
      <div className="hero-copy"><div className="eyebrow"><span/> MODA MASCULINA · DESDE SEMPRE COM ATITUDE</div>
        <h1>Vista sua<br/><em>melhor versão.</em></h1>
        <p>Peças que acompanham seu ritmo. Estilo, qualidade e personalidade em cada detalhe.</p>
        <a className="gold-button" href="#destaques">Descubra a coleção <ArrowUpRight size={17}/></a>
        <div className="hero-foot"><span>01 / 04</span><div/><span>FERREIRA MODAS</span></div>
      </div>
      <div className="hero-visual"><div className="hero-image"></div><div className="image-caption"><span>ESTILO É IDENTIDADE</span><span>FM — 2026</span></div><div className="vertical-word">FERREIRA MODAS</div></div>
      <div className="hero-index">01</div>
    </section>
    <section className="products-section" id="destaques">
      <div className="section-heading"><div><div className="eyebrow">SELEÇÃO ESPECIAL</div><h2>Em destaque<span>.</span></h2><p>Escolhas que fazem a diferença no seu visual.</p></div>
        <div className="rail-controls"><button onClick={()=>scroll(-1)} aria-label="Anterior"><ArrowLeft/></button><button onClick={()=>scroll(1)} aria-label="Próximo"><ArrowRight/></button></div>
      </div>
      <div className="product-rail" ref={rail}>{products.map((p,i)=><motion.article className="product-card" key={p.id} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}>
        <a href="https://wa.me/5535999999999" className="product-image"><img src={p.image} alt={p.name}/>{p.tag&&<span className="product-tag">{p.tag}</span>}<span className="product-arrow"><ArrowUpRight/></span></a>
        <div className="product-meta"><div><h3>{p.name}</h3><p>{p.category}</p></div><strong>{p.price}</strong></div>
      </motion.article>)}</div>
      <div className="drag-hint"><span/> ARRASTE PARA EXPLORAR <ArrowRight size={13}/></div>
    </section>
    <section className="manifesto"><div className="manifesto-mark">FM</div><div className="eyebrow">MAIS QUE SE VESTIR</div><h2>Seu estilo fala.<br/><em>Deixe ele dizer.</em></h2><p>Uma curadoria de moda masculina para quem sabe que os detalhes fazem toda a diferença.</p></section>
    <section className="contact-section" id="contato"><div><div className="eyebrow">ENCONTRE SEU ESTILO</div><h2>Vamos conversar<span>.</span></h2><p>Chama a gente e descubra as novidades da loja.</p></div><div className="contact-links">{links.map(({title,detail,href,icon:Icon})=><a href={href} target="_blank" rel="noreferrer" key={title}><span className="contact-icon"><Icon/></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowUpRight className="contact-arrow"/></a>)}</div></section>
    <footer><Brand compact/><span>© 2026 FERREIRA MODAS · GUAXUPÉ, MG</span><a href="/admin">Acesso administrativo</a></footer>
    <a className="floating-whatsapp" href="https://wa.me/5535999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a>
  </main>;
}

export default function App() { return window.location.pathname.startsWith('/admin') ? <AdminPreview/> : <Storefront/>; }