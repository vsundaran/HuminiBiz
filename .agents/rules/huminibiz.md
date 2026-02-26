---
trigger: always_on
---

1️⃣ Core Performance Requirement (Non-Negotiable)

The application must maintain 60 FPS animations.

No frame drops.

No unnecessary re-renders.

No blocking JS thread operations.

Heavy calculations must be offloaded or optimized.

Avoid synchronous large loops in UI thread.

Use memoization where required.

2️⃣ Animation Rules (Strict)

Use react-native-reanimated (preferred).

Avoid duplicate animation logic.

All animations must be reusable utilities if repeated.

No inline animation logic inside screens.

Extract animation logic into /animations folder if reusable.

Use useSharedValue, withTiming, withSpring properly.

Avoid LayoutAnimation for complex interactions.

Navigation transitions must feel instant and smooth.

No artificial delay in navigation.

Golden rule:

Animation should feel natural, fast, and invisible — not flashy.

3️⃣ UI & Design System Rules
Pixel Perfect Rule (Figma → MCP → AI)

All screens must be pixel-perfect.

Follow exact:

Spacing

Icon size

Font size

Line height

Border radius

Shadow values

Never guess sizes.

If missing from theme → create and add properly.

4️⃣ Asset Rules (Very Strict)

All assets must come from Figma.

Prefer SVG always.

Use high-quality export.

No PNG unless absolutely required.

Asset workflow:

Extract from Figma (SVG preferred).

Store inside:

/src/assets/icons
/src/assets/images

Use react-native-svg.

Wrap SVG as reusable component.

Example rule:

Do NOT inline SVG paths in screens.

Create reusable <Icon /> components.

5️⃣ Theme System (Mandatory)

The app must use centralized theme.

/src/theme

Theme must include:

Colors

Font sizes

Font weights

Spacing scale

Border radius

Shadows

Icon sizes

Rules:

No hardcoded colors.

No hardcoded font sizes.

No hardcoded spacing.

Everything must come from theme.

If a value is missing → add it properly to theme file.

GlueStack UI must consume theme properly.

No dark mode.
All design is based on white background reference.

6️⃣ GlueStack UI Rules

Always use GlueStack components where applicable.

If customization needed:

Extend via theme.

Avoid breaking core behavior.

Do not mix too many third-party UI libraries.

Maintain design consistency.

7️⃣ Folder Structure (Strict)
/src
/assets
/components
/screens
/navigation
/services
/hooks
/store
/theme
/utils
/animations

Rules:

Screens → only layout

Components → reusable UI

No business logic inside screens

API calls → /services

Shared hooks → /hooks

No duplication

8️⃣ Component Rules

All UI pieces must be reusable.

If used more than once → extract to component.

Use React.memo where required.

Avoid anonymous inline functions in render.

Keep components small and focused.

Golden rule:

If you copy-paste twice → create a component.

9️⃣ Navigation Rules

Use proper stack and tab separation.

Navigation must be smooth.

No delayed navigation transitions.

Avoid heavy rendering before screen appears.

Lazy load screens if required.

Use proper type-safe navigation (if TypeScript).

🔟 Authentication & Async Storage Rules
Storage

Use AsyncStorage securely.

Do not store sensitive tokens in plain text if avoidable.

Use token expiration validation.

Clear storage on logout properly.

Centralize storage logic in /services/storage.ts.

Login / Logout Rules

Must use custom confirmation modal.

Logout requires confirmation.

On logout:

Clear tokens

Clear state

Reset navigation stack

If existing modal available → reuse.

If not → create reusable <ConfirmModal />.

1️⃣1️⃣ Global Error Handling UI

API errors must use unified error component.

Do NOT use random alerts.

Create reusable:

<ErrorToast />
<ErrorBanner />

Rules:

All API failures → show standardized error UI.

No raw backend error messages.

User-friendly messages only.

Centralize API error interceptor.

1️⃣2️⃣ API Performance Rules

Use Axios instance.

Add interceptors.

Handle token refresh globally.

