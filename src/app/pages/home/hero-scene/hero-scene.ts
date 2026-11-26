import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import type * as T from 'three';
import { MotionService } from '../../../core/motion.service';

/**
 * Hero 3D object: a "blueprint core" — wireframe icosahedron shell, a particle sphere, and two tilted orbit rings
 * with travelling nodes. Particles assemble on load, follow the mouse, and disperse as the hero scrolls away.
 *
 * Desktop only (>= 1024px), skipped for reduced motion or when WebGL is missing. Three.js is loaded lazily in the
 * browser, never during SSR. Rendering pauses when the hero is off screen or the tab is hidden.
 */
@Component({
  selector: 'app-hero-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: `
    :host { display: block; pointer-events: none; }
    canvas { display: block; width: 100%; height: 100%; opacity: 0; transition: opacity 1.2s ease; }
    canvas.on { opacity: 1; }
  `,
})
export class HeroScene {
  private readonly cv = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');

  constructor() {
    const destroyRef = inject(DestroyRef);
    const host = inject(ElementRef<HTMLElement>);
    const motion = inject(MotionService);
    afterNextRender(async () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      if (motion.isReduced()) return;
      const canvas = this.cv().nativeElement;
      if (!canvas.getContext('webgl2') && !canvas.getContext('webgl')) return;

      const THREE = await import('three');
      const el = host.nativeElement as HTMLElement;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 11);

      const TEAL = new THREE.Color('#00b8c4');
      const core = new THREE.Group();
      scene.add(core);

      // Wireframe shell
      const shellGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.75, 1));
      const shellMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
      const shell = new THREE.LineSegments(shellGeo, shellMat);
      core.add(shell);

      // Particle sphere (Fibonacci distribution)
      const COUNT = 1600;
      const base = new Float32Array(COUNT * 3);
      const pos = new Float32Array(COUNT * 3);
      const scatter = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = i * Math.PI * (3 - Math.sqrt(5));
        const rad = 1.25 + (Math.random() - 0.5) * 0.08;
        base.set([Math.cos(th) * r * rad, y * rad, Math.sin(th) * r * rad], i * 3);
        const d = 4 + Math.random() * 5;
        const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
        scatter.set([d * Math.sin(v) * Math.cos(u), d * Math.sin(v) * Math.sin(u), d * Math.cos(v)], i * 3);
      }
      pos.set(scatter);
      const ptsGeo = new THREE.BufferGeometry();
      ptsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const ptsMat = new THREE.PointsMaterial({ color: '#9ff4fa', size: 0.045, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
      const points = new THREE.Points(ptsGeo, ptsMat);
      core.add(points);

      // Orbit rings with travelling nodes
      const rings: { pivot: T.Group; node: T.Mesh; speed: number }[] = [];
      const ringMat = new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
      const nodeMat = new THREE.MeshBasicMaterial({ color: '#e9feff' });
      [[2.45, 1.15, 0.3, 0.6], [2.85, -0.5, 0.9, -0.4]].forEach(([radius, tx, tz, speed]) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(tx, 0, tz);
        pivot.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 6, 160), ringMat));
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), nodeMat);
        pivot.add(node);
        core.add(pivot);
        rings.push({ pivot, node, speed });
        (node.userData as { r: number }).r = radius;
      });

      // Layout: keep the object on the right of the hero, clear of the headline.
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        const halfW = halfH * camera.aspect;
        core.position.set(halfW * 0.24, -halfH * 0.18, 0);
        const s = Math.min(1, (halfH * 0.5) / 2.85);
        core.scale.setScalar(s);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // Input
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: PointerEvent) => { mouse.tx = (e.clientX / window.innerWidth) * 2 - 1; mouse.ty = (e.clientY / window.innerHeight) * 2 - 1; };
      window.addEventListener('pointermove', onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }, { threshold: 0 });
      io.observe(el);

      const t0 = performance.now();
      let raf = 0, last = t0;
      canvas.classList.add('on');
      const loop = () => {
        cancelAnimationFrame(raf);
        if (!visible || document.hidden) return;
        raf = requestAnimationFrame(loop);
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const t = (now - t0) / 1000;

        // 0..1 as the hero scrolls out of view
        const scroll = Math.min(Math.max(window.scrollY / Math.max(el.clientHeight, 1), 0), 1);
        // assemble during the first 2.2s, disperse with scroll
        const assemble = 1 - Math.pow(1 - Math.min(t / 2.2, 1), 3);
        const k = assemble * (1 - scroll * 0.9);
        for (let i = 0; i < COUNT * 3; i++) pos[i] = scatter[i] + (base[i] - scatter[i]) * k;
        ptsGeo.attributes['position'].needsUpdate = true;
        ptsMat.opacity = 0.9 * (1 - scroll * 0.7);
        shellMat.opacity = 0.8 * assemble * (1 - scroll);
        ringMat.opacity = 0.5 * assemble * (1 - scroll);
        shell.scale.setScalar(1 + scroll * 0.8);

        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        core.rotation.y += dt * 0.18;
        core.rotation.x = mouse.y * 0.35 + scroll * 0.8;
        core.rotation.z = -mouse.x * 0.15;
        shell.rotation.y = -t * 0.12 + mouse.x * 0.5;
        rings.forEach(({ node, speed }) => {
          const r = (node.userData as { r: number }).r;
          const a = t * speed;
          node.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
        });
        renderer.render(scene, camera);
      };
      const onVis = () => { last = performance.now(); loop(); };
      document.addEventListener('visibilitychange', onVis);
      loop();

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('visibilitychange', onVis);
        scene.traverse((o) => {
          const m = o as T.Mesh;
          m.geometry?.dispose();
          const mat = m.material as T.Material | T.Material[] | undefined;
          (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
        });
        renderer.dispose();
      });
    });
  }
}
