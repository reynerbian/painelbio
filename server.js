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

// Serve arquivos estáticos da pasta 'public' sem cache para desenvolvimento
app.use(express.static('public', {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }
}));

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

// =========================================================================
// MÓDULO DE ALERTAS FINANCEIROS VIA TELEGRAM BOT (node-cron)
// =========================================================================
import cron from 'node-cron';

// Função auxiliar para enviar mensagem ao Telegram
async function sendTelegramMessage(text, replyMarkup = null) {
  const configPath = path.join(process.cwd(), 'data', 'telegram_config.json');
  if (!fs.existsSync(configPath)) return { success: false, error: 'Arquivo de configuração do telegram não existe.' };
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.botToken || !config.chatId) {
    return { success: false, error: 'Credenciais do bot do Telegram não configuradas no json.' };
  }

  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
  const body = {
    chat_id: config.chatId,
    text: text,
    parse_mode: 'HTML'
  };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (response.ok) {
    return { success: true };
  } else {
    const errText = await response.text();
    return { success: false, error: errText };
  }
}

// Polling de Comandos do Telegram
let lastTelegramUpdateId = 0;

async function startTelegramPolling() {
  console.log('[Telegram Polling] Iniciando escuta de comandos...');
  const configPath = path.join(process.cwd(), 'data', 'telegram_config.json');
  console.log('[Telegram Polling] Caminho do config:', configPath);
  
  if (!fs.existsSync(configPath)) {
    console.warn('[Telegram Polling] Arquivo telegram_config.json nao encontrado!');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('[Telegram Polling] Config do bot lida com sucesso. Chat ID:', config.chatId);
  
  if (!config.botToken || !config.chatId) {
    console.warn('[Telegram Polling] Token ou ChatID vazios no json!');
    return;
  }

  const offsetParam = lastTelegramUpdateId > 0 ? `offset=${lastTelegramUpdateId + 1}&` : '';
  const url = `https://api.telegram.org/bot${config.botToken}/getUpdates?${offsetParam}timeout=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      setTimeout(startTelegramPolling, 5000);
      return;
    }

    const data = await response.json();
    if (data.ok && data.result.length > 0) {
      console.log(`[Telegram Polling] Recebidas ${data.result.length} novas atualizações.`);
      for (const update of data.result) {
        lastTelegramUpdateId = update.update_id;

        const message = update.message;
        if (!message || !message.text) continue;

        console.log(`[Telegram Polling] Mensagem de Chat ID ${message.chat.id}: "${message.text}"`);

        if (String(message.chat.id) !== String(config.chatId)) {
          console.warn(`[Telegram Polling] Chat ID ${message.chat.id} não corresponde ao configurado (${config.chatId}). Ignorando.`);
          continue;
        }

        const text = message.text.trim().toLowerCase();

        if (text === '/sites' || text === 'sites') {
          let replyText = '';
          try {
            // Consulta os dados direto da API REST do Firestore
            const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId || 'painelbio-39e1f'}/databases/(default)/documents/leads`;
            const fbResponse = await fetch(firestoreUrl);
            
            if (!fbResponse.ok) {
              throw new Error('Falha ao conectar com o Firestore');
            }

            const fbData = await fbResponse.json();
            
            if (!fbData.documents || fbData.documents.length === 0) {
              replyText = '📊 <b>PAINELBIO - STATUS</b>\n\nNenhum site foi encontrado no Firebase.';
            } else {
              let total = 0;
              let modelsCount = { classic: 0, ebook: 0, vitrine: 0 };
              let list = [];

              for (const doc of fbData.documents) {
                const fields = doc.fields;
                if (!fields) continue;

                total++;
                // Extrai valores dos campos do formato do Firestore REST
                const model = fields.model && fields.model.stringValue ? fields.model.stringValue : 'classic';
                const arroba = fields.arroba && fields.arroba.stringValue ? fields.arroba.stringValue : 'Sem arroba';
                const createdAtStr = fields.createdAt && fields.createdAt.stringValue ? fields.createdAt.stringValue : '';
                
                modelsCount[model] = (modelsCount[model] || 0) + 1;
                
                const savedDate = createdAtStr ? new Date(createdAtStr).toLocaleDateString('pt-BR') : 'Sem data';
                list.push(`• <b>${arroba}</b> (${model}) - Salvo em ${savedDate}`);
              }

              replyText = `📊 <b>PAINELBIO - STATUS DO FIREBASE</b>\n\n`;
              replyText += `Total de sites criados: <b>${total}</b>\n\n`;
              replyText += `<b>Por Modelo:</b>\n`;
              replyText += `📘 E-books: ${modelsCount.ebook || 0}\n`;
              replyText += `🔗 Clássico (Links): ${modelsCount.classic || 0}\n`;
              replyText += `🛍️ Vitrine (Vendas): ${modelsCount.vitrine || 0}\n\n`;
              
              if (list.length > 0) {
                replyText += `<b>Lista de Sites (Últimos 10):</b>\n` + list.slice(-10).join('\n');
              }
            }
          } catch (fbErr) {
            console.error('Erro ao ler Firestore REST:', fbErr);
            replyText = '❌ <b>Erro:</b> Não foi possível carregar os dados do Firebase.';
          }
          
          await sendTelegramMessage(replyText);
        } else if (text === '/vencidos' || text === 'vencidos') {
          let replyText = '';
          try {
            const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId || 'painelbio-39e1f'}/databases/(default)/documents/leads`;
            const fbResponse = await fetch(firestoreUrl);
            
            if (!fbResponse.ok) {
              throw new Error('Falha ao conectar com o Firestore');
            }

            const fbData = await fbResponse.json();
            const now = new Date();
            
            if (!fbData.documents || fbData.documents.length === 0) {
              replyText = '📊 <b>PAINELBIO - STATUS</b>\n\nNenhum site encontrado no Firebase.';
            } else {
              let list = [];

              for (const doc of fbData.documents) {
                const fields = doc.fields;
                if (!fields) continue;

                const arroba = fields.arroba && fields.arroba.stringValue ? fields.arroba.stringValue : 'Sem arroba';
                const ownerName = fields.ownerName && fields.ownerName.stringValue ? fields.ownerName.stringValue : 'Cliente';
                const ownerPhone = fields.ownerPhone && fields.ownerPhone.stringValue ? fields.ownerPhone.stringValue : '';
                const renewalDueDateStr = fields.renewalDueDate && fields.renewalDueDate.stringValue ? fields.renewalDueDate.stringValue : '';
                const model = fields.model && fields.model.stringValue ? fields.model.stringValue : 'classic';
                const paymentStatus = fields.paymentStatus && fields.paymentStatus.stringValue ? fields.paymentStatus.stringValue : 'pending';

                if (renewalDueDateStr) {
                  const dueDate = new Date(renewalDueDateStr);
                  const diffTime = dueDate.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  // Se a data de vencimento for menor ou igual a hoje (ou se o status de pagamento não for pago)
                  if (diffDays <= 0 || paymentStatus !== 'paid') {
                    const valor = model === 'shop' ? 19.90 : (model === 'ebook' ? 14.99 : 9.90);
                    const cleanPhone = ownerPhone ? ownerPhone.replace(/\D/g, '') : '';
                    
                    let statusIcon = diffDays < 0 ? '💀 VENCIDO' : '⚠️ VENCE HOJE';
                    if (paymentStatus !== 'paid' && diffDays > 0) {
                      statusIcon = '🟡 PENDENTE';
                    }

                    const cobrancaMsg = `Olá, ${ownerName}! Passando para lembrar que a mensalidade do seu site de bio (${arroba}) venceu/está vencendo (${dueDate.toLocaleDateString('pt-BR')}). Para manter seu site ativo, você pode realizar o pagamento de R$ ${valor.toFixed(2).replace('.', ',')}. Muito obrigado!`;
                    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(cobrancaMsg)}`;

                    let itemText = `• <b>${arroba}</b> (${ownerName})\n`;
                    itemText += `  Status: <b>${statusIcon}</b> (Venceu em: ${dueDate.toLocaleDateString('pt-BR')})\n`;
                    if (cleanPhone) {
                      itemText += `  <a href="${whatsappUrl}">📲 Enviar Cobrança no WhatsApp</a>\n`;
                    } else {
                      itemText += `  <i>Telefone não cadastrado</i>\n`;
                    }
                    list.push(itemText);
                  }
                }
              }

              if (list.length > 0) {
                replyText = `💀 <b>PAINELBIO - CLIENTES INADIMPLENTES</b>\n\n` + list.join('\n');
              } else {
                replyText = `🟢 <b>PAINELBIO - STATUS FINANCEIRO</b>\n\nTodos os clientes estão com as mensalidades em dia! Nenhuma cobrança pendente.`;
              }
            }
          } catch (fbErr) {
            console.error('Erro no comando /vencidos:', fbErr);
            replyText = '❌ <b>Erro:</b> Não foi possível carregar os dados financeiros do Firebase.';
          }
          
          await sendTelegramMessage(replyText);
        } else if (text === '/start') {
          await sendTelegramMessage('👋 Olá! Eu sou o Bot de Alertas do PainelBio. Envie <b>/sites</b> a qualquer momento para ver o status dos sites criados na galeria!');
        }
      }
    }
    setTimeout(startTelegramPolling, 3000);
  } catch (err) {
    console.error('Erro no polling do Telegram:', err);
    setTimeout(startTelegramPolling, 5000);
  }
}

