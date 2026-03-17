import React from 'react';
import { 
  FileCode, 
  ExternalLink, 
  Copy, 
  CheckCircle2,
  Database,
  Cloud,
  Layout
} from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    // In a real app, we'd fetch the Code.gs content and copy it
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Deployment Guide</h1>
        <p className="text-slate-500">How to connect this frontend to Google Sheets & Apps Script.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Database size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">1. Prepare Sheets</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Create a Google Sheet with 4 tabs: <span className="font-mono text-emerald-600">Supplies</span>, 
            <span className="font-mono text-emerald-600">Equipment</span>, 
            <span className="font-mono text-emerald-600">Transactions</span>, and 
            <span className="font-mono text-emerald-600">Requests</span>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <FileCode size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">2. Setup Apps Script</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Open <span className="font-medium">Extensions &gt; Apps Script</span>. 
            Copy the content of <span className="font-mono text-indigo-600">Code.gs</span> from this project 
            into the script editor.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Cloud size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">3. Deploy Web App</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Click <span className="font-medium">Deploy &gt; New Deployment</span>. 
            Select <span className="font-medium">Web App</span>. 
            Set access to <span className="font-medium">"Anyone"</span> and deploy.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <FileCode size={16} className="text-slate-400" />
            <span className="text-xs font-mono text-slate-300">Code.gs</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all"
          >
            {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-96">
          <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
{`/**
 * Google Apps Script Backend
 * Paste this into your Apps Script editor
 */

function doGet(e) {
  return HtmlService.createHtmlOutput("API is running...");
}

function doPost(e) {
  const action = e.parameter.action;
  const payload = JSON.parse(e.postData.contents);
  // ... Implementation details in Code.gs file
}`}
          </pre>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
          <Layout size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-1">Final Step: Connect Frontend</h4>
          <p className="text-sm text-slate-600 mb-4">
            Once you have your Web App URL, you can update the API service in this app to point to your Google Sheets backend.
          </p>
          <a 
            href="https://developers.google.com/apps-script/guides/web" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold hover:underline"
          >
            Learn more about Web Apps <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
