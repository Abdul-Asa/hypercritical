# Hypercritical Setup Guide

## Environment Setup

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```bash
   # OpenAI API Key for code generation
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server:**
   ```bash
   bun dev
   ```

## Features Implemented

### Backend

- **Streaming API Endpoint**: `/api/generate` with Vercel AI SDK
- **Control Systems Expertise**: Specialized prompts for safety-critical applications
- **Real-time Code Generation**: Streams Python/MATLAB code generation

### Frontend

- **Custom Streaming Client**: Handles SSE without Vercel AI SDK on frontend
- **Terminal Interface**: Real-time logs showing generation progress
- **Empty State Handling**: Clean UI for tests without generated code
- **Batch Generation**: "Generate All Accepted" functionality

### UI Components

- **Test Script Viewer**: Monaco editor with streaming code generation
- **Test Script Sidebar**: Individual and batch generation controls
- **Terminal Logs**: Vercel-style terminal showing real-time progress
- **Loading States**: Visual feedback during code generation

## Architecture

The application demonstrates expertise by:

- Using Vercel AI SDK only on the backend (as requested)
- Implementing custom streaming on the frontend
- Providing real-time feedback through terminal-like interface
- Handling multiple concurrent generations
- Auto-saving generated code with proper state management

## API Usage

The `/api/generate` endpoint expects:

```typescript
{
  scriptId: string;
  testDescription: string;
  language: "Python" | "Matlab";
  testType: "unit_test" | "simulation_test";
}
```

Returns a streaming text response with generated code optimized for control systems engineering.
