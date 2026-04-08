import React from 'react';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {}
        <div className="mb-10 pb-6 border-b-2 border-sky-200">
          <h1 className="text-4xl font-black text-[#0a2342] tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
            Last updated: {lastUpdated}
          </p>
        </div>

        {}
        <div className="legal-content">
          {children}
        </div>
      </div>

      <style>{`
        .legal-content {
          color: #1e3a5f;
          font-size: 1rem;
          line-height: 1.8;
        }
        .legal-content h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0a2342;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 2px solid #e0f2fe;
        }
        .legal-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a2342;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .legal-content p {
          margin-bottom: 1rem;
          color: #334d70;
        }
        .legal-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: #334d70;
        }
        .legal-content ul li {
          margin-bottom: 0.4rem;
        }
        .legal-content a {
          color: #ff7b00;
          font-weight: 600;
          text-decoration: underline;
        }
        .legal-content a:hover {
          color: #cc6200;
        }
        .legal-content strong {
          font-weight: 700;
          color: #0a2342;
        }
      `}</style>
    </div>
  );
}
