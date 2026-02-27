/**
 * Facebook Conversions API (CAPI) — Server-side event sender
 *
 * Sends conversion events directly to Meta's servers.
 * All PII is SHA-256 hashed before transmission, per Meta's requirements.
 *
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import { createHash, randomUUID } from "crypto";

// ── Config ──────────────────────────────────────────────────────────────────
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN ?? "";
const FB_DATASET_ID = process.env.FB_DATASET_ID ?? "888501860839784";
const FB_API_VERSION = process.env.FB_API_VERSION ?? "v22.0";
const FB_TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE ?? ""; // optional, for testing
const FB_PAGE_ID = process.env.FB_PAGE_ID ?? "108128768049688";

const CAPI_ENDPOINT = `https://graph.facebook.com/${FB_API_VERSION}/${FB_DATASET_ID}/events`;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** SHA-256 hash a string (lowercase + trimmed first, per Meta spec). */
function hashSHA256(value: string): string {
    return createHash("sha256")
        .update(value.trim().toLowerCase())
        .digest("hex");
}

/** Conditionally hash a value — returns undefined if input is falsy. */
function hashIfPresent(value?: string | null): string | undefined {
    if (!value) return undefined;
    return hashSHA256(value);
}

/**
 * Normalise a Bangladeshi phone number to E.164 format (880XXXXXXXXXX)
 * and then hash it.
 */
function hashPhone(phone?: string | null): string | undefined {
    if (!phone) return undefined;
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("01") && cleaned.length === 11) {
        cleaned = "880" + cleaned;
    } else if (!cleaned.startsWith("880")) {
        cleaned = "880" + cleaned;
    }
    return hashSHA256(cleaned);
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface FBCustomerData {
    email?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    city?: string | null;
    zipCode?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    /** Page-scoped user ID, if available */
    pageId?: string | null;
    /** Click-to-WhatsApp ID, if available */
    ctwaClid?: string | null;
}

export interface FBCustomData {
    currency?: string;
    value?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number }>;
    content_type?: string;
    content_name?: string;
    order_id?: string;
    delivery_category?: string;
}

export interface FBEventPayload {
    eventName: string;
    customerData: FBCustomerData;
    customData?: FBCustomData;
    /** Optional — pass one for pixel deduplication. Auto-generated if omitted. */
    eventId?: string;
    /** Source URL, e.g. the page the user was on */
    sourceUrl?: string;
}

// ── Core: Send Events ───────────────────────────────────────────────────────

/**
 * Send one or more events to the Facebook Conversions API.
 *
 * This function is designed to be **fire-and-forget** — it logs errors
 * but never throws, so it can't break the order flow.
 */
