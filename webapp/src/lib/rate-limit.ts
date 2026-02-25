import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

// Simple in-memory rate limiter (for serverless, use Redis/Upstash in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  });
}, 60000); // Clean every minute

export function rateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(
    request: NextRequest,
    identifier?: string
  ): { success: boolean; limit: number; remaining: number; reset: number } {
    const ip = identifier || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      // New window
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.interval,
      });
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: now + config.interval,
      };
    }

    if (record.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    record.count++;
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - record.count,
      reset: record.resetTime,
    };
  };
}

// Pre-configured rate limiters for different endpoints
export const subscribeRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
});

export const webhookRateLimit = rateLimit({
  interval: 60 * 1000,
  maxRequests: 100, // Higher limit for webhooks
});

export const publicApiRateLimit = rateLimit({
  interval: 60 * 1000,
  maxRequests: 30,
});

export function rateLimitResponse(reset: number): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
