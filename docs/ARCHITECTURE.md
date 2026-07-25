# Cineverse OTT Platform — System Architecture & Data Flow

```
                      Internet
                         │
                 Cloudflare CDN + WAF
                         │
                      NGINX
                         │
           ┌─────────────┴─────────────┐
           │                           │
      User App (Next.js)         Admin App (Next.js)
           │                           │
           └─────────────┬─────────────┘
                         │
               Backend API (Express)
                         │
       ┌─────────┬──────────┬───────────┐
       │         │          │           │
  PostgreSQL   Redis     BullMQ     Object Storage
       │         │          │           │
       │         │      FFmpeg Workers  │
       │         │          │           │
       └─────────┴──────────┴───────────┘
                         │
                  HLS Streaming + CDN
                         │
                  Users Worldwide
```

## System Components
1. **API Engine & Business Logic**: Handles DRM, Subscriptions, AI Recommendations, Search, and HLS Manifest generation.
2. **Streaming & Transcoding Engine**: FFmpeg worker queues converting raw MP4 uploads into multi-bitrate HLS adaptive streams (`4K`, `1080p`, `720p`, `480p`).
3. **AI & Recommendation Subsystem**: Integrates Google Gemini 2.5 Flash for conversational movie concierge, search query intent analysis, and personalized home feed sorting.
4. **Subscription & Payment Processing Ledger**: Manages multi-currency recurring billing, invoices, gateway webhooks, and coupons.
