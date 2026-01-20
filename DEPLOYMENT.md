# Certificate Verification System - Deployment Guide

## 🚀 Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/certificate-verification)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

## 🔧 Environment Variables

Add these in your Vercel project settings:

### Required Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
```

### Optional Variables

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=/api
```

## 📝 Setup Steps

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select "Next.js" framework preset
5. Configure environment variables
6. Deploy!

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Type | Value |
|----------|------|-------|
| `MONGODB_URI` | Secret | Your MongoDB connection string |
| `JWT_SECRET` | Secret | Random 32+ character string |
| `ADMIN_USERNAME` | Secret | Your admin username |
| `ADMIN_PASSWORD` | Secret | Your admin password |

### 3. Domain Configuration

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

## 🗄️ Database Setup

### MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Create database user
4. Whitelist Vercel IPs or use `0.0.0.0/0` for all IPs
5. Get connection string
6. Add to Vercel environment variables

### Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE?retryWrites=true&w=majority
```

## 📦 File Storage

**Important:** Vercel has read-only filesystem. Certificate files uploaded through the admin panel are stored temporarily during the deployment session.

### Recommended Solutions:

1. **Vercel Blob Storage** (Recommended)
   - Add `@vercel/blob` package
   - Update upload API to use Vercel Blob

2. **AWS S3**
   - Configure S3 bucket
   - Update API routes to use S3 SDK

3. **Cloudinary**
   - Use Cloudinary for image hosting
   - Update upload handlers

## 🔒 Security Checklist

- ✅ Change default admin credentials
- ✅ Use strong JWT secret (32+ characters)
- ✅ Enable MongoDB authentication
- ✅ Whitelist specific IPs in MongoDB
- ✅ Use environment variables (never commit secrets)
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Configure CORS properly

## 🧪 Testing Deployment

After deployment:

1. Visit your domain
2. Test certificate verification
3. Login to admin panel
4. Create a test certificate
5. Verify the test certificate

## 📊 Monitoring

### Vercel Analytics

Enable in Dashboard → Analytics

### Error Tracking

View logs in Dashboard → Deployments → [Your Deployment] → Logs

## 🔄 CI/CD

Vercel automatically:
- Builds on every push
- Creates preview deployments for PRs
- Deploys to production on main branch

## 🛠️ Troubleshooting

### Build Errors

```bash
# Test build locally
npm run build

# Check logs
vercel logs [deployment-url]
```

### Database Connection Issues

- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Environment Variables Not Working

- Redeploy after adding variables
- Check variable names match exactly
- Verify no extra spaces in values

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Next.js Docs: https://nextjs.org/docs

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
