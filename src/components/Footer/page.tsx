import Link from "next/link";

export default function Footer(){
    return(
      <footer className="border-t border-slate-800 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">© {new Date().getFullYear()} Aijeysh Sharma. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" aria-label="Go to privacy page" className="text-slate-400 text-sm">Privacy</Link>
            <Link href="/contact" ria-label="Go to contact page" className="text-slate-400 text-sm">Contact</Link>
          </div>
        </div>
      </footer>
    )
}