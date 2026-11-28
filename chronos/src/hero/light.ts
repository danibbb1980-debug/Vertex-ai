// Luz de janela em WebGL2, portada do WorkshopLight do Forge. Carregada em chunk separado.
import { HERO_CONFIG } from '../config'

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

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
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
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

  // Feixe frio vindo de cima, à direita, caindo na diagonal sobre o traço
  float sway = sin(t * 0.07) * 0.03 + (uMouse.x - 0.5) * 0.08 * uCursor;
  vec2 dir = normalize(vec2(-0.55 + sway, -1.0));
  vec2 origin = vec2(size.x * 0.86, size.y + 0.32);
  vec2 d = p - origin;
  float along = dot(d, dir);
  float across = dot(d, vec2(-dir.y, dir.x));
  float width = 0.2 + along * 0.24;
  float open = smoothstep(0.0, 1.0, uReveal);
  float reach = width * mix(0.04, 1.0, open);
  float shape = smoothstep(reach, reach * 0.3, abs(across)) * smoothstep(0.0, 0.35, along) * exp(-along * 0.5) * open;

  // Persianas: barras de sombra dentro da luz
  float a = across / width;
  shape *= 1.0 - 0.5 * smoothstep(0.07, 0.0, abs(a));
  shape *= 1.0 - 0.35 * smoothstep(0.05, 0.0, abs(along - 0.85));
  shape *= 0.86 + 0.14 * step(0.5, fract(a * 3.0 + 0.5));

  float beam = 0.0;
  float dust = 0.0;
  if (shape > 0.001) {
    float haze = fbm(p * vec2(2.2, 3.0) + vec2(t * 0.03, -t * 0.045));
    float shafts = noise(vec2(across * 13.0, t * 0.12));
    beam = shape * (0.5 + 0.9 * haze) * (0.72 + 0.5 * shafts);
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

  vec2 m = p - mouse;
  float glow = exp(-dot(m, m) * 7.0) * uCursor;
  vec3 col = uBase + uLight * (beam * uIntensity + dust * uDust * 0.5 + glow * 0.04);
  col *= mix(0.72, 1.0, smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.2, 1.0))));
  col += (hash(frag + fract(t * 7.3) * 91.0) - 0.5) * uGrain;
  fragColor = vec4(col, 1.0);
}`

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s)
    return null
  }
  return s
}

export type LightFlags = { still: boolean; fine: boolean; lit: boolean; mobile: boolean }

export function startLight(canvas: HTMLCanvasElement, getFlags: () => LightFlags) {
  const S = HERO_CONFIG.shader
  let teardown = () => {}
  let sync = () => {}

  const setup = () => {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return () => {}
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()
    const vao = gl.createVertexArray()
    if (!vs || !fs || !program) return () => {}
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {}
    gl.useProgram(program)
    gl.bindVertexArray(vao)

    const at = (n: string) => gl.getUniformLocation(program, n)
    const uRes = at('uRes'), uTime = at('uTime'), uMouse = at('uMouse'), uReveal = at('uReveal'), uCursor = at('uCursor'), uDust = at('uDust')
    gl.uniform3fv(at('uBase'), S.base)
    gl.uniform3fv(at('uLight'), S.light)
    gl.uniform1f(at('uIntensity'), S.intensity)
    gl.uniform1f(at('uGrain'), S.grain)

    const target = { x: 0.7, y: 0.7 }
    const mouse = { ...target }
    const rect = { left: 0, top: 0, width: 1, height: 1 }
    let frame = 0
    let visible = true
    let last = performance.now()
    let time = 0
    let openedAt: number | null = null
    let stale = false

    const resize = () => {
      const f = getFlags()
      const scale = Math.min(window.devicePixelRatio, 1.5) * (f.mobile ? S.resolutionMobile : S.resolution)
      const w = Math.max(1, Math.round(canvas.clientWidth * scale))
      const h = Math.max(1, Math.round(canvas.clientHeight * scale))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, w, h)
    }
    const measure = () => {
      const b = canvas.getBoundingClientRect()
      stale = false
      rect.left = b.left
      rect.top = b.top
      rect.width = b.width || 1
      rect.height = b.height || 1
    }
    const draw = (now: number) => {
      const f = getFlags()
      const still = f.still || f.mobile
      time += Math.min(now - last, 50) * 0.001 * S.speed
      last = now
      mouse.x += (target.x - mouse.x) * 0.04
      mouse.y += (target.y - mouse.y) * 0.04
      if (f.lit && openedAt === null) openedAt = time
      const opening = openedAt === null ? 0 : (time - openedAt) / S.beam
      gl.uniform1f(uTime, still ? 12 : time)
      gl.uniform1f(uReveal, still ? 1 : Math.min(1, opening))
      gl.uniform1f(uCursor, f.fine && !still ? S.cursor : 0)
      gl.uniform1f(uDust, f.mobile ? 0.25 : S.dust)
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
    sync = () => {
      const f = getFlags()
      const run = f.lit && !f.still && !f.mobile && visible && !document.hidden
      if (run && !frame) {
        last = performance.now()
        frame = requestAnimationFrame(loop)
      } else if (!run && frame) stop()
      if (!run) draw(performance.now())
    }
    const onPointer = (e: PointerEvent) => {
      const f = getFlags()
      if (!f.fine || f.still) return
      if (stale) measure()
      target.x = (e.clientX - rect.left) / rect.width
      target.y = 1 - (e.clientY - rect.top) / rect.height
    }
    const markStale = () => {
      stale = true
    }
    const ro = new ResizeObserver(() => {
      resize()
      measure()
      if (!frame) draw(performance.now())
    })
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      sync()
    })
    resize()
    measure()
    draw(performance.now())
    canvas.dataset.ready = 'true'
    sync()
    ro.observe(canvas)
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('scroll', markStale, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      stop()
      sync = () => {}
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('scroll', markStale)
      window.removeEventListener('pointermove', onPointer)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }

  const onLost = (e: Event) => {
    e.preventDefault()
    teardown()
    teardown = () => {}
  }
  const onRestored = () => {
    teardown = setup()
  }
  teardown = setup()
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  return {
    sync: () => sync(),
    destroy: () => {
      teardown()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }
}
