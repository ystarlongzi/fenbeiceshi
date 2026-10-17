import Link from "next/link";
import { SiteDocument } from "@/components/site-document";
import styles from "./not-found.module.css";
import "./globals.css";

export const metadata = { title: "404 - 分贝测试", robots: { index: false, follow: true } };
export default function GlobalNotFound() {
  return (
    <SiteDocument locale="zh-CN">
      <div className={styles.page}>
        <span>404</span>
        <h1>这里还没有内容</h1>
        <p>Page not found. 可以回到工具，开始一次声音观察。</p>
        <Link href="/">回到分贝测试</Link>
        <Link href="/en/">English home</Link>
      </div>
    </SiteDocument>
  );
}
