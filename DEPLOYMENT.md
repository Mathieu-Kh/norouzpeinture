# 🚀 Deployment Guide
## راهنمای استقرار سایت - Norouz Peinture

این راهنما مراحل کامل استقرار سایت را توضیح می‌دهد.

## 📋 پیش‌نیازها

### فایل‌های مورد نیاز
- ✅ تمام فایل‌های پروژه آماده هستند
- ✅ تصاویر اضافه شده‌اند
- ✅ اطلاعات تماس چک شده
- ✅ ترجمه‌ها کامل شده

### حساب‌های مورد نیاز
- حساب میزبانی وب (Hosting)
- حساب Google (برای Search Console)
- حساب Google My Business (اختیاری)

## 🌐 گزینه‌های استقرار

### 1. GitHub Pages (رایگان)
**بهترین گزینه برای شروع**

#### مراحل:
1. **حساب GitHub بسازید** (github.com)
2. **Repository جدید بسازید**:
   - نام: `norouz-peinture-website`
   - Public انتخاب کنید
3. **فایل‌ها را آپلود کنید**:
   ```
   کل پوشه norouz-peinture-new را آپلود کنید
   ```
4. **Settings > Pages**:
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
5. **URL نهایی**: `https://yourusername.github.io/norouz-peinture-website`

#### مزایا:
- رایگان
- SSL خودکار
- CDN جهانی
- آسان برای به‌روزرسانی

#### معایب:
- محدودیت ترافیک
- بدون backend

### 2. Netlify (توصیه می‌شود)
**بهترین گزینه برای وب‌سایت حرفه‌ای**

#### مراحل:
1. **حساب Netlify بسازید** (netlify.com)
2. **Drag & Drop**:
   - پوشه `norouz-peinture-new` را بکشید
   - منتظر deployment بمانید
3. **Custom Domain** (اختیاری):
   - Settings > Domain management
   - Add custom domain: `norouzpeinture.fr`
4. **SSL**: به‌صورت خودکار فعال می‌شود

#### مزایا:
- بسیار سریع
- Form handling خودکار
- Analytics داخلی
- Preview برای تغییرات

#### هزینه:
- Free tier: 100GB bandwidth
- Pro: $19/month

### 3. میزبانی سنتی (cPanel)
**اگر هاست موجود دارید**

#### مراحل:
1. **FTP یا File Manager**:
   - به cPanel بروید
   - File Manager را باز کنید
2. **آپلود فایل‌ها**:
   ```
   محتوای norouz-peinture-new را در public_html آپلود کنید
   ```
3. **permissions چک کنید**:
   - فولدرها: 755
   - فایل‌ها: 644

#### نکات مهم:
- `.htaccess` حتماً آپلود شود
- SSL certificate فعال کنید
- از www norouzpeinture.fr استفاده کنید

## 🔧 تنظیمات پس از استقرار

### 1. Google Search Console
1. **ثبت‌نام** (search.google.com/search-console)
2. **Property اضافه کنید**:
   - URL: `https://norouzpeinture.fr`
   - Verification method: HTML tag
3. **Sitemap ارسال کنید**:
   - Sitemaps > Add new sitemap
   - Sitemap: `sitemap.xml`
4. **URLs را Inspect کنید**:
   - هر URL را تست کنید
   - مشکلات را برطرف کنید

### 2. Google Analytics
1. **حساب GA4 بسازید** (analytics.google.com)
2. **Property اضافه کنید**:
   - Website URL: `https://norouzpeinture.fr`
3. **Tracking Code** را در `<head>` اضافه کنید:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 3. Google My Business
1. **Profile چک کنید**:
   - URL سایت جدید را اضافه کنید
   - تصاویر جدید آپلود کنید
   - ساعات کاری به‌روز کنید

### 4. Domain Configuration
اگر دامنه سفارشی دارید:

#### DNS Settings:
```
A Record: @ → SERVER_IP
CNAME: www → norouzpeinture.fr
```

