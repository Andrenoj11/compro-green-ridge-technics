"use client";

import { useMotionPreference } from "./motion-preference";

import { useEffect, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, inView, stagger } from "motion";
import { motion, MotionConfig, useScroll, useSpring } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const MotionLink = motion.create(Link);

export function AnimatedLink(props: Pick<ComponentProps<typeof Link>, "href" | "children" | "className" | "aria-label">) {
  const reduced = useMotionPreference();
  const pathname = usePathname();
  if (/^\/(id|en|ar|zh)\/?$/.test(pathname)) return <Link {...props} />;
  return <MotionLink {...props} whileHover={reduced ? undefined : { y: -3 }} whileTap={reduced ? undefined : { scale: .975 }} transition={{ duration: .22 }} />;
}

function classicHomeReveals() {
  if (!("IntersectionObserver" in window)) return;
  const elements = document.querySelectorAll<HTMLElement>(".home-page [data-reveal]");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("reveal-pending");
    entry.target.classList.add("reveal-visible");
    observer.unobserve(entry.target);
  }), { threshold: .08 });
  elements.forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight * .9) element.classList.add("reveal-pending");
    observer.observe(element);
  });
  return () => {
    observer.disconnect();
    elements.forEach(element => element.classList.remove("reveal-pending", "reveal-visible"));
  };
}

function ReadingProgress() {
  const pathname = usePathname();
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32 });
  if (!pathname.includes("/insights/")) return null;
  return <motion.div className="reading-progress" aria-hidden="true" style={{ scaleX: reduced ? scrollYProgress : progress }} />;
}

// Native details remains usable without JavaScript, including keyboard activation.
function animateDisclosure(details: HTMLDetailsElement) {
  const summary = details.querySelector("summary");
  if (!summary) return () => {};
  let expanded = details.open;
  let animation: ReturnType<typeof animate> | undefined;
  function toggle(event: MouseEvent) {
    event.preventDefault();
    expanded = !expanded;
    const from = details.getBoundingClientRect().height;
    animation?.stop();
    details.style.height = "";
    details.open = true;
    const to = expanded ? details.getBoundingClientRect().height : summary!.getBoundingClientRect().height + 2;
    details.style.overflow = "hidden";
    const current = animate(details, { height: [from, to] }, { duration: .3, ease });
    animation = current;
    void current.then(() => {
      if (animation !== current) return;
      current.cancel();
      animation = undefined;
      details.open = expanded;
      details.style.removeProperty("height");
      details.style.removeProperty("overflow");
    });
  }
  summary.addEventListener("click", toggle);
  return () => {
    animation?.stop();
    animation = undefined;
    details.open = expanded;
    details.style.removeProperty("height");
    details.style.removeProperty("overflow");
    summary.removeEventListener("click", toggle);
  };
}

function MotionEffects() {
  const pathname = usePathname();
  const reduced = useMotionPreference();
  useEffect(() => {
    if (reduced !== false) return;
    if (document.querySelector(".home-page")) return classicHomeReveals();
    const cleanups: Array<() => void> = [];
    let disposed = false;
    const animations = new Set<ReturnType<typeof animate>>();
    const originals = new Map<HTMLElement, { opacity: string; transform: string }>();
    const restore = (element: HTMLElement) => {
      const original = originals.get(element);
      if (!original) return;
      element.style.opacity = original.opacity;
      element.style.transform = original.transform;
    };
    const reveal = (elements: Element | Element[], delay = 0) => {
      const targets = (Array.isArray(elements) ? elements : [elements]) as HTMLElement[];
      targets.forEach(element => originals.set(element, { opacity: element.style.opacity, transform: element.style.transform }));
      const animation = animate(elements, { opacity: [.25, 1], y: [22, 0] }, { duration: .65, ease, delay: Array.isArray(elements) ? stagger(.075, { startDelay: delay }) : delay });
      animations.add(animation);
      void animation.then(() => {
        if (disposed) return;
        animation.cancel();
        animations.delete(animation);
        targets.forEach(restore);
      });
    };

    // The server-rendered HTML is always visible; animate committed route content.
    const hero = document.querySelector(".hero-copy");
    if (hero) reveal(Array.from(hero.children), .06);
    const pageHero = document.querySelector(".page-hero-inner");
    if (pageHero) reveal(Array.from(pageHero.children), .04);
    const articleHeading = document.querySelector(".article-heading");
    if (articleHeading) reveal(Array.from(articleHeading.children), .04);

    const selector = [
      "[data-reveal]", ".coverage-grid > div", ".detail-hero-image",
      ".detail-body > h2", ".detail-body > h3", ".detail-body > p", ".large-scope-list > li",
      ".detail-sidebar", ".value-card", ".status-panel", ".contact-info", ".contact-form-wrap",
      ".jobs-heading", ".empty-state", ".article-body > p", ".article-body > h2",
      ".article-end", ".footer-top > div", ".footer-bottom", ".not-found",
    ].join(",");
    cleanups.push(inView(selector, element => {
      if (element.parentElement?.closest("[data-reveal]")) return;
      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      reveal(element, Math.min(siblings.indexOf(element) % 4, 3) * .045);
    }, { margin: "0px 0px -36px 0px" }));
    document.querySelectorAll<HTMLDetailsElement>("details.faq-item").forEach(details => cleanups.push(animateDisclosure(details)));
    return () => {
      disposed = true;
      cleanups.forEach(cleanup => cleanup());
      animations.forEach(animation => animation.stop());
      originals.forEach((_, element) => restore(element));
    };
  }, [pathname, reduced]);
  return null;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useMotionPreference();
  return <MotionConfig reducedMotion={reduced ? "always" : "never"} transition={{ duration: .35, ease }}>
    {children}<ReadingProgress /><MotionEffects />
  </MotionConfig>;
}
