# TenRent Frontend

Lease takeover marketplace frontend — Built with Next.js 14+ (App Router).

## Stack

- **Next.js 14+** with App Router
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

## Quick Start with Docker (Recommended)

The easiest way to run the frontend service is using Docker Compose:

```bash
docker compose -f docker-compose.yml up --build
```

This will:
- Build the Next.js application container
- Start an Nginx reverse proxy
- Expose the application on http://localhost:3000
- Connect to the backend API network

**Access Points:**
- Frontend: http://localhost:3000
- Nginx Proxy: http://localhost:80

**Note:** Make sure the backend service is running first, as the frontend connects to the backend API network.

## Environment Variables

Create a `.env` file in the project root with the following variables:

### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:8000    # Backend API URL
```

**Important Notes:**
- `NEXT_PUBLIC_*` prefix makes the variable accessible in the browser
- Update `NEXT_PUBLIC_API_URL` to point to your backend API endpoint
- For production, use your production backend URL (e.g., `https://api.tenrent.com`)
- For Docker deployments, you may need to adjust the URL based on your network configuration

### Additional Environment Variables (Optional)

If you need to add more configuration options in the future:

```env
# Example: Feature Flags
NEXT_PUBLIC_FEATURE_CHAT=true

# Example: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Example: Environment
NODE_ENV=development              # or production
```

## Local Development Setup (Without Docker)

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Create your `.env` file (see Environment Variables section above).

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Build for Production

```bash
npm run build
npm run start
```

## Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Font Optimization

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a font family for Vercel.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
