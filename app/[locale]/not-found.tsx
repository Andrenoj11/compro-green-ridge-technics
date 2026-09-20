import Link from "next/link";
export default function NotFound() {
  return <section className="not-found"><span>404</span><h1>Halaman tidak ditemukan.<br />Page not found.</h1><p>Silakan kembali ke beranda. / Please return to the homepage.</p><div><Link className="button button-green" href="/id">Beranda Indonesia ↗</Link><Link className="button button-outline" href="/en">English home ↗</Link></div></section>;
}
