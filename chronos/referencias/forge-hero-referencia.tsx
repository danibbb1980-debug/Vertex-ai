You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
forge-hardware-hero.tsx
'use client'

/**
 * Forge: a hardware-shop hero. A forged-wordmark splash, a WebGL window-light backdrop, a knolling photo of a
 * workbench whose tools lift off the board as you pick a project, and a kit dock that counts them.
 *
 * Content (brand, navigation, copy, categories, tools, projects and the bench photo) is passed as props; the demo
 * supplies the original shop. Colours, splash, intro, lamp and shader dials are props with the original values as defaults.
 *
 * Dependencies: motion (motion/react), lucide-react
 * Fonts: Archivo (variable, wdth + wght) and Geist Mono; load them in the host page, the component falls back to system sans/mono.
 *
 * Usage: <Forge brand={{ name: 'Forge', href: '#' }} projects={projects} tools={tools} categories={categories} boardImage={board} />
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, memo } from 'react'
import type { CSSProperties, FocusEvent, FormEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { animate, AnimatePresence, domMax, LazyMotion, m, MotionConfig, useMotionValue, useReducedMotion } from 'motion/react'
import { ArrowRight, BadgeCheck, Drill, Glasses, Hammer, LayoutGrid, Library, PanelTop, Ruler, Scissors, Wrench, ChevronDown, Eye, Headphones, Menu, MousePointerClick, Search, ShieldCheck, ShoppingCart, User, X, Check, Plus, RotateCcw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Joins the truthy class names; the block's classes are passed through untouched
const cn = (...classes: Array< string | false | null | undefined >) => classes.filter(Boolean).join(' ')

/* ------------------------------ Props ------------------------------ */

type CategoryId = string
type ToolId = string
type ProjectId = string
type ProjectType = ResolvedProject

/** Built-in icon names accepted by the icon props; any lucide-react icon component works as well */
export type ForgeIconName = 'drill' | 'hammer' | 'ruler' | 'wrench' | 'glasses' | 'layout-grid' | 'panel-top' | 'scissors' | 'library'

const ICONS: Record< ForgeIconName, LucideIcon > = {
  drill: Drill,
  hammer: Hammer,
  ruler: Ruler,
  wrench: Wrench,
  glasses: Glasses,
  'layout-grid': LayoutGrid,
  'panel-top': PanelTop,
  scissors: Scissors,
  library: Library
}

const resolveIcon = (icon: ForgeIconName | LucideIcon): LucideIcon => (typeof icon === 'string' ? ICONS[icon] : icon)

export interface ForgeCategory {
  /** Label shown in the menu and on a tool's label */
  label: string
  /** Built-in icon name, or an icon component such as one from lucide-react */
  icon: ForgeIconName | LucideIcon
  /** Link target */
  href: string
  /** One-line description in the Categories menu */
  blurb: string
}

export interface ForgeTool {
  /** Name shown on the tool's label and in the kit */
  name: string
  /** Id of the category the tool belongs to */
  category: CategoryId
  /** Link target */
  href: string
  /** Where the tool sits in the bench photo as [left, top, width, height] in percent; its cut-out is drawn exactly there */
  box: [number, number, number, number]
  /** URL of the tool's transparent cut-out, cropped to its box */
  image: string
}

export interface ForgeProject {
  /** Unique id; the id "all" is treated as browsing (no kit) */
  id: ProjectId
  /** Label of the tab */
  label: string
  /** Built-in icon name, or an icon component, for the tab */
  icon: ForgeIconName | LucideIcon
  /** Ids of the tools this job needs; they lift off the board when the project is picked */
  tools: ToolId[]
  /** The three headline lines while this job is chosen; the last is set in the accent colour */
  title: [string, string, string]
}

type ResolvedCategory = Omit< ForgeCategory, 'icon' > & { icon: LucideIcon }
type ResolvedProject = Omit< ForgeProject, 'icon' > & { icon: LucideIcon }

export interface ForgeNav {
  /** Primary links; a link with menu: true opens the Categories dropdown */
  links: Array< { label: string; href: string; menu?: boolean } >
  /** The search form's action and placeholder */
  search: { action: string; placeholder: string }
  /** Account icon link */
  account: { label: string; href: string }
  /** Cart icon link */
  cart: { label: string; href: string }
  /** Pixels scrolled before the bar picks up its frosted background */
  frostAfter: number
}

export interface ForgeCopy {
  /** Small line above the headline (also under the splash wordmark) */
  eyebrow: string
  /** Supporting paragraph under the headline */
  subtext: string
  /** Primary button */
  primary: { label: string; href: string }
  /** Secondary button */
  secondary: { label: string; href: string }
  /** Label above the project tabs */
  picker: string
  /** Hint shown over the bench photo */
  hint: string
  /** Trust row items (rendered with a check, shield and headset icon in turn) */
  trust: string[]
}

export interface ForgeBoardImage {
  /** Large bench photo URL (used from 960px up) */
  large: string
  /** Small bench photo URL (960px wide) */
  small: string
  /** Intrinsic width of the large photo in px, used for its aspect ratio */
  width: number
  /** Intrinsic height of the large photo in px */
  height: number
  /** Accessible description of the photo */
  alt: string
}

export interface ForgeTheme {
  /** Page and hero background */
  page: string
  /** Raised surfaces: the kit dock, tool labels, the board frame */
  card: string
  /** Headline and primary text */
  ink: string
  /** Supporting text */
  grey: string
  /** Brand accent: last headline line, primary button, active states */
  accent: string
  /** Primary button on hover */
  accentDeep: string
  /** Text that sits on the accent */
  onAccent: string
  /** Hairlines and outlines */
  line: string
}

export interface ForgeSplash {
  /** Show the forging splash before the hero */
  enabled: boolean
  /** Only show it on the first visit in a browser tab session */
  oncePerSession: boolean
  /** Screens narrower than this width in px skip the splash */
  skipBelow: number
  /** Seconds before the first strike */
  firstStrike: number
  /** Seconds between strikes */
  strikeEvery: number
  /** Pause on the finished wordmark before it flies to the nav, in seconds */
  hold: number
  /** Length of the wordmark's flight to the nav, in seconds */
  flight: number
  /** Sparks thrown by each strike */
  sparks: number
  /** sessionStorage key remembering the splash was seen */
  storageKey: string
}

export interface ForgeIntro {
  /** Play the bench-photo intro */
  enabled: boolean
  /** Seconds after the splash hands over before the bench starts to appear */
  delay: number
  /** Seconds the bench takes to come into focus */
  reveal: number
  /** Starting scale of the bench photo */
  scale: number
  /** Starting blur of the bench photo in px */
  blur: number
  /** Seconds the window light takes to open */
  beam: number
}

export interface ForgeBoardOptions {
  /** How dark the tools you do not need go, 0 = untouched, 1 = black */
  dim: number
  /** How far a kit tool lifts off the board, in px */
  lift: number
  /** How much a lifted tool grows */
  liftScale: number
  /** How far the lamp pushes each tool's shadow, in px at the board's edge */
  shadowReach: number
  /** Where the lamp rests when the pointer is away, in percent of the board */
  lampRest: { x: number; y: number }
}

export interface ForgeShader {
  /** Page colour behind the light, sRGB 0-1 (must match theme.page) */
  base: [number, number, number]
  /** Colour of the sunlight, sRGB 0-1 */
  light: [number, number, number]
  /** How bright the beam is */
  intensity: number
  /** How much dust shows in the beam, 0 = none */
  dust: number
  /** Film grain strength */
  grain: number
  /** How far the light leans with the cursor, 0 = off */
  cursor: number
  /** Overall animation speed, 1 = as designed */
  speed: number
  /** Render size relative to the screen; lower is cheaper and softer */
  resolution: number
}

export interface ForgeProps {
  /** Wordmark and where it links. Default: empty */
  brand?: { name: string; href: string }
  /** Navigation. Default: no links */
  nav?: ForgeNav
  /** Hero copy. Default: empty */
  copy?: ForgeCopy
  /** Categories by id, listed in the Categories dropdown in categoryOrder. Default: none */
  categories?: Record< CategoryId, ForgeCategory >
  /** The order the Categories dropdown lists them in. Default: none */
  categoryOrder?: CategoryId[]
  /** The tools lying on the bench, by id. Default: none */
  tools?: Record< ToolId, ForgeTool >
  /** The jobs offered as tabs. The hero is not rendered without at least one. Default: none */
  projects?: ForgeProject[]
  /** Id of the job the hero opens on. Default: the first project */
  defaultProject?: ProjectId
  /** The bench photo. Omit to render no photo */
  boardImage?: ForgeBoardImage
  /** Colour roles; any subset overrides the original palette */
  theme?: Partial< ForgeTheme >
  /** Splash dials; any subset overrides the originals */
  splash?: Partial< ForgeSplash >
  /** Bench intro dials; any subset overrides the originals */
  intro?: Partial< ForgeIntro >
  /** Bench lamp and lift dials; any subset overrides the originals */
  boardOptions?: Partial< ForgeBoardOptions >
  /** WebGL backdrop dials; any subset overrides the originals */
  shader?: Partial< ForgeShader >
  /** Forces reduced motion on or off; by default the visitor's prefers-reduced-motion setting is used */
  reducedMotion?: boolean
  /** Extra classes for the root element */
  className?: string
}

/* ----------------------------- Defaults ----------------------------- */

// The house curve for every entrance and hover
const EASE_OUT = [0.22, 1, 0.36, 1] as const

const DEFAULT_THEME: ForgeTheme = {
  page: '#141414',
  card: '#1D1C1B',
  ink: '#F5F3EF',
  grey: '#AAA7A3',
  accent: '#FF814D',
  accentDeep: '#F26A33',
  onAccent: '#141414',
  line: 'rgba(255, 255, 255, 0.18)'
}

const DEFAULT_SPLASH: ForgeSplash = {
  enabled: true,
  oncePerSession: false,
  skipBelow: 1024,
  firstStrike: 0.3,
  strikeEvery: 0.17,
  hold: 0.5,
  flight: 0.9,
  sparks: 9,
  storageKey: 'forge-splash-seen'
}

const DEFAULT_INTRO: ForgeIntro = { enabled: true, delay: 0.05, reveal: 1.4, scale: 1.08, blur: 14, beam: 1.8 }

const DEFAULT_BOARD: ForgeBoardOptions = { dim: 0.8, lift: 6, liftScale: 1.018, shadowReach: 30, lampRest: { x: 22, y: 12 } }

const DEFAULT_SHADER: ForgeShader = {
  base: [0.078, 0.078, 0.078],
  light: [1, 0.74, 0.52],
  intensity: 0.17,
  dust: 0.55,
  grain: 0.025,
  cursor: 0.35,
  speed: 1,
  resolution: 0.75
}

interface ForgeContextValue {
  BRAND: { name: string; href: string }
  NAV: ForgeNav
  COPY: ForgeCopy
  CATEGORIES: Record< CategoryId, ResolvedCategory >
  CATEGORY_ORDER: CategoryId[]
  TOOLS: Record< ToolId, ForgeTool >
  TOOL_IDS: ToolId[]
  toolImage: (id: ToolId) => string
  PROJECTS: ResolvedProject[]
  DEFAULT_PROJECT: ProjectId
  ASSETS: { board: ForgeBoardImage | undefined }
  BOARD: ForgeBoardOptions
  INTRO: ForgeIntro
  SPLASH: ForgeSplash
  SHADER: ForgeShader
  REDUCED: boolean | undefined
}

const ForgeContext = createContext< ForgeContextValue | null >(null)

const useForge = () => {
  const value = useContext(ForgeContext)

  if (!value) throw new Error('Forge parts must render inside <Forge>')

  return value
}

/* ----------------------------- Parts ----------------------------- */



// Server render and first paint assume the query fails; the real value lands on hydration
const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)

      list.addEventListener('change', onChange)

      return () => list.removeEventListener('change', onChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}




type OpeningType = {
  // False while the splash is forging the logo; the hero holds its entrances until it turns true
  opened: boolean
  open: () => void
}

const OpeningContext = createContext< OpeningType >({ opened: true, open: () => {} })

/**
 * The splash sits at the root, above the sticky nav, while the hero it opens lives inside main;
 * this is the one flag they share
 */
const OpeningProvider = ({ children }: { children: ReactNode }) => {
  const { SPLASH } = useForge()

  // States
  const [opened, setOpened] = useState(!SPLASH.enabled)

  // Hooks
  const open = useCallback(() => setOpened(true), [])
  const value = useMemo(() => ({ opened, open }), [opened, open])

  return <OpeningContext.Provider value={value}>{children}</OpeningContext.Provider>
}

const useOpening = () => useContext(OpeningContext)




/**
 * Loads Motion's animation, gesture, drag and layout features for the block's m
 * components. Under reduced motion, Motion drops every movement and keeps only the fades
 */
const MotionProvider = ({ children }: { children: ReactNode }) => {
  const { REDUCED } = useForge()
  const reduced = REDUCED === true

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>{children}</MotionConfig>
    </LazyMotion>
  )
}





type WorkshopLightProps = {
  reduceMotion: boolean
  finePointer: boolean

  // The window stays shut until this turns true, then the beam opens
  lit: boolean
}

// One triangle that covers the screen, built from the vertex index, so no buffers are needed
const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

/**
 * Window light in a dark workshop. Coordinates are scaled by the shorter side, so the beam keeps its
 * shape on a wide desktop and a tall phone alike; the beam always enters from above the top-left
 */
