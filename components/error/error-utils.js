/**
 * Utility functions for normalizing, parsing, and formatting errors
 * across the SAHYOG application (React render errors, Next.js digests,
 * unhandled promise rejections, and window event listener errors).
 */

/**
 * Generate a deterministic short hash from an error message or string
 */
function hashString(str) {
  let hash = 0;
  if (!str || str.length === 0) return "0000";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(4, "0").slice(0, 6);
}

/**
 * Parses a stack trace string to extract file name, line, column, and caller function
 */
export function parseStackTrace(stack) {
  if (!stack || typeof stack !== "string") {
    return {
      caller: "Unknown Caller",
      file: "Unknown File",
      line: null,
      column: null,
      rawStack: "",
    };
  }

  const lines = stack.split("\n").map((l) => l.trim()).filter(Boolean);
  let caller = "Unknown Caller";
  let file = "Unknown Location";
  let line = null;
  let column = null;

  // Search lines for meaningful file location (ignoring react internals / webpack wrappers if possible)
  for (const lineStr of lines) {
    // Match patterns like "at ComponentName (http://localhost:3000/...:line:col)"
    // or "at http://localhost:3000/...:line:col"
    const matchWithCaller = lineStr.match(/at\s+([^\s(]+)\s+\((.+):(\d+):(\d+)\)/);
    const matchSimple = lineStr.match(/at\s+(.+):(\d+):(\d+)/);

    if (matchWithCaller) {
      caller = matchWithCaller[1];
      file = cleanFilePath(matchWithCaller[2]);
      line = parseInt(matchWithCaller[3], 10);
      column = parseInt(matchWithCaller[4], 10);
      break;
    } else if (matchSimple) {
      file = cleanFilePath(matchSimple[1]);
      line = parseInt(matchSimple[2], 10);
      column = parseInt(matchSimple[3], 10);
      break;
    }
  }

  return { caller, file, line, column, rawStack: stack };
}

/**
 * Cleans up messy webpack / nextjs URLs into readable source paths
 */
function cleanFilePath(filePath) {
  if (!filePath) return "Unknown Location";
  try {
    // Strip webpack-internal://, http://localhost:3000, etc.
    let cleaned = filePath
      .replace(/^webpack-internal:\/\/\//, "")
      .replace(/^webpack:\/\/\//, "")
      .replace(/^https?:\/\/[^/]+/, "");
    // Strip query parameters
    cleaned = cleaned.split("?")[0];
    return cleaned || filePath;
  } catch {
    return filePath;
  }
}

/**
 * Normalizes any error object, unhandled rejection, or event into a structured diagnostic record
 */
export function parseErrorInfo(rawError, errorInfo = null, eventType = "Render") {
  const timestamp = new Date();
  let errorObj = rawError;
  let message = "An unknown error occurred";
  let errorType = "UnknownError";
  let digest = null;
  let stack = "";
  let componentStack = "";

  if (errorInfo && errorInfo.componentStack) {
    componentStack = errorInfo.componentStack.trim();
  }

  // Handle Event instances (e.g. window.onerror or unhandledrejection)
  if (typeof window !== "undefined" && rawError instanceof Error) {
    errorObj = rawError;
    message = rawError.message || "An unexpected error occurred";
    errorType = rawError.name || "Error";
    stack = rawError.stack || "";
    digest = rawError.digest || null;
  } else if (rawError && typeof rawError === "object") {
    // Could be a PromiseRejectionEvent
    if ("reason" in rawError) {
      const reason = rawError.reason;
      if (reason instanceof Error) {
        errorObj = reason;
        message = reason.message;
        errorType = `UnhandledPromiseRejection (${reason.name || "Error"})`;
        stack = reason.stack || "";
      } else if (typeof reason === "string") {
        message = reason;
        errorType = "UnhandledPromiseRejection";
      } else {
        try {
          message = JSON.stringify(reason);
        } catch {
          message = String(reason);
        }
        errorType = "UnhandledPromiseRejection";
      }
    } else if ("error" in rawError && rawError.error instanceof Error) {
      // Could be an ErrorEvent
      errorObj = rawError.error;
      message = rawError.error.message;
      errorType = rawError.error.name || "ErrorEvent";
      stack = rawError.error.stack || "";
    } else {
      message = rawError.message || rawError.statusText || JSON.stringify(rawError);
      errorType = rawError.name || rawError.code || "ObjectError";
      digest = rawError.digest || null;
      stack = rawError.stack || "";
    }
  } else if (typeof rawError === "string") {
    message = rawError;
    errorType = "StringError";
  }

  // Next.js digest support
  if (!digest && errorObj && errorObj.digest) {
    digest = errorObj.digest;
  }

  // Parse stack trace for location
  const parsedStack = parseStackTrace(stack);

  // Extract component name from componentStack if available
  let componentName = parsedStack.caller;
  if (componentStack) {
    const firstCompMatch = componentStack.match(/in\s+([A-Za-z0-9_]+)/);
    if (firstCompMatch) {
      componentName = `<${firstCompMatch[1]} />`;
    }
  }

  // Synthesize a reliable error code
  let errorCode = digest
    ? `DIGEST-${digest}`
    : errorObj?.code
    ? String(errorObj.code)
    : `ERR_SAHYOG_${hashString(`${errorType}-${message}-${parsedStack.file}`)}`;

  // Capture environment details
  const pathname = typeof window !== "undefined" ? window.location.pathname : "SSR/Server";
  const fullUrl = typeof window !== "undefined" ? window.location.href : "";
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Server-side";
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  const viewport =
    typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown";

  return {
    id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventType,
    errorType,
    message,
    errorCode,
    digest,
    where: {
      component: componentName,
      file: parsedStack.file,
      line: parsedStack.line,
      column: parsedStack.column,
      route: pathname,
      fullUrl,
    },
    stack: stack || "No stack trace available",
    componentStack,
    timestamp: timestamp.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    isoTimestamp: timestamp.toISOString(),
    environment: {
      route: pathname,
      url: fullUrl,
      isOnline,
      viewport,
      userAgent,
    },
  };
}

/**
 * Creates a formatted bug report text string suitable for copying to clipboard
 */
export function generateErrorReport(info) {
  return `========================================
SAHYOG COLLABORATION PORTAL — ERROR REPORT
========================================
Timestamp:    ${info.timestamp} (${info.isoTimestamp})
Error Code:   ${info.errorCode}
Error Type:   ${info.errorType}
Origin:       ${info.eventType}
Location:     ${info.where.file}${info.where.line ? `:${info.where.line}:${info.where.column}` : ""}
Component:    ${info.where.component}
Route:        ${info.where.route}
Network:      ${info.environment.isOnline ? "Online" : "Offline"}
Viewport:     ${info.environment.viewport}

--- ERROR MESSAGE ---
${info.message}

--- COMPONENT HIERARCHY ---
${info.componentStack || "N/A"}

--- STACK TRACE ---
${info.stack}

--- BROWSER / SYSTEM ---
${info.environment.userAgent}
========================================`;
}
