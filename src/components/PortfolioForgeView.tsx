import React, { useState } from 'react';
import { 
  Shield, 
  FolderGit2, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Trophy,
  Code2,
  Lock,
  Globe
} from 'lucide-react';
import { PortfolioProject } from '../types';
import { RECOMMENDED_PORTFOLIO_PROJECTS } from '../data/defaultPlan';
import { playSuccessChime } from '../utils/audioUtils';

export const PortfolioForgeView: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    const saved = localStorage.getItem('cyber_portfolio_projects');
    return saved ? JSON.parse(saved) : RECOMMENDED_PORTFOLIO_PROJECTS;
  });

  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');

  const updateProjectStatus = (id: string, status: PortfolioProject['status']) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, status } : p));
    setProjects(updated);
    localStorage.setItem('cyber_portfolio_projects', JSON.stringify(updated));
    playSuccessChime();
  };

  const completedProjectsCount = projects.filter((p) => p.status === 'completed').length;

  const generatePortfolioMarkdown = (): string => {
    return `# 🛡️ Cybersecurity Specialist Portfolio

> Advanced Cybersecurity Practitioner specializing in Security Operations (SOC), Threat Hunting, Network Defense, and Application Security.
> Built for the Nov 23, 2026 Advanced Mission.

---

## ⚡ Core Competencies
- **SIEM & Log Analysis:** Splunk (SPL), Elastic SIEM, Wazuh, Sysmon Event IDs (1, 3, 7, 10, 11)
- **Network Traffic & Defense:** Wireshark PCAP inspection, Snort IDS custom rules, Zeek, TCP/IP forensics
- **Offensive Security & Pen Testing:** Burp Suite Professional, Nmap, Metasploit, OWASP Top 10, CVSS v3.1 scoring
- **Security Automation:** Python 3, Bash, Linux iptables, REST API threat intelligence ingestion
- **Frameworks & Standards:** MITRE ATT&CK Matrix, NIST SP 800-61, ISO/IEC 27001, Cyber Kill Chain

---

## 📂 Flagship Portfolio Projects

${projects
  .map(
    (p, idx) => `### ${idx + 1}. ${p.title}
- **Domain:** ${p.domain}
- **Status:** ${p.status.toUpperCase()}
- **Key Skills:** ${p.keySkills.join(', ')}

**Summary:**  
${p.description}

**Key Deliverables:**  
${p.deliverables.map((d) => `- [x] ${d}`).join('\n')}

**Repository:** [${p.githubTemplate}](${p.githubTemplate})

---`
  )
  .join('\n\n')}

## 🏆 Certifications & Coursework
- Cybersecurity Advanced Program • Completion Certificate 2026
- Hands-on SOC Homelab Deployment & Incident Response Simulation
- Passed 13/13 Daily Quizzes & Comprehensive Final Main Test

---
*Generated via CyberMission 1K Command System for the Nov 23, 2026 $1,000 Mission Submission.*
`;
  };

  const handleCopyMarkdown = () => {
    const text = generatePortfolioMarkdown();
    navigator.clipboard.writeText(text);
    setCopiedMarkdown(true);
    playSuccessChime();
    setTimeout(() => setCopiedMarkdown(false), 3000);
  };

  const selectedProj = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <FolderGit2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Cybersecurity Portfolio Forge
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Turn your coursework into high-impact portfolio pieces that impress recruiters and guarantee your submission stands out for the <span className="text-amber-400 font-bold">$1,000 prize</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyMarkdown}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied README.md!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy GitHub README.md</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-mono">PORTFOLIO READINESS:</span>
            <span className="font-bold text-white font-mono">
              {completedProjectsCount} / {projects.length} Flagship Projects Completed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              Target: Include Live GitHub URLs before Nov 23
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project Selector & Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold block mb-3">
              Flagship Portfolio Projects:
            </span>

            <div className="space-y-2.5">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          {proj.domain}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {proj.title}
                        </h4>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                          proj.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : proj.status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Readiness Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono text-white uppercase">
                $1,000 Portfolio Submission Checklist
              </h3>
            </div>

            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Clean public GitHub repository with comprehensive README.md</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Architecture diagrams included (Excalidraw/Draw.io PNGs)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>No private IP addresses, passwords, or live API keys exposed in code</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>MIT or Apache 2.0 open-source license added</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Short 2-minute Loom/YouTube screen recording demo linked</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Selected Project Detail & Live Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  {selectedProj.domain} • {selectedProj.difficulty} Level
                </span>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mt-0.5">
                  {selectedProj.title}
                </h3>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['not_started', 'in_progress', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateProjectStatus(selectedProj.id, st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                      selectedProj.status === st
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'not_started' ? 'Pending' : st === 'in_progress' ? 'Active' : 'Done'}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase font-bold block mb-1">
                Executive Overview:
              </span>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {selectedProj.description}
              </p>
            </div>

            {/* Key Skills Tags */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase font-bold block mb-2">
                Demonstrated Technical Competencies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProj.keySkills.map((sk) => (
                  <span
                    key={sk}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-emerald-300 border border-slate-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase font-bold block mb-2">
                Required Project Deliverables:
              </span>
              <div className="space-y-2">
                {selectedProj.deliverables.map((deliv, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Repo */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">
                GitHub Repository Template:
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Full Markdown for Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