const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uBase;
uniform vec3 uLight;
uniform float uIntensity;
uniform float uDust;
uniform float uGrain;
uniform float uCursor;
uniform float uReveal;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float unit = min(uRes.x, uRes.y);
  vec2 p = frag / unit;
  vec2 size = uRes / unit;
  vec2 mouse = uMouse * size;
  float t = uTime;

  // The beam: from a window above the top-left, falling down and to the right, swaying very slowly
  float sway = sin(t * 0.07) * 0.035 + (uMouse.x - 0.5) * 0.08 * uCursor;
  vec2 dir = normalize(vec2(0.62 + sway, -1.0));
  vec2 origin = vec2(size.x * 0.08, size.y + 0.32);
  vec2 d = p - origin;
  float along = dot(d, dir);
  float across = dot(d, vec2(-dir.y, dir.x));
  float width = 0.2 + along * 0.24;
  // On load the shutters open: the beam starts as a sliver and widens to full, brightening as it goes
  float open = smoothstep(0.0, 1.0, uReveal);
  float reach = width * mix(0.04, 1.0, open);
  float shape = smoothstep(reach, reach * 0.3, abs(across)) * smoothstep(0.0, 0.35, along) * exp(-along * 0.5) * open;

  // The window's mullion and transom leave soft shadow bars inside the light
  float a = across / width;
  shape *= 1.0 - 0.5 * smoothstep(0.07, 0.0, abs(a));
  shape *= 1.0 - 0.35 * smoothstep(0.05, 0.0, abs(along - 0.85));

  // Haze, shafts and dust only exist inside the light, so pixels outside it skip that work entirely
  float beam = 0.0;
  float dust = 0.0;

  if (shape > 0.001) {
  // Drifting haze and long shafts give the light some body
  float haze = fbm(p * vec2(2.2, 3.0) + vec2(t * 0.03, -t * 0.045));
  float shafts = noise(vec2(across * 13.0, t * 0.12));
  beam = shape * (0.5 + 0.9 * haze) * (0.72 + 0.5 * shafts);

  // Dust motes, seen only where the light catches them
  for (int l = 0; l < 2; l++) {
    float fl = float(l);
    float scale = 22.0 + fl * 16.0;
    vec2 q = p * scale;
    q.y -= t * (0.35 + fl * 0.2);
    q.x += sin(t * 0.25 + fl * 2.0 + q.y * 0.08) * 0.6;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float h = hash(id + fl * 13.1);
    vec2 offset = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float r = length(f - offset * 0.7);
    float twinkle = 0.55 + 0.45 * sin(t * (0.8 + h * 2.0) + h * 30.0);
    dust += step(0.86, h) * smoothstep(mix(0.05, 0.12, h), 0.0, r) * twinkle * (1.0 - fl * 0.35);
  }
  dust *= smoothstep(0.02, 0.35, shape);
  }

  // A faint warm glow follows the pointer, like a work lamp being moved
  vec2 m = p - mouse;
  float glow = exp(-dot(m, m) * 7.0) * uCursor;

  vec3 col = uBase + uLight * (beam * uIntensity + dust * uDust * 0.5 + glow * 0.05);

  // Corners fall off, and grain breaks up banding in the near-black
  col *= mix(0.72, 1.0, smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.2, 1.0))));
  col += (hash(frag + fract(t * 7.3) * 91.0) - 0.5) * uGrain;

  fragColor = vec4(col, 1.0);
}`

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)

  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)

    return null
  }

  return shader
}

/**
 * Raw WebGL2 rather than three: one full-screen pass needs no scene graph. It pauses off screen and in
 * a hidden tab, draws one still frame under reduced motion, and leaves the CSS beam behind it on failure
 */
const WorkshopLight = ({ reduceMotion, finePointer, lit }: WorkshopLightProps) => {
  const { INTRO, SHADER } = useForge()

  // Refs
  const canvasRef = useRef< HTMLCanvasElement >(null)

  /**
   * Read by the render loop rather than passed to the setup effect, so a flag settling after hydration
   * or the window opening never tears down and recompiles the WebGL program
   */
  const flagsRef = useRef({ reduceMotion, finePointer, lit })
  const syncRef = useRef<() => void>(() => {})

  useEffect(() => {
    flagsRef.current = { reduceMotion, finePointer, lit }
    syncRef.current()
  }, [reduceMotion, finePointer, lit])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const flags = flagsRef
    let teardown = () => {}

    // Builds everything the beam needs; run again if the browser restores a lost context
    const setup = () => {
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })

      if (!gl) return () => {}

      const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
      const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
      const program = gl.createProgram()
      const vao = gl.createVertexArray()

      if (!vertex || !fragment || !program) return () => {}

      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return () => {}
      }

      gl.useProgram(program)
      gl.bindVertexArray(vao)

      const at = (name: string) => gl.getUniformLocation(program, name)
      const uRes = at('uRes')
      const uTime = at('uTime')
      const uMouse = at('uMouse')
      const uReveal = at('uReveal')
      const uCursor = at('uCursor')

      gl.uniform3fv(at('uBase'), SHADER.base)
      gl.uniform3fv(at('uLight'), SHADER.light)
      gl.uniform1f(at('uIntensity'), SHADER.intensity)
      gl.uniform1f(at('uDust'), SHADER.dust)
      gl.uniform1f(at('uGrain'), SHADER.grain)

      // Pointer in 0–1 of the canvas, y up; eased every frame so the light moves like it has weight
      const target = { x: 0.3, y: 0.7 }
      const mouse = { ...target }
      const rect = { left: 0, top: 0, width: 1, height: 1 }
      let frame = 0
      let visible = true
      let last = performance.now()
      let time = 0
      let openedAt: number | null = null

      const resize = () => {
        const scale = Math.min(window.devicePixelRatio, 1.5) * SHADER.resolution
        const width = Math.max(1, Math.round(canvas.clientWidth * scale))
        const height = Math.max(1, Math.round(canvas.clientHeight * scale))

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
          gl.viewport(0, 0, width, height)
        }

        gl.uniform2f(uRes, width, height)
      }

      // Re-read on resize, and on the next pointer move after a scroll, so scrolling itself never forces a layout read
      let stale = false

      const measure = () => {
        const box = canvas.getBoundingClientRect()

        stale = false

        rect.left = box.left
        rect.top = box.top
        rect.width = box.width || 1
        rect.height = box.height || 1
      }

      const markStale = () => {
        stale = true
      }

      const draw = (now: number) => {
        const { reduceMotion: still, finePointer: fine, lit: isLit } = flags.current

        time += Math.min(now - last, 50) * 0.001 * SHADER.speed
        last = now
        mouse.x += (target.x - mouse.x) * 0.04
        mouse.y += (target.y - mouse.y) * 0.04

        // The beam opens from the moment the hero is lit, not from page load
        if (isLit && openedAt === null) openedAt = time

        const opening = openedAt === null ? 0 : (time - openedAt) / (INTRO.beam * SHADER.speed)

        gl.uniform1f(uTime, still ? 12 : time)
        gl.uniform1f(uReveal, !INTRO.enabled || still ? 1 : Math.min(1, opening))
        gl.uniform1f(uCursor, fine && !still ? SHADER.cursor : 0)
        gl.uniform2f(uMouse, mouse.x, mouse.y)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }

      const loop = (now: number) => {
        draw(now)
        frame = requestAnimationFrame(loop)
      }

      const stop = () => {
        cancelAnimationFrame(frame)
        frame = 0
      }

      // Runs only while the hero is lit, on screen and in a visible tab; reduced motion gets one still frame
      const sync = () => {
        const { reduceMotion: still, lit: isLit } = flags.current
        const run = isLit && !still && visible && !document.hidden

        if (run && !frame) {
          last = performance.now()
          frame = requestAnimationFrame(loop)
        } else if (!run && frame) {
          stop()
        }

        if (!run) draw(performance.now())
      }

      const handlePointer = (event: PointerEvent) => {
        if (!flags.current.finePointer || flags.current.reduceMotion) return

        if (stale) measure()

        target.x = (event.clientX - rect.left) / rect.width
        target.y = 1 - (event.clientY - rect.top) / rect.height
      }

      const resizeObserver = new ResizeObserver(() => {
        resize()
        measure()

        if (!frame) draw(performance.now())
      })

      const viewObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        sync()
      })

      resize()
      measure()
      draw(performance.now())
      canvas.dataset.ready = 'true'
      syncRef.current = sync
      sync()

      resizeObserver.observe(canvas)
      viewObserver.observe(canvas)
      document.addEventListener('visibilitychange', sync)
      window.addEventListener('scroll', markStale, { passive: true })
      window.addEventListener('pointermove', handlePointer, { passive: true })

      return () => {
        stop()
        syncRef.current = () => {}
        resizeObserver.disconnect()
        viewObserver.disconnect()
        document.removeEventListener('visibilitychange', sync)
        window.removeEventListener('scroll', markStale)
        window.removeEventListener('pointermove', handlePointer)
        gl.deleteVertexArray(vao)
        gl.deleteProgram(program)
        gl.deleteShader(vertex)
        gl.deleteShader(fragment)
      }
    }

    // A GPU reset or a backgrounded mobile tab can drop the context; keep it restorable and rebuild then
    const handleLost = (event: Event) => {
      event.preventDefault()
      teardown()
      teardown = () => {}
    }

    const handleRestored = () => {
      teardown = setup()
    }

    teardown = setup()
    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)

    return () => {
      teardown()
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
    }
  }, [])

  return (
    <div aria-hidden className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
      <div className='fg-light-fallback absolute inset-0' />
      <canvas ref={canvasRef} className='fg-light-canvas absolute inset-0 size-full' />
    </div>
  )
}






// Each headline line rises out of its own mask, 0.12s after the one above
const lineReveal = (index: number, go: boolean) => ({
  initial: { y: '108%' },
  animate: { y: go ? '0%' : '108%' },
  transition: { delay: 0.2 + index * 0.12, duration: 0.8, ease: EASE_OUT }
})

const fadeUp = (delay: number, go: boolean) => ({
  initial: { opacity: 0, y: 14 },
  animate: go ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  transition: { delay, duration: 0.6, ease: EASE_OUT }
})

/**
 * A headline line that rolls letter by letter when its text changes: old letters lift out, new ones rise
 * in. Each letter is also its own hover target, knocked down like a nail being driven
 */
const RollingLine = ({ text, delay }: { text: string; delay: number }) => {
  return (
    <AnimatePresence mode='wait' initial={false}>
      <m.span key={text} className='inline-block whitespace-nowrap'>
        {text.split('').map((char, index) => (
          <m.span
            key={`${char}-${index}`}
            initial={{ y: '110%' }}
            animate={{ y: '0%', transition: { delay: delay + index * 0.03, duration: 0.5, ease: EASE_OUT } }}
            exit={{ y: '-110%', transition: { delay: index * 0.02, duration: 0.26, ease: [0.55, 0, 1, 0.45] } }}
            className='inline-block'
          >
            {char === ' ' ? ' ' : <span className='fg-letter'>{char}</span>}
          </m.span>
        ))}
      </m.span>
    </AnimatePresence>
  )
}

type HeroCopyProps = {
  // The three title lines for the chosen job; the last is set in the accent
  lines: string[]

  // False while the splash is still forging the logo; the copy holds hidden until it hands over
  go: boolean
}

const HeroCopyBase = ({ lines, go }: HeroCopyProps) => {
  const { COPY } = useForge()

  // Vars
  const lastLine = lines.length - 1

  return (
    <div className='relative max-w-[600px]'>
      <m.p
        {...fadeUp(0.1, go)}
        className='font-fg-mono text-fg-grey flex items-center gap-3 text-[11.5px] tracking-[0.22em] uppercase'
      >
        <span aria-hidden className='bg-fg-accent h-px w-7' />
        {COPY.eyebrow}
      </m.p>

      <h1 className='fg-display text-fg-ink mt-6 lg:[@media(max-height:900px)]:mt-4'>
        <span className='sr-only'>{lines.join(' ')}</span>
        {lines.map((line, index) => (
          <span key={index} aria-hidden className='fg-mask block'>
            <m.span {...lineReveal(index, go)} className={cn('block', index === lastLine && 'text-fg-accent')}>
              <RollingLine text={line} delay={index * 0.09} />
            </m.span>
          </span>
        ))}
      </h1>

      <m.p
        {...fadeUp(0.9, go)}
        className='text-fg-grey mt-7 max-w-[30rem] text-[16px] leading-[1.6] text-pretty sm:text-[17px] lg:[@media(max-height:900px)]:mt-5'
      >
        {COPY.subtext}
      </m.p>

      <m.div
        {...fadeUp(1.02, go)}
        className='mt-9 flex flex-wrap items-center gap-2.5 xl:gap-3 lg:[@media(max-height:900px)]:mt-7'
      >
        <a
          href={COPY.primary.href}
          className='fg-focus fg-sheen group bg-fg-accent text-fg-on-accent hover:bg-fg-accent-deep relative inline-flex h-[52px] items-center gap-2.5 overflow-hidden rounded-[16px] pr-4 pl-5 text-[15px] font-semibold transition-[background-color,translate,box-shadow] duration-300 ease-(--fg-ease) hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(255,129,77,0.7)] motion-reduce:hover:translate-y-0 xl:pr-5 xl:pl-6'
        >
          <span className='relative'>{COPY.primary.label}</span>
          <ArrowRight
            aria-hidden
            className='relative size-[18px] transition-transform duration-300 ease-(--fg-ease) group-hover:translate-x-[5px]'
          />
        </a>
        <a
          href={COPY.secondary.href}
          className='fg-focus border-fg-ink/45 text-fg-ink hover:bg-fg-ink hover:text-fg-page hover:border-fg-ink inline-flex h-[52px] items-center rounded-[16px] border px-5 text-[15px] font-medium transition-colors duration-300 ease-(--fg-ease) xl:px-6'
        >
          {COPY.secondary.label}
        </a>
      </m.div>
    </div>
  )
}


const HeroCopy = memo(HeroCopyBase)






type ProjectPickerProps = {
  active: ProjectId

  // The tool being pointed at on the board: every job that uses it shows a dot
  tool: ToolId | null
  onPick: (id: ProjectId) => void

  // Hovering a job previews its kit on the board without choosing it
  onPeek: (id: ProjectId | null) => void
}

// A radio group: one tab stop, arrow keys move the choice
const ProjectPicker = ({ active, tool, onPick, onPeek }: ProjectPickerProps) => {
  const { COPY, PROJECTS } = useForge()

  // Refs
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Vars
  const activeIndex = PROJECTS.findIndex(project => project.id === active)

  // Pointing at the chosen job ends any preview; pointing at another one previews it
  const handlePointerEnter = (event: ReactPointerEvent< HTMLButtonElement >, id: ProjectId) => {
    if (event.pointerType === 'mouse') onPeek(id === active ? null : id)
  }

  const handleKeyDown = (event: ReactKeyboardEvent< HTMLDivElement >) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]

    if (!step) return

    event.preventDefault()

    const next = (activeIndex + step + PROJECTS.length) % PROJECTS.length

    onPick(PROJECTS[next].id)
    buttonRefs.current[next]?.focus()
  }

  return (
    <div className='flex flex-col gap-2.5 2xl:flex-row 2xl:items-center 2xl:justify-between'>
      <p className='font-fg-mono text-fg-grey shrink-0 text-[10.5px] tracking-[0.2em] uppercase'>{COPY.picker}</p>
      <div
        role='radiogroup'
        aria-label={COPY.picker}
        onKeyDown={handleKeyDown}
        onPointerLeave={() => onPeek(null)}
        className='fg-picker flex [scrollbar-width:none] gap-1 overflow-x-auto rounded-[14px] p-1'
      >
        {PROJECTS.map((project, index) => {
          const isActive = project.id === active
          const Icon = project.icon
          const usesTool = Boolean(tool) && project.id !== 'all' && project.tools.includes(tool as ToolId)

          return (
            <button
              key={project.id}
              ref={node => {
                buttonRefs.current[index] = node
              }}
              type='button'
              role='radio'
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onPick(project.id)}
              onPointerEnter={event => handlePointerEnter(event, project.id)}
              className={cn(
                'fg-focus relative flex h-11 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-300',
                isActive ? 'text-fg-on-accent' : 'text-fg-ink/70 hover:text-fg-ink'
              )}
            >
              {isActive && (
                <m.span
                  layoutId='fg-picker-pill'
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className='bg-fg-accent absolute inset-0 rounded-[10px]'
                />
              )}
              <Icon aria-hidden className='relative size-4' strokeWidth={1.9} />
              <span className='relative'>{project.label}</span>
              <AnimatePresence>
                {usesTool && (
                  <m.span
                    aria-hidden
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className={cn(
                      'absolute top-1.5 right-1.5 size-1.5 rounded-full',
                      isActive ? 'bg-fg-on-accent' : 'bg-fg-accent'
                    )}
                  />
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
    </div>
  )
}







type BoardToolProps = {
  id: ToolId
  inKit: boolean
  active: boolean

  // Position in the kit, so the tools lift one after another rather than all at once
  order: number
  reduceMotion: boolean
  onToggle: (id: ToolId) => void
  onActive: (id: ToolId | null) => void
}


const LIFT_SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 0.7 } as const

/**
 * A tool cut out of the board photo and laid exactly over its own pixels. Out of the kit it is
 * invisible and the dimmed photo shows through; in the kit it lifts off the bench under the lamp
 */
const BoardToolBase = ({ id, inKit, active, order, reduceMotion, onToggle, onActive }: BoardToolProps) => {
  const { CATEGORIES, TOOLS, TOOL_IDS, toolImage, BOARD } = useForge()

  // Largest tool first: a tool's place in this list is how far up the stack it sits
  const BY_SIZE = [...TOOL_IDS].sort((a, b) => TOOLS[b].box[2] * TOOLS[b].box[3] - TOOLS[a].box[2] * TOOLS[a].box[3])

  // Vars
  const tool = TOOLS[id]
  const [left, top, width, height] = tool.box
  const labelBelow = top < 14

  // The tool's centre feeds the lamp shadow in index.css, so each shadow falls away from the light
  const style = {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
    '--tx': left + width / 2,
    '--ty': top + height / 2,

    /**
     * Smaller tools stack above larger ones, so a tool lying inside a bigger one's box still takes the
     * click; the pointed-at tool sits above all of them, so its label is never drawn under a neighbour
     */
    zIndex: active ? 40 : 11 + BY_SIZE.indexOf(id)
  } as CSSProperties

  const lifted = inKit && !reduceMotion

  // The kit lifts one tool after another rather than all at once
  const delay = inKit && !reduceMotion ? order * 0.06 : 0
  const opacity = inKit || active ? 1 : 0
  const target = { opacity: active ? 1 : opacity, y: lifted ? -BOARD.lift : 0, scale: lifted ? BOARD.liftScale : 1 }
  const transition = { opacity: { duration: 0.35, delay, ease: EASE_OUT }, default: { ...LIFT_SPRING, delay } }

  return (
    <button
      type='button'
      aria-pressed={inKit}
      aria-label={tool.name}
      onClick={() => onToggle(id)}
      onPointerEnter={() => onActive(id)}
      onPointerLeave={() => onActive(null)}
      onFocus={() => onActive(id)}
      onBlur={() => onActive(null)}
      style={style}
      className="fg-tool fg-focus absolute cursor-pointer rounded-[10px] transition-[scale] duration-150 after:absolute after:-inset-2 after:content-[''] active:scale-[0.97]"
    >
      <m.img
        src={toolImage(id)}
        alt=''
        draggable={false}
        decoding='async'
        fetchPriority='low'
        initial={false}
        animate={target}
        transition={transition}
        className={cn('pointer-events-none size-full select-none', inKit ? 'fg-lifted' : 'fg-preview')}
      />

      <AnimatePresence>
        {active && (
          <m.span
            initial={{ opacity: 0, y: labelBelow ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className={cn(
              'fg-tag pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 whitespace-nowrap',
              labelBelow ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'
            )}
          >
            <span
              className={cn(
                'grid size-5 place-items-center rounded-full',
                inKit ? 'bg-fg-accent text-fg-on-accent' : 'text-fg-ink bg-white/12'
              )}
            >
              {inKit ? <Check className='size-3' strokeWidth={3} /> : <Plus className='size-3' strokeWidth={3} />}
            </span>
            <span className='text-fg-ink text-[12.5px] font-semibold'>{tool.name}</span>
            <span className='font-fg-mono text-fg-grey text-[9.5px] tracking-[0.14em] uppercase'>
              {inKit ? 'In kit' : CATEGORIES[tool.category].label}
            </span>
          </m.span>
        )}
      </AnimatePresence>
    </button>
  )
}


const BoardTool = memo(BoardToolBase)







type KitBoardProps = {
  project: ProjectId
  kit: ToolId[]

  // A job whose kit is shown while its tab is hovered, before it is chosen
  preview: ProjectType | null
  active: ToolId | null
  finePointer: boolean
  reduceMotion: boolean
  onToggle: (id: ToolId) => void
  onActive: (id: ToolId | null) => void

  // False while the splash is on; the bench photo comes up whole once it turns true
  opened: boolean
}

const RULER_MARKS = Array.from({ length: 11 }, (_, index) => index * 10)

const KitBoard = ({ project, kit, preview, active, finePointer, reduceMotion, onToggle, onActive, opened }: KitBoardProps) => {
  const { COPY, TOOLS, TOOL_IDS, ASSETS, BOARD, INTRO } = useForge()

  // Tools in reading order, top to bottom then left to right, so the Tab key moves across the bench naturally
  const ORDER = [...TOOL_IDS].sort((a, b) => TOOLS[a].box[1] - TOOLS[b].box[1] || TOOLS[a].box[0] - TOOLS[b].box[0])

  const BOARD_STYLE = {
    '--lx': BOARD.lampRest.x,
    '--ly': BOARD.lampRest.y,
    '--fg-reach': `${BOARD.shadowReach / 100}px`
  } as CSSProperties

  // Refs
  const boardRef = useRef< HTMLDivElement >(null)
  const frameRef = useRef(0)
  const lampRef = useRef({ x: BOARD.lampRest.x, y: BOARD.lampRest.y })

  // Vars

  // Under All tools the photo stays in full light until something is picked; then it dims like any job
  const bright = (preview ? preview.id : project) === 'all' && kit.length === 0

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  // The lamp is written once per frame at most, however fast the pointer events arrive
  const moveLamp = (x: number, y: number) => {
    lampRef.current = { x, y }

    if (frameRef.current) return

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      boardRef.current?.style.setProperty('--lx', String(lampRef.current.x))
      boardRef.current?.style.setProperty('--ly', String(lampRef.current.y))
    })
  }

  // The lamp follows the pointer through two CSS variables, so moving it never renders React
  const handlePointerMove = (event: ReactPointerEvent< HTMLDivElement >) => {
    if (!finePointer || reduceMotion) return

    const rect = event.currentTarget.getBoundingClientRect()

    moveLamp(((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100)
  }

  const handlePointerLeave = () => {
    moveLamp(BOARD.lampRest.x, BOARD.lampRest.y)
  }

  return (
    <div className='fg-mat relative rounded-[22px] p-2 pt-7 pl-7 sm:p-2.5 sm:pt-8 sm:pl-8'>
      {/* Cutting-mat rulers along the top and left edge */}
      <div aria-hidden className='fg-ruler-x absolute top-2.5 right-2.5 left-8 h-5 sm:left-[42px]'>
        {RULER_MARKS.map(mark => (
          <span key={mark} className='absolute -translate-x-1/2' style={{ left: `${mark}%` }}>
            {mark / 10}
          </span>
        ))}
      </div>
      <div aria-hidden className='fg-ruler-y absolute top-8 bottom-2.5 left-2.5 w-5 sm:top-[42px]'>
        {RULER_MARKS.filter(mark => mark < 100).map(mark => (
          <span key={mark} className='absolute -translate-y-1/2' style={{ top: `${mark}%` }}>
            {mark / 10}
          </span>
        ))}
      </div>

      <div
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={BOARD_STYLE}
        data-bright={bright || undefined}
        className='fg-board relative isolate aspect-[1600/1066] w-full overflow-hidden rounded-[14px]'
      >
        {/**
         * The whole bench pulls into focus at once, from a little larger and softer. It starts at a
         * sliver of opacity rather than none, so the browser can count it as the largest paint early
         */}
        {ASSETS.board && (
        <m.img
          initial={
            INTRO.enabled && !reduceMotion
              ? { opacity: 0.01, scale: INTRO.scale, filter: `blur(${INTRO.blur}px)` }
              : false
          }
          animate={
            opened || !INTRO.enabled
              ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0.01, scale: INTRO.scale, filter: `blur(${INTRO.blur}px)` }
          }
          transition={{ delay: INTRO.delay, duration: reduceMotion ? 0.4 : INTRO.reveal, ease: EASE_OUT }}
          src={ASSETS.board.large}
          srcSet={`${ASSETS.board.small} 960w, ${ASSETS.board.large} 1600w`}
          sizes='(min-width: 1024px) 55vw, calc(100vw - 104px)'
          alt={ASSETS.board.alt}
          width={ASSETS.board.width}
          height={ASSETS.board.height}
          fetchPriority='high'
          decoding='async'
          className='fg-bench-photo absolute inset-0 size-full object-cover'
        />
        )}

        {/* Everything the job doesn't need falls into shadow; the kit is drawn back on top at full light */}
        <m.div
          aria-hidden
          initial={false}
          animate={{ opacity: bright ? 0 : kit.length ? BOARD.dim : 0.12 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className='absolute inset-0 bg-[#0b0a09]'
        />
        <div aria-hidden className='fg-lamp pointer-events-none absolute inset-0' />

        {/* A band of light passes over the bench whenever the project changes */}
        {!reduceMotion && (
          <AnimatePresence initial={false}>
            <m.div
              key={project}
              aria-hidden
              initial={{ x: '-60%', opacity: 0.9 }}
              animate={{ x: '160%', opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
              className='fg-sweep pointer-events-none absolute inset-y-0 left-0 z-[24] w-1/2'
            />
          </AnimatePresence>
        )}

        {ORDER.map(id => (
          <BoardTool
            key={id}
            id={id}
            inKit={kit.includes(id)}
            active={active === id}
            order={kit.indexOf(id)}
            reduceMotion={reduceMotion}
            onToggle={onToggle}
            onActive={onActive}
          />
        ))}

        <AnimatePresence>
          {preview && (
            <m.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className='font-fg-mono bg-fg-ink text-fg-page pointer-events-none absolute top-3 right-3 z-30 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase'
            >
              <Eye aria-hidden className='size-3.5' />
              Preview · {preview.label} · {preview.tools.length} tools
            </m.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode='wait' initial={false}>
          {opened && (
            <m.p
              key='hint'
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className='font-fg-mono pointer-events-none absolute bottom-3 left-3 z-[60] hidden items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/75 uppercase backdrop-blur-sm sm:flex'
            >
              <MousePointerClick aria-hidden className='size-3.5' />
              {COPY.hint}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}







type KitDockProps = {
  project: ProjectType
  kit: ToolId[]
  customised: boolean
  onRemove: (id: ToolId) => void
  onReset: () => void
}

/**
 * The kit as a shopping list: what the board lifted, editable from here too, with the cart button
 * counting along. No prices, because the block has none it could vouch for
 */
const KitDockBase = ({ project, kit, customised, onRemove, onReset }: KitDockProps) => {
  const { TOOLS, toolImage } = useForge()

  // Vars
  const count = kit.length
  const label = `${count} ${count === 1 ? 'tool' : 'tools'}`

  return (
    <div className='fg-dock flex flex-col gap-4 rounded-[20px] p-3 sm:flex-row sm:items-center sm:gap-5 sm:pl-5'>
      <div className='min-w-0 shrink-0'>
        <p className='font-fg-mono text-fg-accent text-[10px] tracking-[0.18em] uppercase'>Your kit</p>
        {/* Read once per change; the rolling digits below are for the eye only */}
        <span className='sr-only' aria-live='polite'>
          {label} in your kit
        </span>
        <p aria-hidden className='text-fg-ink mt-1 flex items-center text-[15px] font-semibold'>
          {/* The count rolls like a tally counter as tools come and go */}
          <span className='relative inline-flex h-[1.25em] overflow-hidden tabular-nums'>
            <AnimatePresence mode='popLayout' initial={false}>
              <m.span
                key={count}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className='block'
              >
                {count}
              </m.span>
            </AnimatePresence>
          </span>
          &nbsp;{count === 1 ? 'tool' : 'tools'}&nbsp;·&nbsp;
          <span className='text-fg-grey truncate font-normal'>
            {project.id === 'all' ? 'Your picks' : customised ? 'Customised' : project.label}
          </span>
        </p>
      </div>

      <ul className='flex min-h-11 min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto'>
        <AnimatePresence initial={false} mode='popLayout'>
          {kit.map(id => (
            <m.li
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className='shrink-0'
            >
              <button
                type='button'
                onClick={() => onRemove(id)}
                aria-label={`Remove ${TOOLS[id].name} from your kit`}
                title={TOOLS[id].name}
                className="fg-focus group relative grid size-9 cursor-pointer place-items-center rounded-[10px] bg-white/[0.06] transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-white/[0.12]"
              >
                <img
                  src={toolImage(id)}
                  alt=''
                  width={24}
                  height={24}
                  loading='lazy'
                  decoding='async'
                  className='size-6 object-contain'
                />
                <span className='bg-fg-ink text-fg-page absolute -top-1 -right-1 grid size-4 scale-0 place-items-center rounded-full transition-transform duration-200 group-hover:scale-100 group-focus-visible:scale-100'>
                  <X aria-hidden className='size-2.5' strokeWidth={3} />
                </span>
              </button>
            </m.li>
          ))}
        </AnimatePresence>
        {count === 0 && <li className='text-fg-grey text-[13px]'>Tap tools on the bench to build a kit.</li>}
      </ul>

      <div className='flex shrink-0 items-center gap-2'>
        {customised && (
          <button
            type='button'
            onClick={onReset}
            aria-label={`Reset to the ${project.label} kit`}
            className='fg-focus text-fg-grey hover:text-fg-ink grid size-11 cursor-pointer place-items-center rounded-[12px] transition-colors'
          >
            <RotateCcw aria-hidden className='size-4' />
          </button>
        )}
        <button
          type='button'
          disabled={count === 0}
          className='fg-focus fg-sheen group bg-fg-accent text-fg-on-accent hover:bg-fg-accent-deep relative inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[12px] px-5 text-[14px] font-semibold transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40 sm:flex-none'
        >
          <span className='relative'>Add {label} to cart</span>
          <ArrowRight
            aria-hidden
            className='relative size-4 transition-transform duration-300 group-hover:translate-x-1'
          />
        </button>
      </div>
    </div>
  )
}


const KitDock = memo(KitDockBase)







type Stage = 'dark' | 'forge' | 'handoff' | 'skip' | 'done'

// Strike time of each letter, and the moment its hammer blow lands (a third of the way into the strike)
const STRIKE = 0.42

// The full stop falls after the last letter and lands as the ember
const DOT_DROP = 0.48

const splashTimings = (name: string, splash: { firstStrike: number; strikeEvery: number; hold: number }) => {
  const LETTERS = name.split('')
  const strikeAt = (index: number) => splash.firstStrike + index * splash.strikeEvery
  const impactAt = (index: number) => strikeAt(index) + STRIKE * 0.35
  const DOT_AT = strikeAt(LETTERS.length) + 0.06
  const DOT_IMPACT = DOT_AT + DOT_DROP
  const HANDOFF_AT = DOT_IMPACT + splash.hold

  return { LETTERS, strikeAt, impactAt, DOT_AT, DOT_IMPACT, HANDOFF_AT }
}

// Metal cooling: white-hot, orange, the brand accent, then the ink of the finished logo
const COOLING = ['#FFF6DD', '#FFC285', '#FF814D', '#F5F3EF']

const GLOW = [
  '0 0 34px rgba(255,190,120,0.95)',
  '0 0 22px rgba(255,129,77,0.6)',
  '0 0 8px rgba(255,129,77,0.2)',
  '0 0 0 rgba(255,129,77,0)'
]

// Same sparks on every load: a seeded hash instead of Math.random, which would also break hydration
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453

  return x - Math.floor(x)
}

const sparksFor = (seed: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI * (0.1 + 0.8 * rand(seed * 31 + i))
    const speed = 50 + 90 * rand(seed * 17 + i * 3)

    // Rounded, so the server and the browser print the same inline sizes
    const round = (value: number) => Math.round(value * 10) / 10

    return {
      x: round(Math.cos(angle) * speed),
      y: round(Math.sin(angle) * speed),
      fall: round(30 + 50 * rand(seed * 7 + i * 11)),
      size: round(2 + 2.5 * rand(seed * 5 + i)),
      duration: round(0.55 + 0.35 * rand(seed * 13 + i * 5))
    }
  })

type SparkType = ReturnType< typeof sparksFor >[number]

/**
 * One spark thrown from its strike: a single compositor animation of opacity and transform, held at its
 * first keyframe (invisible) until its delay has passed
 */
const Spark = ({ spark, at, go }: { spark: SparkType; at: number; go: boolean }) => {
  // Refs
  const sparkRef = useRef< HTMLSpanElement >(null)
  const animationRef = useRef< Animation | null >(null)

  useEffect(() => {
    const node = sparkRef.current

    if (!go || !node || animationRef.current) return

    const easing = 'ease-out'

    animationRef.current = node.animate(
      [
        { opacity: 0, transform: 'translate(0px, 0px)', offset: 0, easing },
        { opacity: 1, transform: 'translate(0px, 0px)', offset: 0.02, easing },
        { opacity: 1, transform: `translate(${spark.x * 0.6}px, ${spark.y * 0.6}px)`, offset: 0.4, easing },
        { opacity: 0, transform: `translate(${spark.x}px, ${spark.y + spark.fall}px)`, offset: 1 }
      ],
      { duration: spark.duration * 1000, delay: at * 1000, fill: 'both' }
    )
  }, [go, spark, at])

  // Only a real unmount stops it, so a skip leaves the spark to fade with the splash around it
  useEffect(() => {
    return () => {
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [])

  return (
    <span
      ref={sparkRef}
      style={{ opacity: 0, width: spark.size, height: spark.size }}
      className='fg-spark absolute rounded-full'
    />
  )
}

const Sparks = ({ seed, count, at, go }: { seed: number; count: number; at: number; go: boolean }) => {
  return (
    <span aria-hidden className='pointer-events-none absolute bottom-[0.1em] left-1/2 size-0'>
      {sparksFor(seed, count).map((spark, index) => (
        <Spark key={index} spark={spark} at={at} go={go} />
      ))}
    </span>
  )
}

/**
 * A splash that is the logo being made: it never shows anything the page does not keep, because the
 * finished wordmark flies into the nav and becomes the logo there
 */
const ForgeSplash = () => {
  const { BRAND, COPY, SPLASH } = useForge()

  // States
  const [stage, setStage] = useState< Stage >('dark')

  // Refs
  const rootRef = useRef< HTMLDivElement >(null)
  const wordRef = useRef< HTMLDivElement >(null)
  const shakeX = useMotionValue(0)
  const openedRef = useRef(false)
  const skipRef = useRef<() => void>(() => {})

  // Hooks
  const reduceMotion = useReducedPreference()

  // The hero opens underneath the moment the wordmark starts its flight
  const { open: openHero } = useOpening()

  // Vars
  const { LETTERS, strikeAt, impactAt, DOT_AT, DOT_IMPACT, HANDOFF_AT } = splashTimings(BRAND.name, SPLASH)
  const go = stage === 'forge' || stage === 'handoff'

  useEffect(() => {
    const root = rootRef.current?.closest< HTMLElement >('.fg-root')
    const timers: number[] = []
    const later = (seconds: number, run: () => void) => timers.push(window.setTimeout(run, seconds * 1000))

    // Once the hero has been handed over, the splash never starts again, whatever re-runs this effect
    if (openedRef.current) return

    let cancelled = false

    const open = () => {
      if (openedRef.current) return

      openedRef.current = true
      openHero()
    }

    const finish = () => {
      root?.removeAttribute('data-splash')
      setStage('done')
    }

    let seen = false

    try {
      seen = SPLASH.oncePerSession && sessionStorage.getItem(SPLASH.storageKey) === '1'
    } catch {
      seen = false
    }

    // Small screens are marked before the first paint (see index.tsx); the query covers client navigation
    const skipped =
      (root?.hasAttribute('data-nosplash') ?? false) ||
      window.matchMedia(`(max-width: ${SPLASH.skipBelow - 0.02}px)`).matches

    if (reduceMotion || seen || skipped) {
      later(0, () => {
        open()
        finish()
      })

      return () => timers.forEach(timer => window.clearTimeout(timer))
    }

    root?.setAttribute('data-splash', 'on')

    let handed = false

    // The wordmark flies to wherever the nav logo really is, so it lands on it at any screen size
    const handoff = () => {
      if (handed) return

      handed = true
      const word = wordRef.current
      const logo = root?.querySelector< HTMLElement >('.fg-logo')

      setStage('handoff')
      open()

      try {
        sessionStorage.setItem(SPLASH.storageKey, '1')
      } catch {
        // Storage can be blocked; the splash just shows again next time
      }

      if (!word || !logo) {
        later(0.4, finish)

        return
      }

      const from = word.getBoundingClientRect()
      const to = logo.getBoundingClientRect()

      animate(
        word,
        { x: [0, to.left - from.left], y: [0, to.top - from.top], scale: [1, to.height / from.height] },
        { duration: SPLASH.flight, ease: [0.7, 0, 0.2, 1] }
      ).then(finish)
    }

    // A hammer blow jolts the whole frame by a couple of pixels
    const jolt = (strength: number) => {
      animate(shakeX, [0, -strength, strength * 0.6, 0], { duration: 0.16 })
    }

    const begin = () => {
      setStage('forge')
      LETTERS.forEach((_, index) => later(impactAt(index), () => jolt(2)))
      later(DOT_IMPACT, () => jolt(3.5))
      later(HANDOFF_AT, handoff)
    }

    // Wait for the brand font, so the letters are struck in Archivo rather than swapped in mid-strike
    let started = false

    const start = () => {
      if (started) return

      started = true
      begin()
    }

    // The fonts promise outlives this effect, so a stale run must not start a second forge
    document.fonts.ready.then(() => !cancelled && start())
    later(0.7, start)

    // Any key or click skips: the splash simply fades, since a half-struck word should not fly anywhere
    const handleSkip = () => {
      if (handed) return

      handed = true
      started = true
      timers.forEach(timer => window.clearTimeout(timer))
      timers.length = 0
      setStage('skip')
      open()
      later(0.35, finish)
    }

    skipRef.current = handleSkip
    window.addEventListener('keydown', handleSkip, { once: true })

    return () => {
      cancelled = true
      timers.forEach(timer => window.clearTimeout(timer))
      window.removeEventListener('keydown', handleSkip)
      root?.removeAttribute('data-splash')
    }
  }, [reduceMotion, openHero, shakeX])

  if (stage === 'done') return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      onPointerDown={() => skipRef.current()}
      className='fg-splash fixed inset-0 z-[100] grid cursor-pointer place-items-center'
    >
      {/* The dark lifts as the wordmark leaves, uncovering the hero already opening underneath */}
      <m.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'handoff' || stage === 'skip' ? 0 : 1 }}
        transition={{ duration: stage === 'skip' ? 0.3 : SPLASH.flight * 0.85, ease: 'easeInOut' }}
        className='bg-fg-page absolute inset-0'
      />

      {/* Heat that builds with every strike and dies with the hand-off */}
      <m.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: stage === 'forge' ? 1 : 0, scale: stage === 'forge' ? 1 : 1.2 }}
        transition={{ duration: stage === 'forge' ? HANDOFF_AT : 0.5, ease: 'easeOut' }}
        className='fg-splash-heat absolute size-[70vmin] rounded-full'
      />

      <m.div
        style={{ x: shakeX }}
        animate={{ opacity: stage === 'skip' ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className='relative flex flex-col items-center'
      >
        <div ref={wordRef} className='fg-logo fg-splash-word text-fg-ink relative flex origin-top-left leading-none'>
          {/* The anvil: a faint line the letters are struck against */}
          <m.span
            aria-hidden
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: stage === 'forge' ? 1 : 0, scaleX: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='absolute inset-x-[-6%] bottom-[0.02em] h-px bg-white/15'
          />

          {LETTERS.map((letter, index) => (
            <span key={index} className='relative inline-block'>
              <m.span
                initial={{ opacity: 0 }}
                animate={
                  go
                    ? {
                        opacity: 1,
                        y: ['-0.32em', '0em', '0em'],
                        scaleY: [1.1, 0.82, 1],
                        scaleX: [0.94, 1.14, 1],
                        color: COOLING,
                        textShadow: GLOW
                      }
                    : { opacity: 0 }
                }
                transition={{
                  opacity: { duration: 0.05, delay: strikeAt(index) },
                  y: { duration: STRIKE, delay: strikeAt(index), times: [0, 0.35, 1], ease: 'easeOut' },
                  scaleY: { duration: STRIKE, delay: strikeAt(index), times: [0, 0.35, 1] },
                  scaleX: { duration: STRIKE, delay: strikeAt(index), times: [0, 0.35, 1] },
                  color: { duration: 1.3, delay: strikeAt(index) + 0.1, times: [0, 0.2, 0.55, 1] },
                  textShadow: { duration: 1.3, delay: strikeAt(index) + 0.1, times: [0, 0.2, 0.55, 1] }
                }}
                className='inline-block origin-bottom'
              >
                {letter}
              </m.span>

              {/* A flash on the anvil where the blow lands */}
              <m.span
                aria-hidden
                initial={{ opacity: 0 }}
                animate={go ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: impactAt(index), times: [0, 0.15, 1] }}
                className='fg-splash-flash absolute inset-x-[-25%] bottom-[-0.08em] h-[0.16em]'
              />
              <Sparks seed={index + 1} count={SPLASH.sparks} at={impactAt(index)} go={go} />
            </span>
          ))}

          {/* The full stop falls last, molten, and stays lit as the brand's ember */}
          <span className='relative inline-block'>
            <m.span
              initial={{ opacity: 0 }}
              animate={go ? { opacity: 1, y: ['-1.6em', '0em', '-0.06em', '0em'] } : { opacity: 0 }}
              transition={{
                opacity: { duration: 0.05, delay: DOT_AT },
                y: { duration: DOT_DROP + 0.2, delay: DOT_AT, times: [0, 0.7, 0.85, 1], ease: 'easeIn' }
              }}
              className='fg-ember text-fg-accent inline-block'
            >
              .
            </m.span>
            <Sparks seed={99} count={SPLASH.sparks * 2} at={DOT_IMPACT} go={go} />
          </span>
        </div>

        <m.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{
            opacity: stage === 'forge' ? 1 : 0,
            letterSpacing: stage === 'forge' ? '0.32em' : '0.5em'
          }}
          transition={{ duration: stage === 'forge' ? 0.9 : 0.25, delay: stage === 'forge' ? DOT_IMPACT - 0.1 : 0 }}
          className='font-fg-mono text-fg-grey absolute top-[calc(100%+28px)] text-[11px] whitespace-nowrap uppercase'
        >
          {COPY.eyebrow}
        </m.p>
      </m.div>
    </div>
  )
}






const panelMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.22, ease: EASE_OUT }
}

// The hit area grows through a pseudo-element, so the box the splash flies into keeps the text's size
const Logo = () => {
  const { BRAND } = useForge()

  return (
    <a
      href={BRAND.href}
      className="fg-focus fg-logo text-fg-ink relative rounded-md text-[25px] leading-none after:absolute after:-inset-x-1 after:-inset-y-[10px] after:content-['']"
    >
      {BRAND.name}
      <span className='fg-ember text-fg-accent inline-block'>.</span>
    </a>
  )
}

const CategoryList = ({ onPick }: { onPick?: () => void }) => {
  const { CATEGORIES, CATEGORY_ORDER } = useForge()

  return (
    <ul className='grid gap-0.5'>
      {CATEGORY_ORDER.map(id => {
        const category = CATEGORIES[id]
        const Icon = category.icon

        return (
          <li key={id}>
            <a
              href={category.href}
              onClick={onPick}
              className='fg-focus group hover:bg-fg-ink/[0.06] flex items-center gap-3 rounded-[12px] p-2 transition-colors'
            >
              <span className='bg-fg-ink/[0.06] text-fg-ink group-hover:bg-fg-accent group-hover:text-fg-on-accent grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors duration-300'>
                <Icon aria-hidden className='size-[17px]' strokeWidth={1.75} />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='text-fg-ink block text-[14px] font-medium'>{category.label}</span>
                <span className='text-fg-grey block truncate text-[12.5px]'>{category.blurb}</span>
              </span>
              <ArrowRight
                aria-hidden
                className='text-fg-grey size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1'
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

const CategoriesMenu = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const rootRef = useRef< HTMLLIElement >(null)
  const timer = useRef(0)

  useEffect(() => {
    if (!open) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        rootRef.current?.querySelector('button')?.focus()
      }
    }

    const handlePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    window.addEventListener('keydown', handleKey)
    document.addEventListener('pointerdown', handlePress)

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.removeEventListener('pointerdown', handlePress)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  /**
   * A mouse opens and closes it with a short delay, so crossing the menu on the way elsewhere does
   * nothing; touch ignores these, since a tap fires a pointer leave straight after it lands
   */
  const handleEnter = (event: ReactPointerEvent) => {
    if (event.pointerType !== 'mouse') return

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), 90)
  }

  const handleLeave = (event: ReactPointerEvent) => {
    if (event.pointerType !== 'mouse') return

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(false), 180)
  }

  // A mouse that hovered it open keeps it open on click; keyboard and touch toggle it
  const handleClick = (event: ReactMouseEvent) => {
    window.clearTimeout(timer.current)

    if (event.detail > 0 && matchMedia('(hover: hover)').matches) setOpen(true)
    else setOpen(value => !value)
  }

  // Tabbing out of the menu closes it
  const handleBlur = (event: FocusEvent< HTMLLIElement >) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  return (
    <li
      ref={rootRef}
      className='relative'
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onBlur={handleBlur}
    >
      <button
        type='button'
        aria-expanded={open}
        aria-controls={open ? 'fg-categories' : undefined}
        onClick={handleClick}
        className='fg-focus fg-underline text-fg-ink/75 hover:text-fg-ink aria-expanded:text-fg-ink flex cursor-pointer items-center gap-1 rounded-md py-2 text-[14.5px] font-medium transition-colors'
      >
        Categories
        <ChevronDown aria-hidden className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id='fg-categories'
            {...panelMotion}
            className='fg-panel absolute top-full left-1/2 z-50 mt-3 w-[340px] origin-top -translate-x-1/2 rounded-[18px] p-2'
          >
            <CategoryList onPick={() => setOpen(false)} />
            <a
              href='#categories'
              className='fg-focus text-fg-accent border-fg-line mt-1 flex items-center justify-between border-t px-2 pt-3 pb-1.5 text-[13px] font-semibold'
            >
              All categories
              <ArrowRight aria-hidden className='size-4' />
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  )
}

const SearchField = () => {
  const { NAV } = useForge()

  // States
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Refs
  const inputRef = useRef< HTMLInputElement >(null)
  const buttonRef = useRef< HTMLButtonElement >(null)

  // Hooks
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSubmit = (event: FormEvent< HTMLFormElement >) => {
    if (!open) {
      event.preventDefault()
      setOpen(true)

      return
    }

    if (!query.trim()) event.preventDefault()
  }

  // An empty field folds away when focus leaves it; a typed query stays visible
  const handleBlur = () => {
    if (!query) setOpen(false)
  }

  const handleKeyDown = (event: ReactKeyboardEvent< HTMLInputElement >) => {
    if (event.key !== 'Escape') return

    setQuery('')
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <form
      role='search'
      action={NAV.search.action}
      onSubmit={handleSubmit}
      data-open={open || undefined}
      className='fg-search-form flex items-center'
    >
      <m.div
        initial={false}
        animate={{ width: open ? 'auto' : 44 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }}
        className={cn(
          'focus-within:border-fg-accent flex h-11 items-center overflow-hidden rounded-[12px] border transition-colors duration-300',
          open ? 'border-fg-line bg-[rgba(30,29,28,0.6)]' : 'border-transparent'
        )}
      >
        <button
          ref={buttonRef}
          type='submit'
          aria-label={open ? 'Search' : 'Open search'}
          className='fg-focus text-fg-ink/80 hover:text-fg-ink grid size-11 shrink-0 cursor-pointer place-items-center rounded-[12px] transition-colors'
        >
          <Search aria-hidden className='size-[19px]' strokeWidth={1.75} />
        </button>
        <input
          ref={inputRef}
          type='search'
          name='q'
          value={query}
          tabIndex={open ? 0 : -1}
          aria-hidden={!open}
          aria-label='Search products'
          placeholder={NAV.search.placeholder}
          onChange={event => setQuery(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'fg-search text-fg-ink placeholder:text-fg-grey/80 h-full bg-transparent pr-3 text-[14px] outline-none',
            open ? 'w-[112px] sm:w-[200px] xl:w-[230px]' : 'w-0'
          )}
        />
      </m.div>
    </form>
  )
}

/**
 * Page-level and sticky, outside the hero panel; the hero slides up underneath it so the bar can sit
 * transparently over the scene until the page moves
 */
const Navbar = () => {
  const { NAV } = useForge()

  // States
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Refs
  const headerRef = useRef< HTMLElement >(null)

  // The hero tucks under the bar by exactly its height, so the real height is written where the hero reads it
  useEffect(() => {
    const header = headerRef.current
    const root = header?.closest< HTMLElement >('.fg-root')

    if (!header || !root) return

    const measure = () => root.style.setProperty('--fg-nav-space', `${header.getBoundingClientRect().height}px`)
    const observer = new ResizeObserver(measure)

    observer.observe(header)
    document.fonts.ready.then(measure)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > NAV.frostAfter)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const desktop = window.matchMedia('(min-width: 1024px)')

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const handleResize = () => {
      if (desktop.matches) setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKey)
    desktop.addEventListener('change', handleResize)

    return () => {
      window.removeEventListener('keydown', handleKey)
      desktop.removeEventListener('change', handleResize)
    }
  }, [menuOpen])

  return (
    <header ref={headerRef} data-scrolled={scrolled || menuOpen} className='fg-nav sticky top-0 z-40'>
      <m.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className='fg-inset'
      >
        <nav aria-label='Main' className='fg-container relative flex h-[76px] items-center gap-6'>
          <Logo />

          <ul className='absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex'>
            {NAV.links.map(link =>
              link.menu ? (
                <CategoriesMenu key={link.label} />
              ) : (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className='fg-focus fg-underline text-fg-ink/75 hover:text-fg-ink block rounded-md py-2 text-[14.5px] font-medium transition-colors'
                  >
                    {link.label}
                  </a>
                </li>
              )
            )}
          </ul>

          <div className='ml-auto flex items-center gap-1'>
            <SearchField />
            <a
              href={NAV.account.href}
              aria-label={NAV.account.label}
              className='fg-focus text-fg-ink/80 hover:text-fg-ink hidden size-11 place-items-center rounded-[12px] transition-colors sm:grid'
            >
              <User aria-hidden className='size-[19px]' strokeWidth={1.75} />
            </a>
            <a
              href={NAV.cart.href}
              aria-label={NAV.cart.label}
              className='fg-focus group text-fg-ink/80 hover:text-fg-ink grid size-11 place-items-center rounded-[12px] transition-colors'
            >
              <ShoppingCart
                aria-hidden
                className='size-[19px] transition-transform duration-300 ease-(--fg-ease) group-hover:scale-[1.12]'
                strokeWidth={1.75}
              />
            </a>
            <button
              type='button'
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? 'fg-menu' : undefined}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(value => !value)}
              className='fg-focus border-fg-line text-fg-ink ml-1 grid size-11 cursor-pointer place-items-center rounded-[12px] border lg:hidden'
            >
              {menuOpen ? <X aria-hidden className='size-5' /> : <Menu aria-hidden className='size-5' />}
            </button>
          </div>
        </nav>
      </m.div>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id='fg-menu'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className='fg-inset overflow-hidden lg:hidden'
          >
            <div className='fg-container border-fg-line border-t pt-3 pb-6'>
              <ul className='grid'>
                {NAV.links
                  .filter(link => !link.menu)
                  .map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className='fg-focus text-fg-ink flex min-h-12 items-center rounded-md text-[17px] font-medium'
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
              </ul>
              <p className='font-fg-mono text-fg-grey mt-4 mb-2 text-[10.5px] tracking-[0.18em] uppercase'>
                Categories
              </p>
              <CategoryList onPick={() => setMenuOpen(false)} />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}










const TRUST_ICONS = [BadgeCheck, ShieldCheck, Headphones]

const TrustRow = () => {
  const { COPY } = useForge()

  return (
    <ul className='text-fg-grey flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]'>
      {COPY.trust.map((item, index) => {
        const Icon = TRUST_ICONS[index % TRUST_ICONS.length]

        return (
          <li key={item} className='flex items-center gap-1.5'>
            <Icon aria-hidden className='text-fg-accent size-[15px]' strokeWidth={1.75} />
            {item}
          </li>
        )
      })}
    </ul>
  )
}

// Entrances wait for the splash to hand over; until then they hold their starting pose
const reveal = (delay: number, go: boolean) => ({
  initial: { opacity: 0, y: 18 },
  animate: go ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
  transition: { delay, duration: 0.7, ease: EASE_OUT }
})

const HeroSection = () => {
  const { PROJECTS, DEFAULT_PROJECT, INTRO } = useForge()

  // States
  const [projectId, setProjectId] = useState< ProjectId >(DEFAULT_PROJECT)
  const [kit, setKit] = useState< ToolId[] >(PROJECTS.find(item => item.id === DEFAULT_PROJECT)?.tools ?? [])
  const [active, setActive] = useState< ToolId | null >(null)
  const [peek, setPeek] = useState< ProjectId | null >(null)

  // Hooks

  // Read through a hydration-safe query: the first client render matches the server, then updates
  const reduceMotion = useReducedPreference()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  // False while the splash is forging the logo; everything in the hero starts when it hands over
  const { opened } = useOpening()

  // Vars
  const project = PROJECTS.find(item => item.id === projectId) ?? PROJECTS[0]
  const customised = kit.length !== project.tools.length || kit.some(id => !project.tools.includes(id))
  const preview = peek ? (PROJECTS.find(item => item.id === peek) ?? null) : null

  const handlePick = (id: ProjectId) => {
    const next = PROJECTS.find(item => item.id === id)

    if (!next) return

    setProjectId(id)
    setKit(next.tools)
    setPeek(null)
  }

  // Stable across renders, so hovering one tool does not re-render every tool and the kit dock
  const handleToggle = useCallback((id: ToolId) => {
    setKit(current => (current.includes(id) ? current.filter(item => item !== id) : [...current, id]))
  }, [])

  const handleRemove = useCallback((id: ToolId) => {
    setKit(current => current.filter(item => item !== id))
  }, [])

  const handleReset = useCallback(() => {
    setKit(project.tools)
  }, [project.tools])

  return (
    <section aria-label='Build your kit' className='fg-hero relative isolate'>
      <WorkshopLight reduceMotion={reduceMotion} finePointer={finePointer} lit={opened} />
      <div className='fg-inset'>
        <div className='fg-container grid grid-cols-[minmax(0,1fr)] gap-10 pt-[calc(var(--fg-nav-space)+28px)] pb-10 lg:min-h-[100svh] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.55fr)] lg:items-center lg:gap-12 lg:pt-[calc(var(--fg-nav-space)+12px)] lg:pb-8 xl:gap-16'>
          <div className='flex min-w-0 flex-col'>
            <HeroCopy go={opened} lines={project.title} />
            <m.div {...reveal(1.15, opened)} className='mt-12 hidden lg:block lg:[@media(max-height:900px)]:mt-9'>
              <TrustRow />
            </m.div>
          </div>

          {/* On wide but short screens the board is sized from the height, so the whole bench always fits one screen */}
          <div className='flex w-full min-w-0 flex-col gap-3.5 lg:ml-auto lg:max-w-[calc((100svh-var(--fg-nav-space)-262px)*1.5+38px)] 2xl:max-w-[calc((100svh-var(--fg-nav-space)-232px)*1.5+38px)]'>
            <m.div {...reveal(0.35, opened)}>
              <ProjectPicker active={projectId} tool={active} onPick={handlePick} onPeek={setPeek} />
            </m.div>
            <m.div {...reveal(0.5, opened)} className='fg-bench-reveal'>
              <KitBoard
                project={projectId}
                kit={preview ? preview.tools : kit}
                preview={preview}
                active={active}
                finePointer={finePointer}
                reduceMotion={reduceMotion}
                onToggle={handleToggle}
                onActive={setActive}
                opened={opened}
              />
            </m.div>
            <m.div {...reveal(INTRO.enabled ? INTRO.delay + INTRO.reveal * 0.6 : 0.7, opened)}>
              <KitDock
                project={project}
                kit={kit}
                customised={customised}
                onRemove={handleRemove}
                onReset={handleReset}
              />
            </m.div>
          </div>

          <div className='lg:hidden'>
            <TrustRow />
          </div>
        </div>
      </div>
    </section>
  )
}


// The visitor's reduced-motion setting, unless the reducedMotion prop forces it
const useReducedPreference = () => {
  const { REDUCED } = useForge()
  const system = useMediaQuery('(prefers-reduced-motion: reduce)')

  return REDUCED ?? system
}

/* ----------------------------- Root ----------------------------- */

const BLOCK_CSS = `/* Theme roles (the block's @theme inline): colours resolve from the --fg-* variables the root writes from the theme prop */
[data-slot='forge'] {
  --font-fg-sans: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  --font-fg-mono: 'Geist Mono', ui-monospace, 'SFMono-Regular', monospace;
}