setTimeout(startTelegramPolling, 3000);

// Rota de Teste para o Telegram
app.get('/api/test-telegram', async (req, res) => {
  try {
    const result = await sendTelegramMessage('🔔 <b>PainelBio Alertas:</b> Conexão de teste efetuada com sucesso! Seu bot está ativo e pronto para te alertar sobre cobranças.');
    if (result.success) {
      res.json({ success: true, message: 'Mensagem de teste enviada com sucesso para o Telegram!' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Função para buscar e alertar clientes vencidos
async function checkVencimentosAndAlert() {
  try {
    const sitesDir = path.join(process.cwd(), 'data', 'sites');
    if (!fs.existsSync(sitesDir)) return;

    const folders = fs.readdirSync(sitesDir);
    const now = new Date();
    
    let alertText = `🔔 <b>PAINELBIO - COBRANÇAS DO DIA</b>\n\n`;
    let count = 0;

    for (const folder of folders) {
      const dadosPath = path.join(sitesDir, folder, '_dados.json');
      if (fs.existsSync(dadosPath)) {
        const site = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
        if (site.renewalDueDate && site.paymentStatus === 'paid') {
          const dueDate = new Date(site.renewalDueDate);
          
          // Calcula diferença de dias
          const diffTime = dueDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          const valor = site.model === 'shop' ? 19.90 : (site.model === 'ebook' ? 14.99 : 9.90);
          const cleanPhone = site.ownerPhone ? site.ownerPhone.replace(/\D/g, '') : '';
          const clientName = site.ownerName || 'Cliente';

          // Mensagem pré-formatada para enviar ao cliente no WhatsApp
          const cobrancaMsg = `Olá, ${clientName}! Passando para lembrar que a mensalidade do seu site de bio (${site.arroba}) está próxima do vencimento (${dueDate.toLocaleDateString('pt-BR')}). Para manter seu site online, você pode realizar a renovação no valor de R$ ${valor.toFixed(2).replace('.', ',')}. Muito obrigado!`;
          const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(cobrancaMsg)}`;

          if (diffDays === 3) {
            alertText += `⚠️ <b>Aviso (Faltam 3 dias):</b>\n`;
            alertText += `• Cliente: ${clientName} (${site.arroba})\n`;
            alertText += `• Telefone: ${site.ownerPhone || 'Não cadastrado'}\n`;
            alertText += `• Vence em: ${dueDate.toLocaleDateString('pt-BR')}\n`;
            if (cleanPhone) {
              alertText += `<a href="${whatsappUrl}">📲 Enviar Lembrete no WhatsApp</a>\n`;
            }
            alertText += `\n`;
            count++;
          } else if (diffDays === 0) {
            alertText += `🚨 <b>VENCE HOJE:</b>\n`;
            alertText += `• Cliente: ${clientName} (${site.arroba})\n`;
            alertText += `• Telefone: ${site.ownerPhone || 'Não cadastrado'}\n`;
            if (cleanPhone) {
              alertText += `<a href="${whatsappUrl}">📲 Cobrar via WhatsApp</a>\n`;
            }
            alertText += `\n`;
            count++;
          } else if (diffDays < 0) {
            // Vencido há dias
            alertText += `💀 <b>VENCIDO (Atrás em ${Math.abs(diffDays)} dias):</b>\n`;
            alertText += `• Cliente: ${clientName} (${site.arroba})\n`;
            alertText += `• Telefone: ${site.ownerPhone || 'Não cadastrado'}\n`;
            if (cleanPhone) {
              alertText += `<a href="${whatsappUrl}">📲 Cobrar Urgente no WhatsApp</a>\n`;
            }
            alertText += `\n`;
            count++;
          }
        }
      }
    }

    if (count > 0) {
      await sendTelegramMessage(alertText);
      console.log(`[Telegram Cron] Relatório enviado com sucesso contendo ${count} alertas!`);
    } else {
      console.log(`[Telegram Cron] Nenhuma cobrança pendente para hoje.`);
    }

  } catch (err) {
    console.error('Erro na verificação de cobranças do cron Telegram:', err);
  }
}

// Agendamento diário do Cron: Todo dia às 09:00 da manhã
// Formato cron: minuto(0) hora(9) dia-do-mes(*) mes(*) dia-da-semana(*)
cron.schedule('0 9 * * *', () => {
  console.log('[Cron] Iniciando verificação diária de vencimentos de cobrança...');
  checkVencimentosAndAlert();
});

// Adiciona rota secreta para rodar a verificação na hora via navegador para teste do operador
app.get('/api/trigger-alert', async (req, res) => {
  try {
    await checkVencimentosAndAlert();
    res.json({ success: true, message: 'Verificação disparada com sucesso! Verifique seu bot do Telegram.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