#### .htaccess redirects:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
```

## 📱 تست نهایی

### چک‌لیست تست:
- [ ] صفحه اصلی لود می‌شود
- [ ] صفحه FAQ کار می‌کند
- [ ] صفحه Articles کار می‌کند
- [ ] زبان‌ها سویچ می‌شوند
- [ ] فرم تماس کار می‌کند
- [ ] موبایل responsive است
- [ ] تصاویر نمایش داده می‌شوند
- [ ] لینک‌ها کار می‌کنند

### ابزارهای تست:
- **Google PageSpeed**: pagespeed.web.dev
- **GTmetrix**: gtmetrix.com
- **Mobile-Friendly Test**: search.google.com/test/mobile-friendly

## 🔍 بهینه‌سازی SEO پس از استقرار

### هفته اول:
1. **Sitemap submit کنید** در Google Search Console
2. **URLs را crawl کنید**
3. **Core Web Vitals چک کنید**
4. **Mobile usability test**

### ماه اول:
1. **Rankings چک کنید** برای "peintre Angers"
2. **Analytics data بررسی کنید**
3. **Local search visibility چک کنید**
4. **Competitor analysis**

### بهینه‌سازی مداوم:
- محتوای جدید اضافه کنید
- تصاویر portfolio به‌روز کنید
- FAQ را گسترش دهید
- Customer reviews جمع‌آوری کنید

## 🐛 عیب‌یابی مشکلات رایج

### مشکل: سایت لود نمی‌شود
**علل احتمالی:**
- DNS propagation (24-48 ساعت)
- فایل index.html وجود ندارد
- permissions نادرست

**راه‌حل:**
```bash
# File permissions چک کنید
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

### مشکل: تصاویر نمایش داده نمی‌شوند
**علل احتمالی:**
- مسیر فایل اشتباه
- فایل‌ها آپلود نشده‌اند
- نام فایل‌ها اشتباه

**راه‌حل:**
```bash
# ساختار فایل‌ها چک کنید
ls -la images/
ls -la assets/
```

### مشکل: SSL certificate مشکل دارد
**علل احتمالی:**
- Mixed content (HTTP در صفحه HTTPS)
- Certificate expired

**راه‌حل:**
```html
<!-- همه لینک‌ها HTTPS باشند -->
<img src="https://norouzpeinture.fr/images/hero-bg.jpg">
```

### مشکل: SEO بررسی نمی‌شود
**علل احتمالی:**
- Meta tags ناموجود
- Sitemap اشتباه
- Robots.txt مسدود کرده

**راه‌حل:**
- Search Console errors چک کنید
- Rich Results Test استفاده کنید
- URL Inspection tool

## 📊 مانیتورینگ و نگهداری

### ابزارهای پیشنهادی:
- **Google Search Console**: SEO monitoring
- **Google Analytics**: Traffic analysis  
- **PageSpeed Insights**: Performance tracking
- **Uptime monitoring**: UptimeRobot

### نگهداری منظم:
- **هفتگی**: Broken links چک کنید
- **ماهانه**: Content freshness بررسی کنید
- **فصلی**: SEO performance تحلیل کنید
- **سالانه**: Complete website audit

## 💰 هزینه‌های مورد انتظار

### رایگان:
- GitHub Pages: $0
- Netlify Free: $0 (با محدودیت)

### پرداختی:
- دامنه سفارشی: €10-15/year
- Netlify Pro: $19/month
- میزبانی سنتی: €5-20/month

## 🎯 نتایج مورد انتظار

### ۳ ماه اول:
- 30-50% افزایش organic traffic
- بهتر شدن local search rankings
- افزایش contact form submissions

### ۶ ماه اول:
- Top 3 rankings برای "peintre Angers"
- 2x increase in qualified leads
- Improved brand reputation

---

**🎉 تبریک! سایت شما آماده است**

برای حمایت بیشتر:
- **Email**: mathieu@norouzpeinture.fr
- **Phone**: +33 6 68 66 43 91

*راهنمای به‌روزرسانی: November 2024*