/* The utilities the block's @theme generated (bg-fg-page, text-fg-ink, border-fg-line, font-fg-sans, ...), defined here because the host's Tailwind does not know these tokens */
@layer utilities {
  .border-fg-ink\\/45 {
    border-color: var(--fg-ink);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--fg-ink) 45%, transparent);
    }
  }
  .border-fg-line {
    border-color: var(--fg-line);
  }
  .bg-fg-accent {
    background-color: var(--fg-accent);
  }
  .bg-fg-ink {
    background-color: var(--fg-ink);
  }
  .bg-fg-ink\\/\\[0\\.06\\] {
    background-color: var(--fg-ink);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--fg-ink) 6%, transparent);
    }
  }
  .bg-fg-on-accent {
    background-color: var(--fg-onAccent);
  }
  .bg-fg-page {
    background-color: var(--fg-page);
  }
  .pt-\\[calc\\(var\\(--fg-nav-space\\)\\+28px\\)\\] {
    padding-top: calc(var(--fg-nav-space) + 28px);
  }
  .font-fg-mono {
    font-family: 'Geist Mono', ui-monospace, 'SFMono-Regular', monospace;
  }
  .font-fg-sans {
    font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  }
  .text-fg-accent {
    color: var(--fg-accent);
  }
  .text-fg-grey {
    color: var(--fg-grey);
  }
  .text-fg-ink {
    color: var(--fg-ink);
  }
  .text-fg-ink\\/70 {
    color: var(--fg-ink);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--fg-ink) 70%, transparent);
    }
  }
  .text-fg-ink\\/75 {
    color: var(--fg-ink);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--fg-ink) 75%, transparent);
    }
  }
  .text-fg-ink\\/80 {
    color: var(--fg-ink);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--fg-ink) 80%, transparent);
    }
  }
  .text-fg-on-accent {
    color: var(--fg-onAccent);
  }
  .text-fg-page {
    color: var(--fg-page);
  }
  .ease-\\(--fg-ease\\) {
    --tw-ease: var(--fg-ease);
    transition-timing-function: var(--fg-ease);
  }
  .placeholder\\:text-fg-grey\\/80::placeholder {
    color: var(--fg-grey);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--fg-grey) 80%, transparent);
    }
  }
  .focus-within\\:border-fg-accent:focus-within {
    border-color: var(--fg-accent);
  }
  @media (hover: hover) {
    .hover\\:border-fg-ink:hover {
      border-color: var(--fg-ink);
    }
    .hover\\:bg-fg-accent-deep:hover {
      background-color: var(--fg-accentDeep);
    }
    .hover\\:bg-fg-ink:hover {
      background-color: var(--fg-ink);
    }
    .hover\\:bg-fg-ink\\/\\[0\\.06\\]:hover {
      background-color: var(--fg-ink);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\\:bg-fg-ink\\/\\[0\\.06\\]:hover {
        background-color: color-mix(in oklab, var(--fg-ink) 6%, transparent);
      }
    }
    .hover\\:text-fg-ink:hover {
      color: var(--fg-ink);
    }
    .hover\\:text-fg-page:hover {
      color: var(--fg-page);
    }
  }
  .aria-expanded\\:text-fg-ink[aria-expanded="true"] {
    color: var(--fg-ink);
  }
  @media (width >= 64rem) {
    .lg\\:max-w-\\[calc\\(\\(100svh-var\\(--fg-nav-space\\)-262px\\)\\*1\\.5\\+38px\\)\\] {
      max-width: calc((100svh - var(--fg-nav-space) - 262px) * 1.5 + 38px);
    }
    .lg\\:pt-\\[calc\\(var\\(--fg-nav-space\\)\\+12px\\)\\] {
      padding-top: calc(var(--fg-nav-space) + 12px);
    }
  }
  @media (width >= 96rem) {
    .\\32 xl\\:max-w-\\[calc\\(\\(100svh-var\\(--fg-nav-space\\)-232px\\)\\*1\\.5\\+38px\\)\\] {
      max-width: calc((100svh - var(--fg-nav-space) - 232px) * 1.5 + 38px);
    }
  }
}

