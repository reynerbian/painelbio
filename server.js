import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import multer from 'multer';
import cors from 'cors';
import { generateStaticSite } from './public/js/generator.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow requests from any origin (Cloudflare Pages, etc)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// API para fazer upload de imagens
app.post('/api/upload', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'vitrine1', maxCount: 1 },
  { name: 'vitrine2', maxCount: 1 },
  { name: 'vitrine3', maxCount: 1 }
]), (req, res) => {
  const files = req.files;
  const urls = {};
  
  if (files) {
    for (const key in files) {
      if (files[key] && files[key][0]) {
        urls[key] = `/uploads/${files[key][0].filename}`;
      }
    }
  }
  
  res.json({ success: true, urls });
});

import https from 'https';
import http from 'http';

// Helper function to download image
async function downloadImage(url, dest) {
  if (!url || !url.startsWith('http')) return;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => reject(new Error('Server responded with ' + response.statusCode)));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// generateStaticSite e importado de ./functions/shared.js

// API para publicar (Salvar) um site
app.post('/api/publish', async (req, res) => {
  try {
    const data = req.body;
    if (!data.arroba) return res.status(400).json({ error: 'Arroba é obrigatório' });
    
    const slug = data.arroba.startsWith('@') ? data.arroba : '@' + data.arroba;
    const cleanSlug = slug.toLowerCase();
    
    // Pasta onde os sites ficarão armazenados
    const sitesBaseDir = path.join(process.cwd(), 'data', 'sites');
    const siteDir = path.join(sitesBaseDir, cleanSlug);
    
    // Cria diretórios se não existirem
    if (!fs.existsSync(sitesBaseDir)) {
      fs.mkdirSync(sitesBaseDir, { recursive: true });
    }
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
    }
    
    // Adiciona data de criação se não existir
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }

    // Salva _dados.json
    fs.writeFileSync(path.join(siteDir, '_dados.json'), JSON.stringify(data, null, 2), 'utf8');
    
    // Gera index.html
    const htmlContent = generateStaticSite(data);
    fs.writeFileSync(path.join(siteDir, 'index.html'), htmlContent, 'utf8');
    
    // Baixa/salva a imagem de preview/logo se existir
    if (data.avatar && data.avatar.startsWith('http')) {
      try {
        await downloadImage(data.avatar, path.join(siteDir, 'url_logo.jpg'));
      } catch (err) {
        console.error('Erro ao baixar avatar:', err);
      }
    }
    
    // Salva o screenshot do celular (preview.png)
    if (data.previewBase64) {
      const base64Data = data.previewBase64.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(path.join(siteDir, 'preview.png'), base64Data, 'base64');
      delete data.previewBase64; // Não precisa salvar a base64 no banco antigo
    } else if (fs.existsSync(path.join(siteDir, 'url_logo.jpg'))) {
      // Fallback: copia a logo se não houver print
      fs.copyFileSync(path.join(siteDir, 'url_logo.jpg'), path.join(siteDir, 'preview.png'));
    }
    
    // Salva no banco antigo por compatibilidade por enquanto
    const slugForDb = cleanSlug.replace('@', '');
    saveStore(slugForDb, data);
    
    res.json({ success: true, url: `/${slugForDb}` });
  } catch (err) {
    console.error('Erro no publish:', err);
    res.status(500).json({ error: 'Erro ao publicar site' });
  }
});

// API para listar sites para a Galeria
app.get('/api/gallery', (req, res) => {
  const sitesBaseDir = path.join(process.cwd(), 'data', 'sites');
  if (!fs.existsSync(sitesBaseDir)) {
    return res.json({ sites: [] });
  }
  
  const folders = fs.readdirSync(sitesBaseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  const sites = [];
  for (const folder of folders) {
    const dadosPath = path.join(sitesBaseDir, folder, '_dados.json');
    if (fs.existsSync(dadosPath)) {
      try {
        const dados = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
        sites.push({
          arroba: dados.arroba,
          name: dados.name,
          avatar: dados.avatar,
          preset: dados.preset || 'gray',
          createdAt: dados.createdAt || new Date().toISOString(),
          // Vamos servir o preview via uma rota especial estática depois
          previewPath: `/api/sites/${folder}/preview.png`
        });
      } catch (e) {
        console.error('Erro ao ler _dados.json de', folder);
      }
    }
  }
  
  // Ordenar sites por data de criação (mais novos primeiro)
  sites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ sites });
});

// API para deletar um site
app.delete('/api/sites/:arroba', (req, res) => {
  const arroba = req.params.arroba;
  if (!arroba) return res.status(400).json({ error: 'Arroba não informado' });
  
  const cleanSlug = arroba.startsWith('@') ? arroba.toLowerCase() : '@' + arroba.toLowerCase();
  const sitesBaseDir = path.join(process.cwd(), 'data', 'sites');
  const siteDir = path.join(sitesBaseDir, cleanSlug);
  
  try {
    if (fs.existsSync(siteDir)) {
      fs.rmSync(siteDir, { recursive: true, force: true });
    }
    
    // Deleta do db.js
    const slugForDb = cleanSlug.replace('@', '');
    deleteStore(slugForDb);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao deletar site:', err);
    res.status(500).json({ error: 'Erro ao deletar o site' });
  }
});

// Rota estática para servir os arquivos do site dentro de /api/sites/ (para carregar imagens na galeria)
app.use('/api/sites', express.static(path.join(process.cwd(), 'data', 'sites')));

// API para pegar todas as lojas (legado)
app.get('/api/stores', (req, res) => {
  res.json(getAllStores());
});

// Rota dinâmica para exibir a bio de cada loja
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  
  if (slug === 'favicon.ico' || slug === 'admin') {
    return res.status(404).end();
  }
  
  const folderSlug = '@' + slug.toLowerCase();
  const siteIndex = path.join(process.cwd(), 'data', 'sites', folderSlug, 'index.html');
  
  // Se o site estático gerado existir, nós o entregamos diretamente!
  if (fs.existsSync(siteIndex)) {
    return res.sendFile(siteIndex);
  }
  
  // Fallback: se não existir o estático, tenta ler do bd legado
  const store = getStore(slug);
  if (!store) {
    return res.redirect('/');
  }
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${store.name || 'Bio'}</title>
        <style>
            body { background-color: #000; color: #fff; font-family: sans-serif; text-align: center; padding: 50px; }
        </style>
    </head>
    <body>
        <h1>${store.name || 'Sem nome'}</h1>
        <p>${store.bio || ''}</p>
    </body>
    </html>
  `);
});

// Função para obter o IP local da máquina na rede Wi-Fi
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// Global error handler para garantir que sempre retorne JSON
app.use((err, req, res, next) => {
  console.error('Erro Express Global:', err);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'O arquivo (imagem Base64) enviado é muito grande.' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Erro de formatação no JSON enviado.' });
  }
  res.status(500).json({ success: false, error: err.message || 'Erro interno no servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`PainelBio está rodando de forma local!`);
  console.log(`\nAcesse no seu computador:`);
  console.log(`> http://localhost:${PORT}`);
  
  const ips = getLocalIPs();
  if (ips.length > 0) {
    console.log(`\nAcesse no seu CELULAR (conectado no mesmo Wi-Fi):`);
    ips.forEach(ip => {
      console.log(`> http://${ip}:${PORT}`);
    });
  } else {
    console.log(`\nNão foi possível detectar IPs locais na rede local. Verifique se está conectado ao Wi-Fi.`);
  }
  console.log(`==================================================\n`);
});
