/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

/**
 * Types of strict GA4 events requested for CivicPulse AI.
 */
export type GA4EventName =
  | "login_success"
  | "signup_success"
  | "google_signin"
  | "logout"
  | "dashboard_view"
  | "issue_viewed"
  | "poll_opened"
  | "report_submitted"
  | "ai_summary_generated";

/**
 * Sends a validated event block to Google Analytics 4 simulated logs
 * and records it securely inside the Firestore telemetry analytics layer.
 */
export async function logAnalyticsEvent(eventName: GA4EventName, parameters: Record<string, any> = {}) {
  try {
    const currentUserId = auth.currentUser?.uid || "anonymous";
    const timestamp = new Date().toISOString();
    
    // 1. Log to runtime developer console
    console.log(`[GA4 / Google Analytics 4 Event Registered Log] :: Name: ${eventName} :: Date: ${timestamp}`, {
      userId: currentUserId,
      ...parameters
    });

    // 2. Transmit to secure Cloud Firestore collection to provide a real dashboard metrics pipeline!
    const secureId = `evt_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const docRef = doc(db, "analytics", secureId);
    
    await setDoc(docRef, {
      eventId: secureId,
      userId: currentUserId,
      eventName,
      parameters,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.warn("Analytics event tracing completed with non-blocking error: ", error);
  }
}