/* ---------- Shared alignment ---------- */

.fg-root {
  --fg-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Measured from the sticky bar by the navbar; this is only the first-paint guess */
  --fg-nav-space: 76px;

  overflow-x: clip;
  font-stretch: 102%;
}

/* Inner padding: where the logo, the headline and the footer row all start */
.fg-inset {
  padding-inline: 20px;
}

@media (min-width: 640px) {
  .fg-inset {
    padding-inline: 32px;
  }
}

@media (min-width: 1024px) {
  .fg-inset {
    padding-inline: 56px;
  }
}

.fg-container {
  width: 100%;
  max-width: 1600px;
  margin-inline: auto;
}

.fg-root ::selection {
  background: var(--fg-accent);
  color: var(--fg-onAccent);
}

.fg-focus:focus-visible {
  outline: 2px solid var(--fg-accent);
  outline-offset: 3px;
}

/* ---------- Navigation ---------- */

.fg-nav {
  border-bottom: 1px solid transparent;
  transition:
    background-color 0.35s var(--fg-ease),
    border-color 0.35s var(--fg-ease);
}

/* backdrop-filter does not transition, so the colour and border fade while the blur simply switches */
.fg-nav[data-scrolled='true'] {
  background-color: rgba(20, 20, 20, 0.74);
  border-color: rgba(255, 255, 255, 0.08);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
}

