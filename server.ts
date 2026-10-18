import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';
import { DEFAULT_PORTFOLIO_DATA } from './src/data/defaultData.ts';
import { validateInquiryInput, validateProjectInput } from './src/utils/portfolio.ts';
import type { PortfolioData, ClientInquiry, Project } from './src/types/portfolio.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

interface StoredDatabase extends PortfolioData {
  inquiries: ClientInquiry[];
  adminPasswordHash: string;
}

const DEFAULT_ADMIN_PASSWORD = 'asif@12345';
const OLD_DEFAULT_PASSWORD = 'asif2026';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function initDb(): StoredDatabase {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (data && data.profile && Array.isArray(data.projects)) {
        if (!data.inquiries) data.inquiries = [];
        // Update password if still on initial default or old default
        if (!data.adminPasswordHash || data.adminPasswordHash === hashPassword(OLD_DEFAULT_PASSWORD)) {
          data.adminPasswordHash = hashPassword(DEFAULT_ADMIN_PASSWORD);
        }
        return data;
      }
    } catch (e) {
      console.error('Error reading db.json, checking backup:', e);
      const backupFile = path.join(DATA_DIR, 'db.backup.json');
      if (fs.existsSync(backupFile)) {
        try {
          const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
          if (backupData && backupData.profile) {
            return backupData;
          }
        } catch (backupErr) {
          console.error('Backup also failed:', backupErr);
        }
      }
    }
  }

  const initialDb: StoredDatabase = {
    ...DEFAULT_PORTFOLIO_DATA,
    inquiries: [
      {
        id: 'inq-sample-1',
        name: 'Bengal Animation Studio (Inquiry Sample)',
        email: 'producers@bengalanim.com',
        projectType: '2D Animation & Background Art',
        budgetRange: '$1,000 - $3,000',
        message: 'Hello Asif, we love your rural Bengali backgrounds and cartoon animation style in Adobe Animate. We have a 6-episode educational animated series and would like to collaborate.',
        createdAt: new Date().toISOString(),
        status: 'unread',
      },
    ],
    adminPasswordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
  };

  saveDb(initialDb);
  return initialDb;
}

function saveDb(data: StoredDatabase): void {
  try {
    const tmpFile = `${DB_FILE}.tmp`;
    const backupFile = path.join(DATA_DIR, 'db.backup.json');
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(tmpFile, content, 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
    fs.writeFileSync(backupFile, content, 'utf-8');
  } catch (err) {
    console.error('Failed to write to db.json:', err);
  }
}

let db: StoredDatabase = initDb();

// Persistent session token storage
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function loadSessions(): Set<string> {
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const arr = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
      if (Array.isArray(arr)) return new Set(arr);
    } catch (e) {
      console.error('Error reading sessions.json:', e);
    }
  }
  return new Set();
}

const activeSessions = loadSessions();

function saveSessions(): void {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([...activeSessions]), 'utf-8');
  } catch (err) {
    console.error('Failed to save sessions.json:', err);
  }
}

function generateToken(): string {
  const token = crypto.randomBytes(24).toString('hex');
  activeSessions.add(token);
  saveSessions();
  return token;
}

function deleteToken(token: string): void {
  activeSessions.delete(token);
  saveSessions();
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  next();
}

