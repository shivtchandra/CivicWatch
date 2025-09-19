require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';

function createToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

app.get('/', (req, res) => res.json({ ok: true }));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = createToken(user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken(user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Authorization header missing' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// /api/me
app.get('/api/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, email: true, name: true, createdAt: true } });
  res.json({ user });
});

// Create report
app.post('/api/reports', requireAuth, async (req, res) => {
  try {
    const { title, description, lat, lng, category } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'title and description required' });
    const created = await prisma.report.create({
      data: {
        title,
        description,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        category: category || 'general',
        createdBy: req.userId
      }
    });
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE /api/safety_alerts/:id
app.delete("/api/safety_alerts/:id", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;
  
      const existing = await prisma.safetyAlert.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: "Not found" });
  
      // Only owner (or admin) can delete
      if (existing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      await prisma.safetyAlert.delete({ where: { id } });
      return res.json({ success: true });
    } catch (err) {
      console.error("DELETE /api/safety_alerts/:id error", err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // DELETE /api/civic_reports/:id
  app.delete("/api/civic_reports/:id", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;
  
      const existing = await prisma.civicReport.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: "Not found" });
  
      if (existing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      await prisma.civicReport.delete({ where: { id } });
      return res.json({ success: true });
    } catch (err) {
      console.error("DELETE /api/civic_reports/:id error", err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  

// List reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Single report
app.get('/api/reports/:id', async (req, res) => {
  const id = Number(req.params.id);
  const report = await prisma.report.findUnique({ where: { id }, include: { user: { select: { id: true, name: true } } } });
  if (!report) return res.status(404).json({ error: 'Not found' });
  res.json(report);
});

// Update status
app.patch('/api/reports/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  try {
    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });
    if (existing.createdBy !== req.userId) return res.status(403).json({ error: 'Not allowed' });

    const updated = await prisma.report.update({ where: { id }, data: { status } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