.fg-logo {
  font-weight: 800;
  font-stretch: 118%;
  letter-spacing: -0.045em;
}

/* Grows from the left on the way in and leaves to the right on the way out */
.fg-underline {
  position: relative;
}

.fg-underline::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s var(--fg-ease);
}

.fg-underline:hover::after,
.fg-underline[aria-expanded='true']::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* ---------- Hero ---------- */

/* The hero slides up under the transparent bar, so the scene reaches the very top of the screen */
.fg-hero {
  margin-top: calc(-1 * var(--fg-nav-space));
}

.fg-display {
  font-size: clamp(3.1rem, 0.9rem + 9.4vw, 4.6rem);
  font-weight: 720;
  font-stretch: 104%;
  line-height: 0.95;
  letter-spacing: -0.048em;
  white-space: nowrap;
}

@media (min-width: 1024px) {
  .fg-display {
    font-size: clamp(56px, min(5.7vw, 9.4svh), 96px);
  }
}

/* The mask is padded so descenders and the line's own rise are not clipped */
.fg-mask {
  overflow: hidden;
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
}

/* Primary button: a highlight sweeps across the surface on hover */
.fg-sheen::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.38) 50%, transparent 70%);
  transform: translateX(-120%);
  pointer-events: none;
}

.fg-sheen:hover::after {
  transform: translateX(120%);
  transition: transform 0.7s var(--fg-ease);
}

