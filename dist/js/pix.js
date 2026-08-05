// --- PIX BR CODE BACEN GENERATOR (0% TAXAS) ---

/**
 * Calculador de CRC16-CCITT (Padrão BACEN para EMV BR Code)
 */
function crc16Bacen(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formata campo EMV (ID + Tamanho 2 dígitos + Valor)
 */
function formatEmvField(id, value) {
    if (!value) return '';
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
}

/**
 * Normaliza textos sem acentos e sem caracteres especiais para o padrão EMVco BACEN
 */
function normalizePixText(text) {
    if (!text) return '';
    return text.normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '')
               .replace(/[^a-zA-Z0-9 ]/g, '')
               .trim();
}

/**
 * Gera a string do PIX Copia e Cola (EMV BR Code oficial do Banco Central)
 */
function generatePixBRCode({ key, name, city, amount, txId = '***' }) {
    if (!key) return '';

    const cleanKey = key.trim();
    const cleanName = normalizePixText(name || 'PainelBio Recebimentos').substring(0, 25);
    const cleanCity = normalizePixText(city || 'BRASIL').substring(0, 15);
    const formattedAmount = parseFloat(amount || 0).toFixed(2);

    // 26 - Merchant Account Information (GUI + Key)
    const guiField = formatEmvField('00', 'br.gov.bcb.pix');
    const keyField = formatEmvField('01', cleanKey);
    const merchantAccountInfo = formatEmvField('26', `${guiField}${keyField}`);

    // 52 - Merchant Category Code (0000 = Geral)
    const mcc = formatEmvField('52', '0000');

    // 53 - Transaction Currency (986 = BRL)
    const currency = formatEmvField('53', '986');

    // 54 - Transaction Amount
    const amountField = formatEmvField('54', formattedAmount);

    // 58 - Country Code (BR)
    const country = formatEmvField('58', 'BR');

    // 59 - Merchant Name
    const merchantName = formatEmvField('59', cleanName);

    // 60 - Merchant City
    const merchantCity = formatEmvField('60', cleanCity);

    // 62 - Additional Data Field (TXID)
    const txIdField = formatEmvField('05', txId);
    const additionalData = formatEmvField('62', txIdField);

    // Monta o payload inicial sem o CRC (ID 63)
    const payloadWithoutCrc = `000201${merchantAccountInfo}${mcc}${currency}${amountField}${country}${merchantName}${merchantCity}${additionalData}6304`;

    // Calcula o CRC16 e anexa no final
    const checksum = crc16Bacen(payloadWithoutCrc);
    return `${payloadWithoutCrc}${checksum}`;
}

/**
 * Gera a URL do QR Code PIX
 */
function getPixQrCodeUrl(payload) {
    if (!payload) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
}

// Exposição global
window.generatePixBRCode = generatePixBRCode;
window.getPixQrCodeUrl = getPixQrCodeUrl;