// Multer storage for media uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    cb(null, `${safeName}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload JPG, PNG, WebP, SVG, MP4, or WebM.`));
    }
  },
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Dedicated media streaming handler with RFC 7233 byte-range support for HTML5 video playback
  app.get('/uploads/:filename', (req: Request, res: Response) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const ext = path.extname(filename).toLowerCase();

    const mimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.ogg': 'video/ogg',
      '.ogv': 'video/ogg',
      '.m4v': 'video/mp4',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const range = req.headers.range;

    // HTTP Range request for video seeking and smooth browser playback
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).send('Requested range not satisfiable');
      }

      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });

  // Fallback static uploads
  app.use('/uploads', express.static(UPLOAD_DIR));

  // --- Public APIs ---

  // Get public portfolio data with no-cache headers to ensure freshly updated data is always served
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json({
      profile: db.profile,
      socials: db.socials,
      categories: db.categories,
      projects: db.projects,
    });
  });

  // Client contact form submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, projectType, budgetRange, message } = req.body;
    const validation = validateInquiryInput({ name, email, projectType, message });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join('. ') });
    }

    const newInquiry: ClientInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      projectType: projectType.trim(),
      budgetRange: budgetRange ? budgetRange.trim() : undefined,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    db.inquiries.unshift(newInquiry);
    saveDb(db);

    res.status(201).json({
      success: true,
      inquiryId: newInquiry.id,
      message: 'Thank you! Your message has been received. Shoyen Kaiser Asif will review your project details and get back to you shortly.',
    });
  });

  // Admin login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const hashedInput = hashPassword(password);
    if (hashedInput === db.adminPasswordHash) {
      const token = generateToken();
      return res.json({ success: true, token, name: db.profile.name });
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  });

  // Admin logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      deleteToken(token);
    }
    res.json({ success: true });
  });

  // Verify auth token
  app.get('/api/auth/verify', requireAuth, (_req: Request, res: Response) => {
    res.json({ valid: true, name: db.profile.name });
  });

  // --- Protected Admin APIs ---

  // Upload file (images/videos)
  app.post('/api/upload', requireAuth, upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  // Update profile
  app.put('/api/admin/profile', requireAuth, (req: Request, res: Response) => {
    const updated = req.body;
    if (!updated || typeof updated !== 'object') {
      return res.status(400).json({ error: 'Invalid profile data' });
    }
    db.profile = { ...db.profile, ...updated };
    saveDb(db);
    res.json({ success: true, profile: db.profile });
  });

  // Update socials
  app.put('/api/admin/socials', requireAuth, (req: Request, res: Response) => {
    const updated = req.body;
    if (!updated || typeof updated !== 'object') {
      return res.status(400).json({ error: 'Invalid socials data' });
    }
    db.socials = { ...db.socials, ...updated };
    saveDb(db);
    res.json({ success: true, socials: db.socials });
  });

  // Add project
  app.post('/api/admin/projects', requireAuth, (req: Request, res: Response) => {
    const projectData = req.body;
    const validation = validateProjectInput(projectData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join('. ') });
    }

    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: projectData.title.trim(),
      category: projectData.category.trim(),
      shortDescription: projectData.shortDescription.trim(),
      coverImage: projectData.coverImage.trim(),
      videoUrl: projectData.videoUrl ? projectData.videoUrl.trim() : undefined,
      galleryImages: Array.isArray(projectData.galleryImages) ? projectData.galleryImages : [],
      softwareUsed: Array.isArray(projectData.softwareUsed) ? projectData.softwareUsed : ['Adobe Animate CC'],
      productionNotes: projectData.productionNotes ? projectData.productionNotes.trim() : undefined,
      featured: Boolean(projectData.featured),
      order: typeof projectData.order === 'number' ? projectData.order : db.projects.length + 1,
      isDemo: Boolean(projectData.isDemo),
      createdAt: new Date().toISOString(),
    };

    db.projects.push(newProject);
    saveDb(db);
    res.status(201).json({ success: true, project: newProject });
  });

  // Edit project
  app.put('/api/admin/projects/:id', requireAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const validation = validateProjectInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join('. ') });
    }

    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      id, // protect id
    };
    saveDb(db);
    res.json({ success: true, project: db.projects[index] });
  });

  // Delete project
  app.delete('/api/admin/projects/:id', requireAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== id);
    if (db.projects.length === initialLen) {
      return res.status(404).json({ error: 'Project not found' });
    }
    saveDb(db);
    res.json({ success: true, message: 'Project deleted' });
  });

  // Reorder projects
  app.post('/api/admin/projects/reorder', requireAuth, (req: Request, res: Response) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    const map = new Map(db.projects.map((p) => [p.id, p]));
    const reordered: Project[] = [];

    orderedIds.forEach((id, idx) => {
      const proj = map.get(id);
      if (proj) {
        proj.order = idx + 1;
        reordered.push(proj);
        map.delete(id);
      }
    });

    // Add any remaining
    map.forEach((proj) => {
      proj.order = reordered.length + 1;
      reordered.push(proj);
    });

    db.projects = reordered;
    saveDb(db);
    res.json({ success: true, projects: db.projects });
  });

  // Manage categories
  app.post('/api/admin/categories', requireAuth, (req: Request, res: Response) => {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Category name and slug are required' });
    }
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description ? description.trim() : '',
    };
    db.categories.push(newCategory);
    saveDb(db);
    res.status(201).json({ success: true, category: newCategory });
  });

  app.delete('/api/admin/categories/:id', requireAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    db.categories = db.categories.filter((c) => c.id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // View inquiries
  app.get('/api/admin/messages', requireAuth, (_req: Request, res: Response) => {
    res.json({ success: true, messages: db.inquiries });
  });

  // Update inquiry status
  app.put('/api/admin/messages/:id', requireAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const msg = db.inquiries.find((m) => m.id === id);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }
    if (['unread', 'read', 'replied'].includes(status)) {
      msg.status = status;
      saveDb(db);
    }
    res.json({ success: true, message: msg });
  });

  // Delete inquiry
  app.delete('/api/admin/messages/:id', requireAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    db.inquiries = db.inquiries.filter((m) => m.id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // Clear demo projects
  app.post('/api/admin/clear-demo', requireAuth, (_req: Request, res: Response) => {
    db.projects = db.projects.filter((p) => !p.isDemo);
    saveDb(db);
    res.json({ success: true, remainingProjects: db.projects.length });
  });

  // Reset demo content
  app.post('/api/admin/reset-demo', requireAuth, (_req: Request, res: Response) => {
    db = {
      ...DEFAULT_PORTFOLIO_DATA,
      inquiries: db.inquiries,
      adminPasswordHash: db.adminPasswordHash,
    };
    saveDb(db);
    res.json({ success: true, projects: db.projects });
  });

  // Change password
  app.put('/api/admin/security', requireAuth, (req: Request, res: Response) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    db.adminPasswordHash = hashPassword(newPassword);
    saveDb(db);
    res.json({ success: true, message: 'Password updated successfully' });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