Cancel unnecessary requests.

Use loading indicators properly.

Debounce search APIs.

1️⃣3️⃣ Rendering Optimization Rules

Use useMemo, useCallback properly.

Avoid prop drilling.

Use FlatList with:

keyExtractor

getItemLayout (if possible)

removeClippedSubviews

Avoid large inline objects.

1️⃣4️⃣ White Background Rule

Entire app built on white background base.

Avoid unnecessary shadows.

Clean minimal UI.

Industry-level spacing.

Professional visual hierarchy.

1️⃣5️⃣ Icon & Typography Standards

Icons:

Consistent sizing (e.g., 16, 20, 24, 28, 32)

Define in theme

No random sizes

Typography:

Define scale (e.g., 12, 14, 16, 18, 20, 24, 32)

Consistent font weights

Maintain readable line height

No arbitrary font sizes

1️⃣6️⃣ Reusable Animation Rule

If same animation pattern is used:

Create reusable hook:

useFadeIn()
useSlideUp()
useScalePress()

Do NOT rewrite animation logic.

1️⃣7️⃣ Code Quality Standards

No console.log in production

No unused imports

Clean separation of concerns

Proper naming conventions

Avoid deeply nested JSX

Follow functional component pattern only

1️⃣8️⃣ AI Behavior Rules (For MCP + Figma Workflow)

When building a screen:

Follow Figma strictly.

Match spacing and sizes exactly.

Use SVG assets only.

Extract reusable components immediately.

Use theme values only.

Maintain 60fps-friendly implementation.

Avoid layout thrashing.

Optimize before finishing.

If anything missing in design system:

Create properly in theme.

Do not hardcode.

🚀 Golden Standard for This Workspace

This app must feel:

Fast

Premium

Smooth

Professional

Industry-grade

Zero lag

Icon Usage Rules (Strict – Figma Source Only)
🔹 Source of Truth

Icons must be taken only from Figma.

Do NOT download directly from any external website.

Do NOT use any npm icon libraries.

The Figma design file is the single source of truth.

🔹 Mandatory Workflow (Figma → App)

If a screen uses an icon:

Export the icon directly from Figma.

Export format must be SVG only.

Use the exact dimensions used in Figma.

Do not modify stroke width, padding, or proportions.

🔹 Storage Rules

If /assets/icons folder does not exist:

→ Create it.

All icons must be stored inside:

/src/assets/icons

Rules:

Use lowercase kebab-case naming.

Example:

home.svg

arrow-right.svg

notification-outline.svg

No random naming.

No version suffixes like \_new, \_final.

🔹 SVG Implementation Rules

Use react-native-svg.

Convert exported SVG into reusable component.

Do NOT inline raw SVG code inside screens.

Do NOT paste SVG paths directly in screen files.

Correct structure example:

/src/components/icons/HomeIcon.tsx

Usage:

<HomeIcon size={24} color={theme.colors.primary} />
🔹 Pixel Perfect Rule (Non-Negotiable)

Icon size must match Figma exactly.

Do NOT approximate sizes.

Do NOT round values.

If Figma uses:

18px → use 18

22px → use 22

20px → use 20

Exact means exact.

🔹 Theme Integration Rule

Icon sizes must come from theme.

If size does not exist in theme:

Add it properly.

Do NOT hardcode.

No direct numeric values inside screens.

🔹 Modification Restrictions

Do NOT change stroke width.

Do NOT alter viewBox.

Do NOT adjust padding manually.

Do NOT recolor directly in SVG file.

Colors must be controlled via props or theme.

🔹 AI Enforcement Rule

When generating any screen:

If icon appears in Figma → export SVG from Figma.

Place it under /src/assets/icons.

Create reusable icon component.

Use theme-based sizing.

Maintain pixel-perfect implementation.

Never substitute with another icon.

🔥 Final Icon Golden Rule

Icons come only from Figma.
Export as SVG.
Store under /src/assets/icons.
Use as reusable SVG component.
Pixel perfect.
No shortcuts.

Zero visual inconsistency