export async function sendFacebookEvent(payload: FBEventPayload): Promise<{ success: boolean; eventId: string }> {
    const eventId = payload.eventId ?? randomUUID();

    if (!FB_ACCESS_TOKEN) {
        console.warn("[FB CAPI] No FB_ACCESS_TOKEN set — skipping event:", payload.eventName);
        return { success: false, eventId };
    }

    const eventTime = Math.floor(Date.now() / 1000);

    // Build user_data with hashed PII
    const userData: Record<string, unknown> = {};
    const em = hashIfPresent(payload.customerData.email);
    if (em) userData.em = [em];
    const ph = hashPhone(payload.customerData.phone);
    if (ph) userData.ph = [ph];
    const fn = hashIfPresent(payload.customerData.firstName);
    if (fn) userData.fn = fn;
    const ln = hashIfPresent(payload.customerData.lastName);
    if (ln) userData.ln = ln;
    const ct = hashIfPresent(payload.customerData.city);
    if (ct) userData.ct = ct;
    const zp = hashIfPresent(payload.customerData.zipCode);
    if (zp) userData.zp = zp;
    const ge = hashIfPresent(payload.customerData.gender);
    if (ge) userData.ge = ge;
    const db = hashIfPresent(payload.customerData.dateOfBirth);
    if (db) userData.db = db;
    // Non-hashed identifiers
    if (payload.customerData.pageId) {
        userData.page_id = payload.customerData.pageId;
    }
    if (payload.customerData.ctwaClid) {
        userData.ctwa_clid = payload.customerData.ctwaClid;
    }

    // Build event object
    const event: Record<string, unknown> = {
        event_name: payload.eventName,
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        user_data: userData,
        original_event_data: {
            event_name: payload.eventName,
            event_time: eventTime,
        },
    };

    // Action source metadata
    event.messaging_channel = "whatsapp";
    event.page_id = FB_PAGE_ID;

    if (payload.sourceUrl) {
        event.event_source_url = payload.sourceUrl;
    }

    // Custom data (Purchase event specifics)
    if (payload.customData) {
        const cd: Record<string, unknown> = {};
        if (payload.customData.currency) cd.currency = payload.customData.currency;
        if (payload.customData.value) cd.value = payload.customData.value;
        if (payload.customData.content_ids) cd.content_ids = payload.customData.content_ids;
        if (payload.customData.contents) cd.contents = payload.customData.contents;
        if (payload.customData.content_type) cd.content_type = payload.customData.content_type;
        if (payload.customData.content_name) cd.content_name = payload.customData.content_name;
        if (payload.customData.order_id) cd.order_id = payload.customData.order_id;
        if (payload.customData.delivery_category) cd.delivery_category = payload.customData.delivery_category;
        event.custom_data = cd;
    }

    // Build request body
    const body: Record<string, unknown> = {
        data: [event],
    };
    if (FB_TEST_EVENT_CODE) {
        body.test_event_code = FB_TEST_EVENT_CODE;
    }

    try {
        const response = await fetch(`${CAPI_ENDPOINT}?access_token=${FB_ACCESS_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[FB CAPI] ${payload.eventName} failed (${response.status}):`, errorBody);
            return { success: false, eventId };
        }

        const result = await response.json();
        console.log(`[FB CAPI] ${payload.eventName} sent successfully:`, result);
        return { success: true, eventId };
    } catch (error) {
        console.error(`[FB CAPI] ${payload.eventName} network error:`, error);
        return { success: false, eventId };
    }
}

/**
 * Send both LeadSubmitted and Purchase events for a completed order.
 * Returns the event IDs for client-side deduplication.
 */
export async function sendOrderEvents(orderData: {
    name: string;
    phone: string;
    email?: string | null;
    city: string;
    subtotal: number;
    friendlyId: string;
    items: Array<{ productId: string; productName: string; quantity: number }>;
    sourceUrl?: string;
}): Promise<{ purchaseEventId: string; leadEventId: string }> {
    const customerData: FBCustomerData = {
        phone: orderData.phone,
        firstName: orderData.name.split(" ")[0] || orderData.name,
        lastName: orderData.name.split(" ").slice(1).join(" ") || undefined,
        city: orderData.city,
        email: orderData.email,
    };

    // Fire Purchase event
    const purchaseResult = await sendFacebookEvent({
        eventName: "Purchase",
        customerData,
        customData: {
            currency: "BDT",
            value: orderData.subtotal.toString(),
            content_ids: orderData.items.map((i) => i.productId),
            contents: orderData.items.map((i) => ({
                id: i.productId,
                quantity: i.quantity,
            })),
            content_type: "product",
            content_name: orderData.items.map((i) => i.productName).join(", "),
            order_id: orderData.friendlyId,
            delivery_category: "home_delivery",
        },
        sourceUrl: orderData.sourceUrl,
    });

    // Fire LeadSubmitted event
    const leadResult = await sendFacebookEvent({
        eventName: "LeadSubmitted",
        customerData,
        sourceUrl: orderData.sourceUrl,
    });

    return {
        purchaseEventId: purchaseResult.eventId,
        leadEventId: leadResult.eventId,
    };
}
