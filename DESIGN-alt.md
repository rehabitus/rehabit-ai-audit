# Design System Strategy: Digital Luminary

## 1. Overview & Creative North Star
**Creative North Star: The Ethereal Interface**

This design system is engineered to move beyond the transactional nature of standard web applications, aiming instead for a "Digital Luminary" aesthetic. It treats the screen not as a flat canvas, but as a deep, illuminated space where data and interaction float within a midnight-ocean environment. 

We break the "template" look through **atmospheric depth**. By utilizing high-contrast typography scales (Manrope) and intentional asymmetry—such as overlapping media containers and floating "orb" accents—we create an editorial experience that feels premium and curated. The goal is to evoke a sense of high-end intelligence and calm, using light and color as the primary navigators rather than rigid structural lines.

---

## 2. Colors & Tonal Depth

### The Palette
The core of the system is the interplay between the void and the light.
*   **Background (`#000d27`):** A deep, expansive navy that acts as the infinite stage.
*   **Primary (`#73ffe2` / `#26FEDC`):** A vibrant Cyan/Teal used for high-impact visual anchors and headlines.
*   **Secondary (`#ac8aff`):** A soft Lavender/Indigo used for action-oriented elements (Buttons, Active states).
*   **Tertiary (`#f1e7ff`):** **CRITICAL BRAND MARK TOKEN.** Reserved exclusively for the Logo and select signature brand elements to ensure high-contrast "pop" against both the dark background and the cyan primary accents.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through:
1.  **Background Color Shifts:** Transitioning from `surface` to `surface_container_low`.
2.  **Tonal Transitions:** Using subtle, large-scale gradients to imply a change in content focus.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, frosted layers.
*   **Base:** `surface` (#000d27)
*   **Nested Containers:** Use `surface_container` levels to create subtle lift. For example, a card sitting on a `surface_container_low` section should use `surface_container_high`. This mimics the physical stacking of semi-transparent materials.

### Signature Textures (The Glass & Gradient Rule)
To achieve the "Luminary" effect, all floating panels must utilize **Glassmorphism**. 
*   **Backdrop Blur:** 12px–20px.
*   **Fill:** A semi-transparent version of `surface_variant` or `surface_bright` (approx. 40-60% opacity).
*   **Glows:** Primary CTAs should utilize a soft outer glow (drop-shadow using the `primary` color at 15% opacity) to simulate light emission.

---

## 3. Typography: Manrope Editorial
We use **Manrope** for its crisp, geometric modernism.

*   **Display Scale (`display-lg` to `display-sm`):** Set with tight letter-spacing (-0.02em) and used for "hook" copy. These should often utilize the `primary` cyan color to command immediate attention.
*   **Headlines & Titles:** These provide the authoritative voice. Use `headline-lg` for section headers, maintaining a clear vertical rhythm with the spacing scale (e.g., `spacing-12` below a headline).
*   **Body (`body-lg` to `body-sm`):** Optimized for readability against dark backgrounds. Use `on_surface_variant` (#96abd9) for secondary body text to reduce eye strain and establish a hierarchy of information.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. Avoid shadows for standard layout blocks; instead, use the `surface_container` tiers to "lift" elements. The only items that receive traditional shadows are those that "float" above the content (Modals, Tooltips, Floating Action Buttons).

### Ambient Shadows
Shadows must be non-structural and atmospheric:
*   **Color:** Tinted with `secondary` or `on_surface` (never pure black).
*   **Properties:** Blur values must be 2x the distance (e.g., 4px Y-offset = 8px-12px Blur).
*   **Opacity:** 4% to 8% to mimic natural light dispersion.

### The Ghost Border
When accessibility requires a container edge, use a **Ghost Border**:
*   Token: `outline_variant` (#33486f) at 15% opacity. This creates a suggestion of an edge without breaking the fluid, "No-Line" aesthetic.

---

## 5. Components

### Buttons
*   **Primary (Secondary Token):** The Lavender/Indigo button (`#8B5CF6`).
    *   **Shape:** `ROUND_EIGHT` (0.5rem).
    *   **Style:** Solid fill with `on_secondary` text. Add a subtle `primary` glow on hover.
*   **Tertiary (Ghost):** Clear background with `primary` text and a `Ghost Border` on hover.

### Cards & Sections
*   **Forbid Dividers:** Do not use lines to separate content within cards.
*   **Separation:** Use `spacing-6` (2rem) as the minimum vertical gap or shift the `surface_container` color.
*   **Media Containers:** Images and videos should feature a `primary_dim` outer glow to integrate them into the "Digital Luminary" theme.

### Chips & Inputs
*   **Chips:** Use `surface_bright` with `on_surface` text.
*   **Inputs:** `surface_container_low` background. The active state is signaled by a `primary` (Cyan) bottom-border only (2px) or a subtle `primary` glow around the `ROUND_EIGHT` container.

---

## 6. Do's and Don'ts

### Do:
*   **Do** overlap elements. Let an image container bleed 20px over a section boundary to break the "grid" feel.
*   **Do** use the `tertiary` lavender-white for the logo to ensure it remains the brightest point of the brand mark.
*   **Do** use `spacing-20` and `spacing-24` for hero sections to create an expensive, editorial "breathing room."

### Don't:
*   **Don't** use 100% opaque white text for everything. It creates "vibration" against the dark background. Use `on_surface_variant` for meta-data and long-form body text.
*   **Don't** use standard 90-degree linear gradients. Use diagonal or radial "mesh" gradients to create more organic light effects.
*   **Don't** ever use a 1px solid border at 100% opacity for cards or navbars.