# Deployment Instructions

## Deploy Frontend ke Vercel

### Via Vercel Dashboard:
1. Buka https://vercel.com/new
2. Import repository: sharonnakishaa/fe-kelompok4-paw
3. **PENTING**: Set Root Directory ke `frontend`
4. Framework Preset: Next.js (auto-detected)
5. Build Command: `npm run build`
6. Output Directory: `.next`
7. Install Command: `npm install`

### Environment Variables (Production):
```
NEXT_PUBLIC_BACKEND_URL=https://fe-kelompok4-paw.vercel.app
```

### Via CLI:
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

## Troubleshooting

Jika masih error setelah deploy:
1. Check Vercel Logs: https://vercel.com/[project]/deployments
2. Pastikan Root Directory = `frontend`
3. Pastikan environment variable sudah diset
4. Redeploy setelah setting environment variables

## URLs
- Backend: https://fe-kelompok4-paw.vercel.app
- Frontend: https://[your-frontend-project].vercel.app
