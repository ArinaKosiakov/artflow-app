# Esempio Struttura Backend

## Struttura Cartelle Consigliata

```
backend/
├── src/
│   ├── index.ts                 # Entry point del server
│   ├── app.ts                   # Configurazione Express
│   ├── config/
│   │   ├── database.ts          # Configurazione Prisma
│   │   └── env.ts               # Validazione variabili d'ambiente
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── errorHandler.ts      # Error handling middleware
│   │   └── validate.ts          # Input validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── projects.routes.ts
│   │   ├── contentIdeas.routes.ts
│   │   ├── prompts.routes.ts
│   │   ├── notes.routes.ts
│   │   ├── chat.routes.ts
│   │   └── settings.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── projects.controller.ts
│   │   ├── contentIdeas.controller.ts
│   │   ├── prompts.controller.ts
│   │   ├── notes.controller.ts
│   │   ├── chat.controller.ts
│   │   └── settings.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── projects.service.ts
│   │   └── ...
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── bcrypt.ts            # Password hashing
│   │   └── validators.ts        # Zod schemas
│   └── types/
│       └── index.ts             # TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Esempio File: src/index.ts

```typescript
import app from './app';
import { config } from './config/env';

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

## Esempio File: src/app.ts

```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import projectsRoutes from './routes/projects.routes';
// ... altre routes

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectsRoutes);
// ... altre routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
```

## Esempio File: src/routes/projects.routes.ts

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  toggleStep
} from '../controllers/projects.controller';

const router = Router();

// Tutte le routes richiedono autenticazione
router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.put('/:id/steps/:stepId', toggleStep);

export default router;
```

## Esempio File: src/controllers/projects.controller.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { ProjectService } from '../services/projects.service';

const projectService = new ProjectService();

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; // From auth middleware
    const projects = await projectService.getUserProjects(userId);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const project = await projectService.getProjectById(id, userId);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const projectData = req.body;
    const project = await projectService.createProject(userId, projectData);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const projectData = req.body;
    const project = await projectService.updateProject(id, userId, projectData);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    await projectService.deleteProject(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const toggleStep = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, stepId } = req.params;
    const userId = req.user!.id;
    const step = await projectService.toggleStep(id, stepId, userId);
    res.json(step);
  } catch (error) {
    next(error);
  }
};
```

## Esempio File: src/services/projects.service.ts

```typescript
import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class ProjectService {
  async getUserProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      include: { steps: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' }
    });
  }

  async getProjectById(id: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: { steps: { orderBy: { order: 'asc' } } }
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async createProject(userId: string, data: any) {
    const { steps, ...projectData } = data;
    
    return prisma.project.create({
      data: {
        ...projectData,
        userId,
        steps: {
          create: steps?.map((step: any, index: number) => ({
            text: step.text,
            done: step.done || false,
            order: index
          })) || []
        }
      },
      include: { steps: true }
    });
  }

  async updateProject(id: string, userId: string, data: any) {
    // Verifica che il progetto appartenga all'utente
    await this.getProjectById(id, userId);

    const { steps, ...projectData } = data;

    // Se ci sono steps, aggiornali
    if (steps) {
      await prisma.projectStep.deleteMany({ where: { projectId: id } });
      
      await prisma.projectStep.createMany({
        data: steps.map((step: any, index: number) => ({
          projectId: id,
          text: step.text,
          done: step.done || false,
          order: index
        }))
      });
    }

    return prisma.project.update({
      where: { id },
      data: projectData,
      include: { steps: { orderBy: { order: 'asc' } } }
    });
  }

  async deleteProject(id: string, userId: string) {
    await this.getProjectById(id, userId);
    await prisma.project.delete({ where: { id } });
  }

  async toggleStep(projectId: string, stepId: string, userId: string) {
    // Verifica che il progetto appartenga all'utente
    await this.getProjectById(projectId, userId);

    const step = await prisma.projectStep.findFirst({
      where: { id: stepId, projectId }
    });

    if (!step) {
      throw new NotFoundError('Step not found');
    }

    return prisma.projectStep.update({
      where: { id: stepId },
      data: { done: !step.done }
    });
  }
}
```

## Esempio File: src/middleware/auth.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Esempio File: src/middleware/errorHandler.ts

```typescript
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
};
```

## Esempio File: .env.example

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/artflow?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL="http://localhost:3000"
```

## Esempio File: src/routes/profile.routes.ts

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import {
  getProfile,
  updateName,
  updateEmail,
  updatePassword,
  uploadProfilePicture,
  removeProfilePicture
} from '../controllers/profile.controller';

const router = Router();
const upload = multer({ dest: 'uploads/profile-pictures/' });

// Tutte le routes richiedono autenticazione
router.use(authenticate);

router.get('/', getProfile);
router.put('/name', updateName);
router.put('/email', updateEmail);
router.put('/password', updatePassword);
router.post('/picture', upload.single('picture'), uploadProfilePicture);
router.delete('/picture', removeProfilePicture);

export default router;
```

## Esempio File: src/controllers/profile.controller.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { hashPassword, comparePassword } from '../utils/bcrypt';

const profileService = new ProfileService();

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const profile = await profileService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name } = req.body;
    const updated = await profileService.updateName(userId, name);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { email, password } = req.body;
    
    // Verify current password
    const user = await profileService.getUserById(userId);
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const updated = await profileService.updateEmail(userId, email);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const user = await profileService.getUserById(userId);
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    await profileService.updatePassword(userId, hashedPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    // For now, save file path
    const pictureUrl = `/uploads/profile-pictures/${file.filename}`;
    const updated = await profileService.updateProfilePicture(userId, pictureUrl);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const removeProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await profileService.removeProfilePicture(userId);
    res.json({ message: 'Profile picture removed successfully' });
  } catch (error) {
    next(error);
  }
};
```

## Esempio File: src/services/profile.service.ts

```typescript
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class ProfileService {
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async updateName(userId: string, name: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true
      }
    });
  }

  async updateEmail(userId: string, email: string) {
    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email already in use');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { email },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true
      }
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  async updateProfilePicture(userId: string, pictureUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { profilePicture: pictureUrl },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true
      }
    });
  }

  async removeProfilePicture(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { profilePicture: null },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true
      }
    });
  }
}
```

## Esempio File: package.json (backend)

```json
{
  "name": "artflow-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.0",
    "@types/express": "^4.17.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/multer": "^1.4.11",
    "prisma": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

