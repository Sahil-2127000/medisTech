const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Where uploaded files are kept:
//  - Cloudinary when configured (CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>,
//    or CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET). Needed on Render,
//    whose disk is wiped on every restart/redeploy.
//  - Otherwise the local uploads/ folder (development).

const cloudinaryConfig = () => {
  if (process.env.CLOUDINARY_URL) {
    const m = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
};

const parseDataUrl = (dataUrl) => {
  const m = /^data:([^;,]+)?(;base64)?,/.exec(dataUrl || '');
  return { mime: (m && m[1]) || 'application/octet-stream', base64: m ? dataUrl.slice(m[0].length) : dataUrl };
};

const uploadToCloudinary = async ({ dataUrl, mime, safeName, folder }, cfg) => {
  // Images go to the image pipeline; PDFs and everything else as "raw" files
  // (free accounts block delivery of PDFs uploaded as images).
  const resourceType = mime.startsWith('image/') ? 'image' : 'raw';
  const publicId = resourceType === 'raw' ? safeName : safeName.replace(/\.[^.]+$/, '');
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, public_id: publicId, timestamp };
  const toSign = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  const signature = crypto.createHash('sha1').update(toSign + cfg.apiSecret).digest('hex');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ ...params, file: dataUrl, api_key: cfg.apiKey, signature }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${data.error?.message || res.status}`);
  return data.secure_url;
};

const saveToDisk = ({ base64, safeName, folder }, req) => {
  const dir = path.join(__dirname, '..', 'uploads', folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, safeName), base64, 'base64');
  // Use the address the client reached us on, so links also work from the phone app
  return `${req.protocol}://${req.get('host')}/uploads/${folder}/${safeName}`;
};

// Saves a base64 data URL and returns its public URL
exports.saveUpload = async ({ dataUrl, filename, folder = 'documents' }, req) => {
  const { mime, base64 } = parseDataUrl(dataUrl);
  const safeName = `${Date.now()}-${(filename || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
  const cfg = cloudinaryConfig();
  if (cfg) return uploadToCloudinary({ dataUrl: `data:${mime};base64,${base64}`, mime, safeName, folder: `medistech/${folder}` }, cfg);
  return saveToDisk({ base64, safeName, folder }, req);
};

exports.cloudStorageConfigured = () => !!cloudinaryConfig();