/* Headline letters: a hover drives the letter down like a nail and it springs back slowly */
.fg-letter {
  display: inline-block;
  transition:
    translate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
    scale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
    color 0.9s var(--fg-ease);
  transform-origin: 50% 100%;
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .fg-letter:hover {
    translate: 0 0.07em;
    scale: 1.04 0.9;
    color: var(--fg-accent);
    transition:
      translate 0.07s ease-in,
      scale 0.07s ease-in,
      color 0.07s;
  }
}

/* ---------- Splash ---------- */

/**
 * Where the pre-paint script skipped the splash, it never shows, and the bench photo (the largest paint)
 * is drawn in the first frame instead of waiting for the app to load and reveal it
 */
.fg-root[data-nosplash] .fg-splash {
  display: none;
}

.fg-root[data-nosplash] .fg-bench-reveal,
.fg-root[data-nosplash] .fg-bench-photo {
  opacity: 1 !important;
  filter: none !important;
  transform: none !important;
}

/* The nav logo waits hidden while the splash wordmark flies in to take its place */
.fg-root[data-splash='on'] .fg-logo:not(.fg-splash-word) {
  opacity: 0;
}

/* If the app never hydrates, the splash still lifts itself so the page is never left covered */
.fg-splash {
  animation: fg-splash-failsafe 0.4s ease 7s forwards;
}

