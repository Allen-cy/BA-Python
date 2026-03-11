import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle,
  Terminal,
  Table,
  BarChart2,
  Cloud,
  Cpu,
  Hexagon,
  User,
  GraduationCap,
  FileText,
  Database,
  Lightbulb,
  ChevronDown,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkspaceView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [code, setCode] = useState(`campaign_data = [
    {"channel": "Wechat", "cost": 5000, "revenue": 15000},
    {"channel": "TikTok", "cost": 8000, "revenue": 48000},
    {"channel": "Redbook", "cost": 3000, "revenue": 12000}
]

best_roi = 0
best_channel = ""

for item in campaign_data:
    # 1. 计算当前渠道的 ROI
    current_roi = item['revenue'] / item['cost']
    
    # 2. 比较并找到最高值
    if current_roi > best_roi:
        best_roi = current_roi
        best_channel = item['channel']

# 3. 打印结果
print(f"最优渠道是: {best_channel}")`);

  const [output, setOutput] = useState<string[]>([
    "[14:30:21] SUCCESS: Environment ready. Pyodide 0.23 loaded.",
    "[14:30:22] INFO: DataFrame 'df_crm' loaded (5,420 rows)."
  ]);
  const [showToast, setShowToast] = useState(false);

  const handleRun = () => {
    setOutput([...output, ">>> 正在执行代码...", ">>> 最优渠道是: TikTok"]);
  };

  const handleSubmit = () => {
    // Simulate validation success
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0f4c81', '#ec5b13', '#22c55e']
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="bg-[#f8f6f6] text-slate-900 font-sans h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[#ec5b13] cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <Hexagon size={28} fill="currentColor" className="text-[#ec5b13]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight cursor-pointer" onClick={() => onNavigate('dashboard')}>BA-Python</h2>
          <nav className="ml-8 hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">课程控制台</a>
            <a href="#" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">项目列表</a>
            <a href="#" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">学习路线</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ec5b13] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
            <User size={16} />
            个人中心
          </button>
          <img
            alt="User profile"
            className="w-10 h-10 rounded-full border border-slate-300 object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Tutorial Content */}
        <aside className="w-1/3 min-w-[320px] max-w-lg border-r border-slate-200 bg-white flex flex-col">
          <div className="p-6 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap size={16} />
              商业逻辑自动化
            </div>
            <h1 className="text-2xl font-bold mb-4">阶段 1.1: 多渠道投放 ROI 自动核算</h1>
            
            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-[#ec5b13]" />
                业务场景 (Business Story)
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                你是某零售品牌的商业分析师。本周公司在朋友圈 (WeChat)、抖音 (TikTok) 和 小红书 (Redbook) 进行了广告投放。老板给了你一份各渠道的投放金额和对应的销售额。
                <br /><br />
                在过去，你可能需要打开 Excel，手动输入公式。现在，你的目标是编写一段 Python 代码，自动计算出各渠道的 ROI (投资回报率)。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Database size={18} className="text-[#ec5b13]" />
                数据字典 (Variable Definition)
              </h3>
              <p className="text-sm text-slate-600 mb-2">平台已为你预置了变量 <code className="bg-slate-100 px-1 rounded text-red-500">campaign_data</code>，它是一个列表，包含了三个渠道的字典数据：</p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><code className="bg-slate-100 px-1 rounded text-red-500">channel</code>: 渠道名称</li>
                <li><code className="bg-slate-100 px-1 rounded text-red-500">cost</code>: 投放成本（元）</li>
                <li><code className="bg-slate-100 px-1 rounded text-red-500">revenue</code>: 产生销售额（元）</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Lightbulb size={18} className="text-[#ec5b13]" />
                互动任务 (Task)
              </h3>
              <p className="text-sm text-slate-600 mb-2">请在右侧编辑器中完成以下逻辑：</p>
              <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                <li>使用 <code className="bg-slate-100 px-1 rounded">for</code> 循环遍历 <code className="bg-slate-100 px-1 rounded text-red-500">campaign_data</code>。</li>
                <li>计算每个渠道的 ROI。计算公式：<strong>ROI = 销售额 / 投放成本</strong>。</li>
                <li>找到 ROI 最高的渠道名称，将其赋值给变量 <code className="bg-slate-100 px-1 rounded text-red-500">best_channel</code>。</li>
                <li>使用 <code className="bg-slate-100 px-1 rounded">print()</code> 打印出：<code className="bg-slate-100 px-1 rounded">最优渠道是: [渠道名]</code>。</li>
              </ol>
            </section>
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">学习进度</span>
              <span className="text-xs font-bold text-[#ec5b13]">15%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ec5b13] h-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </aside>

        {/* Right Panels: Editor & Result */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Right: Editor */}
          <div className="flex-1 min-h-[40%] flex flex-col bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Code size={16} className="text-yellow-500" />
                  main.py
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleRun} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700">
                  <Play size={14} fill="currentColor" />
                  运行代码
                </button>
                <button onClick={handleSubmit} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700">
                  <CheckCircle size={14} />
                  提交挑战
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300 leading-relaxed">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-slate-300 outline-none resize-none font-mono"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Right: Result Tabs */}
          <div className="h-1/3 min-h-[250px] flex flex-col bg-white border-t border-slate-200">
            <div className="flex border-b border-slate-200 px-4">
              <button className="px-4 py-2 text-xs font-bold border-b-2 border-[#ec5b13] text-[#ec5b13] flex items-center gap-2">
                <Terminal size={16} />
                控制台 (Console)
              </button>
              <button className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-2">
                <Table size={16} />
                数据视图 (DataFrame)
              </button>
              <button className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-2">
                <BarChart2 size={16} />
                可视化 (Chart)
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-50 font-mono text-xs">
              {output.map((line, index) => (
                <div key={index} className="text-slate-800 mt-1">
                  {line.includes('SUCCESS') ? (
                    <span className="text-green-600 font-bold">{line}</span>
                  ) : line.includes('INFO') ? (
                    <span className="text-blue-500 font-bold">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
              <div className="text-slate-800">&gt;&gt;&gt; <span className="animate-pulse">_</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* Float Bottom Bar */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><Cloud size={12} /> 已连接云端</span>
          <span className="flex items-center gap-1"><Cpu size={12} /> 内存: 245MB / 1024MB</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-medium text-slate-500 hover:text-[#ec5b13] transition-colors">获取帮助</button>
          <button className="text-xs font-medium text-slate-500 hover:text-[#ec5b13] transition-colors">常见问题</button>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 animate-bounce">
          <div className="bg-green-500 p-1 rounded-full">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">挑战成功！能力已更新</p>
            <p className="text-[10px] text-slate-400">
              business +10 | automation +5
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
