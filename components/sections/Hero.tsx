"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { LinkButton } from "../ui/Button";
import { BrowserFrame, PhoneFrame, SiteSkeleton } from "../ui/Mockups";
import { hero } from "@/lib/content";
import { brl, site } from "@/lib/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax: the mockups drift slower than the copy on scroll.
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 40]);

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const [beforeAccent, afterAccent] = hero.headline.split(hero.headlineAccent);

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-40 md:pb-28"
    >
      {/* Ambient background: radial brand glow over a faint grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-noise opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[46rem] -translate-x-1/2 rounded-full bg-brand/18 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[30rem] rounded-full bg-brand-deep/15 blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <motion.div style={{ y: copyY }} className="max-w-2xl">
          {/* Risk reversal above the fold, before the headline. */}
          <motion.ul
            {...fadeUp(0)}
            className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-2"
          >
            {hero.assurances.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-mist"
              >
                <Check className="size-3 text-mint" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-4xl font-semibold sm:text-5xl md:text-6xl md:leading-[1.05]"
          >
            {beforeAccent}
            <span className="text-gradient">{hero.headlineAccent}</span>
            {afterAccent}
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-5 text-lg font-medium text-cloud/85 sm:text-xl"
          >
            {hero.sub}
          </motion.p>

          <motion.p
            {...fadeUp(0.22)}
            className="mt-4 max-w-xl text-base leading-relaxed text-mist"
          >
            {hero.description}
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#contato" size="lg" trackAs="hero">
              {hero.ctaPrimary}
              <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#projetos" variant="secondary" size="lg" trackAs="hero">
              {hero.ctaSecondary}
            </LinkButton>
          </motion.div>

          <motion.p {...fadeUp(0.36)} className="mt-4 text-sm text-mist-dim">
            {hero.ctaMicrocopy}
          </motion.p>

          {/* Transparent pricing this early qualifies the visitor and signals
              confidence — hiding it invites a bounce to the FAQ or an exit. */}
          <motion.div
            {...fadeUp(0.42)}
            className="mt-10 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:gap-8"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold text-cloud">
                {brl(site.price)}
              </span>
              <span className="text-sm text-mist">/mês</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {hero.trust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-mist">
                  <ShieldCheck className="size-3.5 shrink-0 text-brand-bright" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Visual: floating browser + phone, communicating "we build sites" instantly */}
        <motion.div
          style={{ y: mockupY }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Gentle float — 6s cycle, transform-only so it never triggers layout */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <BrowserFrame url={`${site.domain}/sua-empresa`}>
                <SiteSkeleton />
              </BrowserFrame>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -bottom-14 left-0 w-28 sm:-left-6 sm:w-32 lg:-left-10 lg:w-36"
            >
              <PhoneFrame>
                <SiteSkeleton compact />
              </PhoneFrame>
            </motion.div>

            {/* Floating badge that states the model in four words */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -top-5 right-0 rounded-xl border border-line bg-ink/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:-right-6"
            >
              <p className="font-display text-lg font-semibold leading-none">
                {brl(site.price)}
                <span className="text-xs font-normal text-mist">/mês</span>
              </p>
              <p className="mt-1 text-[0.68rem] text-mist-dim">tudo incluso</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