@keyframes fg-splash-failsafe {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

.fg-splash-word {
  font-size: clamp(76px, 13vw, 190px);
}

.fg-splash-heat {
  background: radial-gradient(circle, rgba(255, 129, 77, 0.16) 0%, rgba(255, 129, 77, 0.05) 38%, transparent 68%);
}

.fg-splash-flash {
  background: radial-gradient(
    ellipse at center,
    rgba(255, 214, 160, 0.95) 0%,
    rgba(255, 129, 77, 0.55) 35%,
    transparent 70%
  );
  filter: blur(2px);
}

.fg-spark {
  background: #ffd9a0;
  box-shadow:
    0 0 6px 1px rgba(255, 170, 90, 0.9),
    0 0 14px 2px rgba(255, 129, 77, 0.45);
}

/* The full stop is the brand's ember: it holds a faint glow and flares when the logo is pointed at */
.fg-ember {
  text-shadow: 0 0 10px rgba(255, 129, 77, 0.45);
}

.fg-logo:hover .fg-ember {
  animation: fg-ember 0.9s var(--fg-ease);
}

@keyframes fg-ember {
  30% {
    text-shadow:
      0 0 14px rgba(255, 214, 160, 1),
      0 0 30px rgba(255, 129, 77, 0.9);
    color: #ffd6a3;
  }
}

/* ---------- Background light ---------- */

/* What shows if WebGL2 is unavailable: the same window beam, drawn once and still */
.fg-light-fallback {
  background: linear-gradient(
    148deg,
    transparent 8%,
    rgba(255, 189, 133, 0.07) 22%,
    rgba(255, 189, 133, 0.035) 40%,
    transparent 58%
  );
}

.fg-light-canvas {
  opacity: 0;
  transition: opacity 1.2s var(--fg-ease);
}

.fg-light-canvas[data-ready='true'] {
  opacity: 1;
}

/* ---------- Kit board ---------- */

/* The board sits in a frame like a cutting mat, with rulers along two edges */
.fg-mat {
  background: var(--fg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.9);
}

.fg-ruler-x,
.fg-ruler-y {
  font-family: var(--font-fg-mono);
  font-size: 9px;
  color: rgba(245, 243, 239, 0.45);
}

.fg-ruler-x {
  background: repeating-linear-gradient(90deg, rgba(245, 243, 239, 0.28) 0 1px, transparent 1px 1%) bottom / 100% 5px
    no-repeat;
}

.fg-ruler-x span {
  top: 0;
}

.fg-ruler-y {
  background: repeating-linear-gradient(180deg, rgba(245, 243, 239, 0.28) 0 1px, transparent 1px 1.5%) right / 5px 100%
    no-repeat;
}

.fg-ruler-y span {
  left: 0;
}

.fg-board {
  background: #2a2119;
}

/* A warm desk lamp that follows the pointer; it lifts the light without washing out the photo */
.fg-lamp {
  z-index: 10;
  background: radial-gradient(
    circle at calc(var(--lx) * 1%) calc(var(--ly) * 1%),
    rgba(255, 226, 190, 0.22) 0%,
    rgba(255, 226, 190, 0.08) 22%,
    transparent 48%
  );
  mix-blend-mode: soft-light;
}

.fg-tool {
  z-index: 11;
}

.fg-tool:focus-visible {
  outline-offset: 4px;
}

/**
 * A lifted tool casts its shadow away from the lamp: the offset is the tool's centre minus the lamp's
 * position, both in percent of the board, scaled to pixels by --fg-reach
 */
.fg-lifted {
  filter: drop-shadow(
      calc((var(--tx) - var(--lx)) * var(--fg-reach)) calc((var(--ty) - var(--ly)) * var(--fg-reach) + 6px) 10px
        rgba(0, 0, 0, 0.78)
    )
    brightness(1.14) saturate(1.06);
}

/* A tool outside the kit, shown while hovered, at the board's own light */
.fg-preview {
  filter: brightness(0.92) saturate(0.9);
}

/* On the fully lit bench a hovered tool keeps the photo's own light, so it does not darken under the pointer */
.fg-board[data-bright] .fg-preview {
  filter: none;
}

.fg-tag {
  background: rgba(20, 19, 18, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.7);
}

.fg-sweep {
  background: linear-gradient(90deg, transparent, rgba(255, 236, 214, 0.16) 50%, transparent);
  mix-blend-mode: screen;
}

.fg-picker {
  background: var(--fg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.fg-dock {
  background: var(--fg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ---------- Navigation panels ---------- */

.fg-panel {
  background: rgba(24, 23, 22, 0.94);
  border: 1px solid var(--fg-line);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.7);
}

/* The native clear button clashes with the bar; Escape clears the field instead */
.fg-search::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

@media (prefers-reduced-motion: reduce) {
  .fg-sheen::after {
    display: none;
  }

  .fg-underline::after {
    transition: none;
  }
}

/* On a phone an open search needs the room, so the logo steps aside until it closes */
@media (max-width: 639.98px) {
  .fg-nav:has(.fg-search-form[data-open]) .fg-logo {
    display: none;
  }
}
`

const Forge = ({
  brand = { name: '', href: '#' },
  nav = { links: [], search: { action: '#', placeholder: '' }, account: { label: '', href: '#' }, cart: { label: '', href: '#' }, frostAfter: 12 },
  copy = { eyebrow: '', subtext: '', primary: { label: '', href: '#' }, secondary: { label: '', href: '#' }, picker: '', hint: '', trust: [] },
  categories = {},
  categoryOrder = [],
  tools = {},
  projects = [],
  defaultProject,
  boardImage,
  theme,
  splash,
  intro,
  boardOptions,
  shader,
  reducedMotion,
  className
}: ForgeProps) => {
  const resolvedSplash: ForgeSplash = { ...DEFAULT_SPLASH, ...splash }
  const resolvedTheme: ForgeTheme = { ...DEFAULT_THEME, ...theme }

  const value: ForgeContextValue = {
    BRAND: brand,
    NAV: nav,
    COPY: copy,
    CATEGORIES: Object.fromEntries(Object.entries(categories).map(([id, category]) => [id, { ...category, icon: resolveIcon(category.icon) }])),
    CATEGORY_ORDER: categoryOrder,
    TOOLS: tools,
    TOOL_IDS: Object.keys(tools),
    toolImage: (id: ToolId) => tools[id]?.image ?? '',
    PROJECTS: projects.map(project => ({ ...project, icon: resolveIcon(project.icon) })),
    DEFAULT_PROJECT: defaultProject ?? projects[0]?.id ?? 'all',
    ASSETS: { board: boardImage },
    BOARD: { ...DEFAULT_BOARD, ...boardOptions, lampRest: { ...DEFAULT_BOARD.lampRest, ...boardOptions?.lampRest } },
    INTRO: { ...DEFAULT_INTRO, ...intro },
    SPLASH: resolvedSplash,
    SHADER: { ...DEFAULT_SHADER, ...shader },
    REDUCED: reducedMotion
  }

  const themeCss = `.fg-root{${Object.entries(resolvedTheme)
    .map(([role, color]) => `--fg-${role}:${color};`)
    .join('')}}`

  /**
   * Runs before the first paint where scripts execute: small screens and reduced-motion visitors skip the splash, so they see
   * the hero straight away instead of a dark screen waiting for the app's JavaScript
   */
  const noSplashScript = `
  try{var r=document.currentScript.parentElement;if(matchMedia('(max-width: ${resolvedSplash.skipBelow - 0.02}px), (prefers-reduced-motion: reduce)').matches)r.setAttribute('data-nosplash','')}catch(e){}`

  return (
    <ForgeContext.Provider value={value}>
      <style>{BLOCK_CSS}</style>
      <style>{themeCss}</style>
      <MotionProvider>
        {/* The pre-paint script may mark the root before React hydrates, which is expected */}
        <div
          data-slot='forge'
          suppressHydrationWarning
          className={cn('fg-root bg-fg-page font-fg-sans text-fg-ink min-h-dvh w-full antialiased', className)}
        >
          <script dangerouslySetInnerHTML={{ __html: noSplashScript }} />
          <OpeningProvider>
            <Navbar />
            <main>{projects.length > 0 && <HeroSection />}</main>
            {/* At the root, so it covers the sticky nav as well as the hero */}
            {resolvedSplash.enabled && <ForgeSplash />}
          </OpeningProvider>
        </div>
      </MotionProvider>
    </ForgeContext.Provider>
  )
}

export { Forge }
export default Forge


demo.tsx
import { useState } from 'react'
import Forge from '@/components/ui/forge-hardware-hero'
import type { ForgeProps } from '@/components/ui/forge-hardware-hero'

/**
 * Forge demo: the original hardware-shop hero. The fonts (Archivo variable, Geist Mono; glyph subsets) and the
 * bench photo and tool cut-outs (resampled) are embedded so the preview needs no network access.
 * Requires: motion, lucide-react
 */

const FONT_CSS = `@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400 800;
  font-stretch: 100% 125%;
  font-display: swap;
  src: url(data:font/woff2;base64,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) format('woff2');
  unicode-range: U+20, U+23-24, U+26-27, U+2c-3a, U+41-5a, U+61-7a, U+b7, U+2014, U+2019, U+2026;
}

@font-face {
  font-family: 'Geist Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url(data:font/woff2;base64,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) format('woff2');
  unicode-range: U+20, U+23-24, U+26-27, U+2c-3a, U+41-5a, U+61-7a, U+b7, U+2014, U+2019, U+2026;
}
`

const BOARD_SRC = 'data:image/webp;base64,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'

const TOOL_SRC = {
  drill: 'data:image/webp;base64,UklGRhYRAABXRUJQVlA4WAoAAAAQAAAACgEAEAEAQUxQSCYHAAARb6AgbQMWzsJfRATk8ou00hwFbdswDn/aOxQiIqARVZ9pUra2vW3c/OMrANzW5KSsVY69Vp21anrTtPQyY3tKuvuUleuU9LhJOslqqszxbjrpbSKSwM3kUAp/4gePlxH9V9i2bUO1WPlEcrb/bdv8/yDhexWlnN2o3F2oAVzoexonsJkB8kTaQJzA4gbCBsYIGIHbuIH//w8pp4j+M3DbNg7VHWl+AnrEODc5B90zL87NNedmiif1YKbz4+PFdDp9yhzkwZLpdDqdX7KllFLuLAydIo+nRpuWJeSOZVmrrfZKsJZlWZYlZE87Pw2dJI3lp1q2jKSd2XN0L6y6ZMvo2lkYP5cOdHKAEjNVu34so83ZaQeaf/0UAYxznkrXxpfajpCqer5wWimWqtfrUysrK08tWypuUem10rIdR0gSPX+T5RiHklB/53IaghJ5JffdkqRajjYyHih1Mh1o7DGtU/qRxmTh0lyg1nw7kE1sy7AzitwTR0jizcZQ6Uj61SNgm1KDfnI0477Qgctimfe02EOwkXL/3bUoFHGyHSE1qYzCHmmzhzpKwpPa1CZCz1GDqw9nYhgaCTYNw1DEyPjxoKST8gXGe+on+0pJaKQiAqgstYOtvtrL6Hw7rJvMkZA9fco553wAYFg8a2mzX5nos+Wzmenp6enzPLklNerV9WX5v/210hKamRLButS/isjoxoCa6IqQ+tekYH5p74XCg5jQ8OMBO+jLcRwt/aB3Fs/Pp0ebOn5URHBb9PHLCWCpsem5p0IzJREktvustwEAgPPUvmYKIoDkVLMdaPUs9HRFp+M14OZgsIFeiW3dfLiyr5NgP87wdOLzCK5OnPk4tq+Tjj8ObuukpYgyOg2aGOyhRuoYkOnoYxEFcttCF1UcqGzrYhYJykd6CJNYrKLHchlFN3ysg5bjsdyWoG9OY5R9QnsFJ6OUvD43Nzc317F6sh1q1mYcwDjnnKfSPVWnPGLnFQnFN4idmRRoCEq2hySWcUhpn7McGPbJ8DeSD7BrVL6eryUfOl9hK/0A3KZwe/pyJP5Ag8BzreAPIOMr509IQ0ZXue9MKlpXzR2Sjm4pFm5ISSXFg0ejguLByzs1PVT6d0V6agiF1ob0ZBwq/DsmTT1Q93fDqpSVPX8bUhVT9dwckLLuqOFPSVsZX8m+YXXYpgJB4QPQ6Dgiag+GNJasPY7Y5oCUlj2M9u+M1DbsRWltSG1s0o9QRYozNiN8F5pBObrD56qx6I7ekOquRGbJuiUiezakO9aNSq0c7Eel1G49JjyIytn/OutRKbTbj0iwyrFuPDDceJDwY4KIyFAkQpkIi0SolTOOorJk5ediy7IsS+D12rFkoVAoHOD5jBC6jT+ChZC4b6MVEICNNLGfJYGUvO/jLFCAcQ13bWCAsYnSMs4po746IAx1OIMDbmP4HEhDIAQLJIMZhAJIwsM8p0BYF2MOBP7BaJDsYnQMZB3DZUDWMIIF8ifGUAC5hTIHchnlB5APBEZv0sBnODI+RpjgSHioQYnDcFFqHKyL0uKAPZSOceyieIPjT5RgcdzCmeD4QKDWFEfGR5njMDyUBQ7WRWlwwB5KyzgeoPRALqO4DEdJYPgch+FiBIsD9lAKIA9QgxmQBmowB5LwMD4DYfsY9zCwgwbJ5dADKKgBGraBsGKkcwuhg/JV2AGcUkzI+PHAcOMB7IfXGyjr4bkMyoPwfA7lSkyYeKFQEvEg44cWbCJMoBhePGBxwQ1tmGI5CO8TFNgPb54IdSK0idBxGjiTBj5Lg2CRMDe84QyKh9ByGjiYBQ7YmPBDAxtLAsMf4swPJapHg2LSk6j8JcYVyx5KZNvzXfU7M1W71JHonn8da75kZnpsqWU7MoLC0zlr3VXrl5q2I2RUbRUeczBfmArMIm17ok3l/ortODL61pkmzBw9lqq604OnRpdsqayNkg8zqzc6jlRYKFUwRlu2kGpbGgXMe7ZUnrcK/h8LSaBK3iSJPSxZ/HsoSeRzaVeEpFEpjO1LIv0QVvKp6I2sB5JKwYoyXDKGM1ETggjxxTqVLbog9h682ILYexhmojOlFnKYKym1YjEJnxSXiSkJSamwI2ZC0mou5jIx94mw4jRwRsqfxPhcyhoxwf472iVmKISwfWrKRKik/EvNDyGGS82KZSQ8apyRURLUBCvjsiTXVMYaPZUItk/PkkV06fGZBMOlJ0xSQGRBVZMIHQtgXYJ6I2GfIJdJjHsxYTcm3IoJJREPDDcesD16eiMBbtPTsYiMR04rgz0ipyaZsj41UwkUD2+FQPmIlo5JqspyyyHkjsRig6nR5aeCyvuQRDOr920alyWTcCw3NrVkqz8nJB/jZq3pCKXCNyYdJUenVvrUsp3QScdxQu0HQ2pig/3KF8I0NlQr1qaLhUvTvd1sB5t/fY9wYgAAHIDxPqXSgU72TAFWUDggygkAAJBNAJ0BKgsBEQE+0WKoTqglqKMndPtBEBoJZQc7wRnjPGDl7kl/M8QBNw/8rYoXSxX/40H/+IG5R7g+2PuR2ZKDsB7aXH1Dhx1leW/K//uSvItvo5P66RYr4oZCgUNNTUC29fBL5YUIayCM9yJLZo+q1gBJi5MFZPJIF2Agx9muYZFs2Ro655NjShVgzgi6zdMin0734efFR72x+QFLC89Sd/Z32gLo3RD+buj9wQVuRByrrBytlWGcfkNEIb6yX8z4s/8hc2ybiiZYcj3qp3gtoTA+zg+xpZ9kLfQQfh8v3OXK/kWaZPCd483UhYiSYK4kZjBApsqNs8DHkVS9+MP9sKB8GwL8CmBoB3DtmnE5+yOnz6CFU2CHq3ZbamfPoeXxO8hODGvMV6u+crcrOdxcEpl7A2ImXbYqSlkQ0Ot9kGJcXRlIbDL50gxv/m3YcdypeTnIAl7Kr8+7CL3cxZ/1jakAWgWdMLQLN+uAsBJQhoTESqrVwln7OP/rKxIZeRgoFYNakY6EdpBeXlAqF9uIMmfWt38auTVaFWMEwZZorXAxJHcnouTPfoW00Z32rUfB5jgS0t0oRviGFJhaBZvXggjfoqNVTPOMSjNazV+DWS0IX0sgTk0SvddooY8kEX1k7OmyHW4SHAmdLk6EGKqNcj2Q1GGfFpkXHZ/T61u+ees7XnWjp39A70kBDMfSXRW9/mP91w+F1speSrFDod06pJha9YZTIAV8/GsXq0JBLXRp4+F+ipf0nGpyCn+CXWD6NjR/PreF0hqfcussgp1LNByM2AMsaLFX3MuJCZwCB8EJqsSexYFbPnJQpfnhJVQjJVwAAP7p3jHSXQtg2ywMoZe2rsyzMMmWTvWlvAeTTLEhEb1sq7vlFm3ojTtKxz+7RnWlV9spNGnhPMR8sRWipR9vjtLzWz5nDUqmUq2rsWqGSIJoOdi9hd60ZjjwBgRJgd2chU9l2qDais4Mg6IFxRSz8R1NBNn8ou2DwmuB4LtG24w3/U36x9Bqfg2+cs7WLbe51RSv+BLrCPC2jiXAdMe6E9hfXTpJDS9iKo1qlLbcGDZhpzvkXUGqldkYpeSU2JntrYGmnyr+IrOyn2EFmK5YPBURPDnTCM2GVRnKCALgQB2JcI9lQNpDqa9YZ+O8dWpmY3InKS7ukhpgRA6GEGR5eHgUXEScxJ2g0pT40Fw43nBHAQ4/w2lpYUhFJlG2CH+DV2DPPOJB0dLjGPcTc9TFFKecuVKoZMrrFmfA8xpWozF1zUkypg+kLAZ9I0dN/me7wgWX80c48g5hAv7DUhp3wqSrFaTXCM27ZiFM94tpjILaSABGvRKmXwn0W9KYpsNgMzJVzhZJqelYI9025olKFmO6QYVQQkOKbt4KOvleF1qRk3N6qGYyZAfZ3PExOYnaSqqOqaZjRS5Af7nvGY4pBGaWN9L4jJUvYI+dyTwdpIqCZSsrh+vqEqY5bNFUGoIrg1aeI3HzXKxPVSJgsj2ad3XFJP4iWyOTcCg5g+UhJPIMYbc/yUC+gO5v38mr4gLMg01xUikYcSgwyqCnHb0BWenU7GxtBIHPLVcm0jEmgZjJvBTpSgD5CQO9vTsn9hmm0hhUfmYkOhuzSylm5OKrmxTDZk9qBpj7Nk70aPV4rd1mjstfPd3Fw0cdfP0EiNH8e/YJ/sbJaNU0qBUhRiutur0kZJXiAyM8glIzLuRCRGsE+MSB2zJN+2cR7oDJFr2J3w4RxonLVXb4LT4LLg13NY5m30Rc1+p9ra3iTTnWaKwW4F6tSahAcpD/1uB3ILuWRUurapGVgEEc/XJZv+GJPKx6H/mj/P/MECi3IrERcunHcW7r8YDHbVwGjvzdNjo5LOehhGnDXycLWlz5n4Od8gBt3nvcpHLWQlZyhJXIOPvUCjsSFBrbSgWqCnNrHcXs5hFCmPdtIZE5QC1DrlSzqNOGr6YUFsv1lrbjBZ+RjcsJoGEdZ8sfSSkvQT7/IsH9wU3Rpp9mC6WeoJH0NCTFnBtFHgSAUn97Ed50C+2P3tkBzzBV7He7e6JxOFC77NAUczCvn1KLcY/AVtgifm1ihhfj/q8epOuJ/bLnEhAZ0FgWmPjqjHEsj0Liq1eOZu5eQDXeBy4kuyGkzWHtfPOW4QcE/P3xpeahYoO2rj2tgImmhuaHRICbzjNwUV5hFZ1B6huUK2+gsoCvwKyhojxfYAiHoKbc6E4vlQ1IypGvp1ZFCCaJ6Hh6EkoI1rZm8GzDArWbSfkQjzJ6FTYijTGSfMoCajkTxMkAoUeCH6nCvwqG/r7J/95KMJZHPa8MxcVFVPZyPbJNRZjv6ZsxhrvjGeDMnBIOu3L2OLlPAFVU9KmRVWtlUMoaf/M2heTjJl6ArzhH/fwo9fGYRb1bOCq8E8LSrz3ZUkDUjCZz9GeMP9SvKtKblXqFbjiXoYbcJftDVnRqsO6wY9BUGc/IRZRM2ga8/N7s9OdGaLWCsFYuGUiPI76JcXoNpKSMfRUv8Rc0/9qfUp/a3/a7Bvj+D5UbB7a7/SxCWjvhkz2DccdQwufBJq/o/J9+7QLOTk6/UAlfaZ8kUophFd9QGvrpWmr/UQvBXpc5ARHUtRJX1V2wY6qa8m9gStFwVh5ul9Z9fpwjhZTAmR54nDBYg/0ynue7cCZMaASaXMm2iKLp0e9T4fIqq/PxeSCbXTZEoDIyAeMF+wObsV6SXML9AnSWURZfUADW044RmrBbvI82o6ocvtfatDU8sOhmdUJeRrXPigiwdFwZGMDM6zyxp94tPcbz7seSGhKqaYZzmarCEpmE/GbzgArCHMCx2cMr2aefznNwDXxF/buejkkPnhB+TITIwABMwGaWbCgA3Wx0atxqDQFSsZnY7pb/DRGPc5G1TfENmGLO/Gb4DNF+aJA6A21I7CWL6dcasalE6SuHjkk7y5gzJMue5BHDgXeGtsT7nVAkN+CevOFa8gtGoA275hdQcbuvU9OQUepQ4qg09forDCZEuqaNfugGgbC+47b6spgSyGANXlewGjBPz424wBnyFgzNfjK5h9lpapB8Upuzw+FDSM18VrIV96l5Gghzsyq9cbHzIOvvivEN3EiS2LvCTwMaRAafPHAiwfjXVegbQ6ZF7l671Mg0hTB6cTQdgH/25HzRkkSt2DR/DsNERF/2ykrDh9FIXKr6eHYIjQm001TfUsIUJT1bJbIs04LL64NCkNj1QhBwd+wrHDgH6jCfFFkYeNc9a3/8BL5n/QlqENffr9+dEqf58kboDWwUYKsrqnJ+D6y4fIr12q3z+Jtq1TOLWpfVOvjRvOx4Q0X+o59E6VkEZxAirp5oW39M7S54Qf/jIAA=',
  bitset: 'data:image/webp;base64,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',
  auger: 'data:image/webp;base64,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',
  square: 'data:image/webp;base64,UklGRoILAABXRUJQVlA4WAoAAAAQAAAA0gAACAEAQUxQSCMCAAARb6CgbRs2VAbdvxERCJWeID/dHXL2/zMk6V818wKqZ+8uXveE57twcbZtG+E9j22FNgfnCJ0Nkq68B/9X03gG9Vsjov8TQNS6oMazycBX/tX4uTBQjmuclQbK18qJ4dDxoRFVAOIBKU2moRXI9DKOngq+rByMODEcOj4YyUogYmIwL4GcoKGdlxKHXoqDd5intYRjOpA9VRxnJyy3B8iaCo6eQcme6mCkpzKS52wVx1ueaM8TIGerg5ErjOPtCIQnQM5Wh0uuMo4/QPJj9uSA/Abydlyud0D+APkN5B2QXzhUHoiHg/4AeQfkNw5VAOKNpDgvcLwclGRjOHQSB9+XOHTSsixLQOAXh/wxcxTrwa5/aXuwIKK29qj9G+spa0L5ugQ6qeCtCxYc+JKK+tet5/wmCdeu63LD3pfN1dh6qYDBmSk4eHuHgOGkpsFgPi5x6G0CBmen4uDlIpoqmsyxo1HeZHxe4tB2JFU0Gp+XUaaXzabtKK0ls/F5GUEVDKftCJQ3HJ+XYapgOm3j4PMyhPLG0zYOPi9xaDtIFczH52WQB0DbOPi89LWWEeikb3oFAZ+XOLSNg89LHNrGweclDm3j4PMCx0s5fNJawqE8FFnZU0HhxK9WUWTiH7hhtRuo3Zpmntb+a/rpnUOHDt06N1v0fk0F/0/duV3fzQsWHFi44MDmBTWd3V77mbPbE0RkJYho5qzghbMSVn0FkSJSgpoXAFZQOCA4CQAAEDwAnQEq0wAJAT7RZqtQKCWkoyTyOoEAGglnOtFuu51YbXvbMdVk1lYesmq2xsaRdbqmI3RZm38fuYPzGKWrg4l00qDVi7zyR9YhGND0k0rRXYB20T3Wu6rmvlDhVftEqN+QWWBdtGbVObPc0dWmFBt/clZSmUHUpsd9GCkhrPrxOpQxbpNVxOjEkvpWSvyJOm/Tu+MbeE9Rc6ZQwCSmfzZ8J5HCeu6GEfQxbAh6aWfFH2IKMABVpFQzDAy4NhOswH3HjdGy3rw/0buAyy4/73qtajNjwXDmkjGL/eBw6nG8Y5vI0eFZK/IL80ubieIJnSunf/AOl3/9uKk0KsyGixCCVkD+NEf/bhV8L+ifSslb/rlDN2hQJnZBQViPrSG0T6VkcjhcYYO53omo5d+wsffpCV0DL/FbjwXK9OdtbkO3slSSwD4v7EPYVjGJXlrf4d2Z1rEKGLszT0Que/Uw0AXiVgy6N1Zl6fEbiHxIIoVvHxkWE93rGsrWNjzhsa7pqlec0dSdFECFBaPT4SXe/UaoynocS0YGnE85+BUpy+6IvnKebxTOMayzn3i1LPYx5jZpLbN28uggh/RzI6afaHICV5saieB/gzPZEssAYQZkKGiKr1bDecaGRFOAwPUxC0eYyqofCnXIAPw5l89ZnMlzQmMv88ps0noWdV0Q3BIs/2NEGIUlyjj8f7Q1LVv9P6zej3UTsrGaTlKVulkg2Zw8dYFxwFc+S5VAih5whIjylJDCoWUWc9ZTPRU8EAeAGam7k830Dv4coyOE378PiLw3a48OMSABBX1jO1necl7nPkUQx127Z9thJcJ5jByJsmrIxMRH0Rxao3ei337RNNGOPLNYajjpRBOLB+8/28hIXUhtVxffYGGy7HG09/HrDR1oRggdzYLDSKirztRhDpW+kVn1DeLqXsdETxDw3kx0PWO/EXh5Ig00S9CMgz+H3FjMWlaxnP4qy3/34l7sM/9RtAGr+t2zTjAkbBKgvezcd+TJGKdvgibkluBytsHgbmLJj+TvIeMX7MdUY8Y26FWFE5HmSXKQxLlYEaoenCXk3uGW7yeTOWFHHmIVY1NVSegV2gyLY6tyor49sKelO1qQnfnZxMiSa0w7DR43KPO6dezBmoKZYNvSyc24vy8oRy5lV9oNO5Z8Pa1NIo5/S7cydektIsN35FvEmfIxtU75Fxpgf/+EvJ8D3lQNDxF7CxJisdGKv6E63+hfJdp3zU9yFcZl9UQC8wabapeocsX6JslCR3IcXkRs4g9JJslVHqlvRvZNYqbeKlhS7fuq7Du+0rxlIECjUaEiBUlE53/p42f8h3dBW4qVVXjsL2BTnZgo96Io5n5h6f/zdM+gyBxkkAEzgiGhF6q2W/ahzT89VOzswRhJiFC2L3bZr0u6rkXl+/udGV/KdblC4dLNhEO3Dec1geFmQN5HWjW9FTuVrWns5Wtd4gGaKSxRz7dEwe2/qLWLckRLnnLkFJURgGJ0CDMM4ThOyOgVxnOJyga+jEZMu1c/fnJa8LG4aBAyPECwT/mvyHxLpK8N1F3mWAUuXU0zOHGrs01QvYb7mEsKSgzXCZIeUv/SGWF4srYUlu2z7CmkbIbknpRj+3wMsMYZ9ri2UkRF1E+AdYSCiNGjU5nMIQ0RdlJ6+8Z30ooxZNqUwAmpItaiOOEdcdpycW/F3VTVKXaqoLu82gRYVWvey0gCo65IHiiesEkWg8lEZi5GBXrVbhrgf5g5gPlwEnmmcXILQt2xnqZRNaHdlEcnDUjvy/svpoEKQAAAAZHp0jaGcnhVmDuY0V8m8UxCjWWcDLzD0x/AiDUCVpfFr6KgUV+rP1SvWn2FG+ozStcyN6gxcssPDS3nudYea1F6vOqGwzi6qcXdCVNBm4bVUN06YH5eQ9EN9rr7mGHABdlbMltuzIi29XSpoZxmwKaExXw11d88nDwWOZ7dmR0EZKDszngjyvVZUeKvCLJCDu33iUF5eHuuH94AZvmQFWpTl4d0sGbaAnDbTMsMs8vaMIOnmiWfJqTEpSCMr91MzXrByVrCy9/yh2qkYQYsEFFfJaGS2t7eRqqIfWRtWFYTWmaJmDI9zXybBixa0tgcSio4pFUPPwy87NFdVVAYWtPIxKiQnAr1Ovb7T93HK5ZsMpUq92Y3NfASdvk7MedpNwfH+POYSk1ytLq/EtWPjdHdG9DHesDrdgs61jC42vKu8hDmJ7UtBWD4WA9xVFaY8rjfS2B9zaAOHNwmvQwiAwZ990BfjBkB6+7s+2KieDzNu9W84Dc4z3Ly5BZjthjYKlpQNXPZFD905DZazVldfSBPW8k01kMoylAuI0jL0ikXLloqjnz0Fj8DfRdnWMzpTRXE5KYGUiLJmEwqQj5qk67uuhQYMofxHKUd+z+7fFTdBKGAuZ/PB+rd8+7+INI6nL9TZChroIIxmlsK2BzZpNdwYLjmRvzvvCQ911Otm164isP8DbvjUNFr116Rw+JO1Za6M6AcGSGHM0N+KnFVH0wB3XKbyUYyssETuELaTGzeCHRG51iPtiCTiOs2sr+Rfc8HuFVOqbLIz78diq9BN2dtUhV1UM4e7CHQEkGq7uwE1FUKAbI6jcwvH0gFRqQqINgOtOKW5Lg+Suw9PzavGs6b/XvVwRXRt/xGNOacMnI1UwFBGgam6vIa8JB6u7ChpTXuVvHr85NP5XyIpFtmrjafs5vg9xvlTiPYx6bhwEKrvlQ3e1fFhhz7PaM1JMePdtOg9nsBaTj7vYad4lPuAlvxXmo3yQtHKh9d8LansXg1qcIsbVJR4QI04jurSvWjsKeHc0owd/N+pUbJXEml0KccqtqHi0SuVnA1jWLH0IWXCkByx3c5LABto7KIy5WGmUuk7NlYgzGphchQcnypxEBb5KHsY56DduXh6UEUMQQFSBKrB/rksij0XnS71murbUechqnjmkHZTB7pN5opDNrhkAYwZ0qIEyPR+Se/EuxhADbREbKWwqFFZfU7gA6ODk2nRVciLCX4r3g1J1UEJ7BDwEydcyHDdOJgvRjnRcrkpaS9zMEuGrgsBQH8Bvbv1p91iIwGFL0RyCgYzzngCTZ5/amIpFLTfKx0gxuLcr34RQy5qBr4pTZslkPaqzyyePnzClW1AXGuMAA=',
  pencil: 'data:image/webp;base64,UklGRoYCAABXRUJQVlA4WAoAAAAQAAAApQAAFwAAQUxQSB0BAAARb6C4bSQ1tW/G44uIgFxjesvL+o2Ao22z6mRuVnAGbXlSETqntUt6XDrr6GKDVS47sMq9cjiXPjLZAJyzmmtJmAVE9H8CIDY28GgTIiI04Dg17sH3MRFRf2/s5jCVDOx558Y1tsrM7OnYq4mQofuHwD/7/39ag9S2sWJW2wNUtmQFTflUrmwk6fKNV6yoAZdWno6iQBkj0JuVRxUFGvoV6MKIo3qKVpzMlxEndamZvQozm/9xfnLyrbVmZq11hf1eW7dboHSeiD6jMIdU2dTJ60wmR113hYjGXDdH/tkEgEJQiDh8GHEmfxi8Nn1wGPPORHtOOxCIiACg0O9AVIzoYDhg3O5itC0HRHyJ5A2CjIvfOuKCI4RyozZDrQEAVlA4IEIBAAAwCgCdASqmABgAPtFepk2oJSOiLRjpOQAaCWIAwniMdkQDDigQDCHHz1AMZ9Km6YXfEog1LyX8smwQt0UL8py6XMGiZfZ4ly2+pimtpj+c1UY8QeatGyX86tAA/tjiKrQAcVQrVWudYE/KyN2CBxeWCHe82iQL7fiuZQCzaMpCgU61I5y6HHYMXSlDoj7FSFqQmmmSuctRMCWgMYp0U4NTGcbSgsAvX+xGTyqNalekBwhhqq63c2zp+CVYxwxcJOIK/t6om+RzS91j7OkpPerytXlQ8tELvu8BfODtAGWr6RIWD2Xj/IJUD+QK02Z1Am6R5BpBdEth2ianhU+ihYzMTQl9hjblkPQxXlcBwdRYcBcBGRgD0qD3oZOAr6ckLD7c/GjB4BXa5M7nxxDhxGK8eycLatshbH03iPqbow0FwAAA',
  handsaw: 'data:image/webp;base64,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',
  springclamp: 'data:image/webp;base64,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',
  hammer: 'data:image/webp;base64,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',
  barclamp: 'data:image/webp;base64,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',
  fclamp: 'data:image/webp;base64,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',
  glasses: 'data:image/webp;base64,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'
}

const categories: NonNullable< ForgeProps['categories'] > = {
  power: { label: 'Power Tools', icon: 'drill', href: '#power-tools', blurb: 'Drills, drivers, bits and accessories.' },
  hand: { label: 'Hand Tools', icon: 'hammer', href: '#hand-tools', blurb: 'Hammers, saws and everyday essentials.' },
  measuring: { label: 'Measuring & Layout', icon: 'ruler', href: '#measuring', blurb: 'Squares, pencils and marking tools.' },
  clamps: { label: 'Clamps & Vises', icon: 'wrench', href: '#clamps', blurb: 'Spring, bar and F-clamps.' },
  safety: { label: 'Safety Gear', icon: 'glasses', href: '#safety', blurb: 'Eye, ear and breathing protection.' }
}

const tools: NonNullable< ForgeProps['tools'] > = {
  drill: { name: 'Cordless Drill', category: 'power', href: '#cordless-drill', box: [69.312, 37.242, 26.937, 41.276], image: TOOL_SRC.drill },
  bitset: { name: 'Driver Bit Set', category: 'power', href: '#driver-bits', box: [57.438, 52.158, 14.312, 25.235], image: TOOL_SRC.bitset },
  auger: { name: 'Auger Bit', category: 'power', href: '#auger-bit', box: [50.813, 41.276, 2.562, 36.961], image: TOOL_SRC.auger },
  square: { name: 'Try Square', category: 'measuring', href: '#try-square', box: [28.188, 59.193, 21.312, 40.15], image: TOOL_SRC.square },
  pencil: { name: "Carpenter's Pencil", category: 'measuring', href: '#pencil', box: [77.5, 27.767, 16.688, 3.565], image: TOOL_SRC.pencil },
  handsaw: { name: 'Hand Saw', category: 'hand', href: '#hand-saw', box: [43.625, 4.972, 50.438, 21.107], image: TOOL_SRC.handsaw },
  springclamp: { name: 'Spring Clamp', category: 'clamps', href: '#spring-clamp', box: [26.875, 3.471, 12.188, 30.394], image: TOOL_SRC.springclamp },
  hammer: { name: 'Claw Hammer', category: 'hand', href: '#claw-hammer', box: [9.938, 42.12, 18.25, 57.88], image: TOOL_SRC.hammer },
  barclamp: { name: 'Quick-Grip Bar Clamp', category: 'clamps', href: '#bar-clamp', box: [0, 4.221, 20.562, 95.779], image: TOOL_SRC.barclamp },
  fclamp: { name: 'F-Clamp', category: 'clamps', href: '#f-clamp', box: [60.312, 83.208, 32.875, 16.792], image: TOOL_SRC.fclamp },
  glasses: { name: 'Safety Glasses', category: 'safety', href: '#safety-glasses', box: [36.562, 45.028, 8.812, 29.644], image: TOOL_SRC.glasses }
}

const projects: NonNullable< ForgeProps['projects'] > = [
  { id: 'all', label: 'All tools', icon: 'layout-grid', tools: [], title: ['Build', 'Better', 'Every Day.'] },
  { id: 'shelf', label: 'Hang a shelf', icon: 'panel-top', tools: ['drill', 'bitset', 'square', 'pencil', 'glasses'], title: ['Hang It', 'Straight,', 'First Time.'] },
  { id: 'clamp', label: 'Glue-up & clamp', icon: 'wrench', tools: ['barclamp', 'fclamp', 'springclamp', 'hammer', 'square'], title: ['Joints', 'That Hold', 'For Good.'] },
  { id: 'cut', label: 'Cut to size', icon: 'scissors', tools: ['handsaw', 'square', 'pencil', 'springclamp', 'glasses'], title: ['Measure', 'Twice,', 'Cut Once.'] },
  { id: 'starter', label: 'First tool kit', icon: 'library', tools: ['hammer', 'drill', 'bitset', 'handsaw', 'square', 'pencil', 'glasses'], title: ['Your First', 'Toolkit,', 'Sorted.'] }
]

// The preview renderer photographs the page right after load with ?capture=1; it gets the settled hero (no splash, no entrance)
const isCapture = () => typeof window !== 'undefined' && /[?&]capture=1/.test(window.location.search)

export default function Demo() {
  const [capture] = useState(isCapture)

  return (
    <>
      <style>{FONT_CSS}</style>
      <Forge
        reducedMotion={capture ? true : undefined}
        brand={{ name: 'Forge', href: '#' }}
        nav={{
          links: [
            { label: 'Shop', href: '#shop' },
            { label: 'Categories', href: '#categories', menu: true },
            { label: 'Brands', href: '#brands' },
            { label: 'Deals', href: '#deals' },
            { label: 'Support', href: '#support' }
          ],
          search: { action: '#search', placeholder: 'Search tools, brands…' },
          account: { label: 'Account', href: '#account' },
          cart: { label: 'Cart', href: '#cart' },
          frostAfter: 12
        }}
        copy={{
          eyebrow: 'Tools for real progress',
          subtext: 'Quality tools, trusted brands, and everything you need to bring your ideas to life — at home or on the job.',
          primary: { label: 'Shop Tools', href: '#shop' },
          secondary: { label: 'Explore Categories', href: '#categories' },
          picker: 'What are you building?',
          hint: 'Tap any tool to add or remove it',
          trust: ['Trusted brands', 'Secure checkout', 'Expert support']
        }}
        categories={categories}
        categoryOrder={['power', 'hand', 'measuring', 'clamps', 'safety']}
        tools={tools}
        projects={projects}
        defaultProject='all'
        boardImage={{
          large: BOARD_SRC,
          small: BOARD_SRC,
          width: 1600,
          height: 1066,
          alt: 'A workbench with a cordless drill, bit set, saw, clamps, hammer, square, pencil and safety glasses laid out in rows'
        }}
      />
    </>
  )
}

```

Install NPM dependencies:
```bash
motion, lucide-react
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
