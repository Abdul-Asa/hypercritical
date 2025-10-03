# Hyperpilot Dashboard Demo

A mini demo replicating part of the Hyperpilot dashboard for AI-driven control systems test generation. This application demonstrates real-time streaming of AI-generated Python/MATLAB test scripts using OpenAI, Redis, and BullMQ.

## 🚀 Features

- **Interactive Test Management**: Browse unit tests and simulation tests with Accept/Delete/Generate actions
- **Real-time Code Generation**: Stream AI-generated test scripts live to Monaco editor
- **Scalable Job Queue**: Redis + BullMQ for handling multiple concurrent test generations
- **Modern UI**: Built with Next.js 14, shadcn/ui, and Tailwind CSS
- **Multi-language Support**: Generate both Python and MATLAB test scripts

## 🏗️ Architecture

```
Frontend (Next.js) → API Routes → Redis Queue → Worker → OpenAI → Redis Pub/Sub → SSE → Frontend
```

### Components

- **Frontend**: Next.js 14 + shadcn/ui + Monaco editor
- **Backend**: Next.js API routes + Redis
- **Worker**: Node service consuming BullMQ jobs
- **Queue**: Redis + BullMQ for job management
- **Streaming**: Redis Pub/Sub → SSE for real-time updates
- **AI**: OpenAI GPT-4 for generating test scripts

## 📁 Project Structure

```
/
├── app/
│   ├── api/run-test/route.ts    # API endpoint for job enqueuing + SSE streaming
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── TestList.tsx             # Left panel with test actions
│   └── CodeEditor.tsx           # Right panel with Monaco editor
├── lib/
│   ├── data.ts                  # Hardcoded test data
│   ├── redis.ts                 # Redis connection utilities
│   ├── queue.ts                 # BullMQ setup
│   └── utils.ts                 # Utility functions
├── worker/
│   └── index.ts                 # BullMQ worker for OpenAI streaming
└── env.example                  # Environment variables template
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- Redis (local or Upstash)
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repository>
cd hyperpilot-demo
npm install
```

### 2. Environment Configuration

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Update the environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Redis

**Local Redis:**

```bash
redis-server
```

**Or use Upstash Redis:**

- Sign up at [upstash.com](https://upstash.com)
- Create a Redis database
- Update `REDIS_URL` with your Upstash connection string

### 4. Run the Application

**Development (with worker):**

```bash
npm run dev:all
```

**Or run separately:**

```bash
# Terminal 1: Frontend + API
npm run dev

# Terminal 2: Worker
npm run worker:dev
```

### 5. Open the Dashboard

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Browse Tests**: View unit tests and simulation tests in the left panel
2. **Accept Tests**: Click ✅ to mark tests as accepted
3. **Generate Individual**: Click ▶ to generate code for a specific test
4. **Generate Batch**: Click "Generate Accepted" to process all accepted tests
5. **View Code**: Generated code streams live in the Monaco editor
6. **Edit & Save**: Modify generated code and save changes
7. **Download**: Export generated test scripts

## 🚀 Deployment

### Frontend + API (Vercel)

1. Deploy to Vercel:

```bash
vercel --prod
```

2. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `REDIS_URL`

### Worker (Railway/Fly/Render)

**Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy worker
railway login
railway new
railway add
railway deploy
```

**Fly.io:**

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Create Dockerfile for worker
echo 'FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "run", "worker"]' > Dockerfile

# Deploy
fly launch
fly deploy
```

### Redis (Upstash)

1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Update `REDIS_URL` in all deployments

## 🔧 Configuration

### Worker Concurrency

Adjust worker concurrency in `lib/queue.ts`:

```typescript
export const createTestGenerationWorker = (processor) => {
  return new Worker("test-generation", processor, {
    connection: redis,
    concurrency: 5, // Adjust based on your needs
  });
};
```

### OpenAI Model

Change the model in `worker/index.ts`:

```typescript
const stream = await openai.chat.completions.create({
  model: "gpt-4", // or 'gpt-3.5-turbo' for faster/cheaper generation
  // ...
});
```

## 🧪 Test Data

The demo includes hardcoded test data in `lib/data.ts`:

- **Unit Tests**: PID controller, sensor filtering, motor control, Kalman filter
- **Simulation Tests**: Quadrotor dynamics, autonomous vehicle, robotic arm, thermal control

## 🎨 UI Components

Built with modern, responsive design:

- **Test List**: Organized by type (Unit/Simulation) with status badges
- **Code Editor**: Monaco editor with syntax highlighting
- **Real-time Updates**: Live streaming indicators and progress
- **Actions**: Accept, delete, generate, save, download functionality

## 🐛 Troubleshooting

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Worker Not Processing Jobs

```bash
# Check worker logs
npm run worker:dev
# Verify Redis connection and OpenAI API key
```

### SSE Connection Problems

- Ensure Redis Pub/Sub is working
- Check browser network tab for SSE events
- Verify API route is accessible

## 📝 License

MIT License - feel free to use this demo for your own projects!

## 🤝 Contributing

This is a demo project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for the Hypercritical CTO demo**
