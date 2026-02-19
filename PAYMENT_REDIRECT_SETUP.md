# Payment Redirect Setup Guide

## Current Behavior
Your website redirects to: `https://dazzzle.org/user/premium/success`

**What happens:**
1. User completes payment
2. Browser navigates to HTTPS success page
3. User sees success page
4. **User must manually tap "Done"** to close browser
5. App checks account status automatically

This works, but requires an extra tap from the user.

## Optimal Setup (Recommended)

Change your website redirect to use the app's deep link scheme:

### Backend Change:
```php
// ❌ Current (HTTPS redirect)
header("Location: https://dazzzle.org/user/premium/success");

// ✅ Optimal (Deep link redirect)
header("Location: dazzzle://payment/success");
```

### Or in JavaScript:
```javascript
// ❌ Current
window.location.href = 'https://dazzzle.org/user/premium/success';

// ✅ Optimal
window.location.href = 'dazzzle://payment/success';
```

**What this gives you:**
1. User completes payment
2. Browser **automatically closes** (no manual tap needed)
3. App instantly verifies payment
4. Features unlock immediately

## URLs to Use

| Scenario | Deep Link URL |
|----------|---------------|
| **Payment Success** | `dazzzle://payment/success` |
| **Payment Cancelled** | `dazzzle://payment/cancel` |
| **Payment Failed** | `dazzzle://payment/failed` |

## Implementation Status

✅ **App is ready** - Both HTTPS and deep link redirects are supported
⏳ **Backend needs update** - Change redirect URLs from HTTPS to deep links

## Testing

### Test Current Setup (HTTPS):
1. Complete payment on website
2. See success page at `https://dazzzle.org/user/premium/success`
3. Tap "Done" to close browser
4. App should check status and unlock features

### Test Optimal Setup (Deep Link):
1. Complete payment on website
2. Browser **auto-closes** immediately
3. App verifies and unlocks features instantly

## Notes

- The app works with both approaches
- Deep link redirect provides better UX
- This is still 100% Apple-compliant (Reader App exception)
- No impact on your Paystack integration
