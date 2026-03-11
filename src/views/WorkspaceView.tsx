import React, { useState, useEffect } from 'react';
import {
  Play, CheckCircle, Terminal, Table, BarChart2, Cloud, Cpu, Hexagon, User,
  GraduationCap, FileText, Database, Lightbulb, Code
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkspaceViewProps {
  onNavigate: (view: string) => void;
  lesson: any;
  user: any;
  onSubmitCode: (lessonId: string, code: string, output: string, isPassed: boolean) => Promise<void>;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ 
  onNavigate, lesson, user, onSubmitCode 
}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([
    "[系统] 环境准备就绪。Pyodide 加载成功。",
    "[系统] 本地数据上下文已注入。"
  ]);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lesson) {
      setCode(lesson.starter_code || '');
    }
  }, [lesson]);

  const handleRun = () => {
    setOutput([...output, ">>> 正在执行代码...", ">>> 运行结果: " + (code.includes('print') ? '最优渠道已找到' : '代码运行中...')]);
  };

  const handleSubmit = async () => {
    if (!lesson) return;
    setIsSubmitting(true);
    try {
      // Logic for validation would go here
      const isPassed = true; 
      
      await onSubmitCode(lesson.id, code, "Challenge passed", isPassed);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec5b13', '#0f4c81', '#22c55e']
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-white flex-col gap-4 focus:ring-0">
        <div className="w-8 h-8 border-4 border-[#ec5b13]/20 border-t-[#ec5b13] rounded-full animate-spin" />
        <p className="text-slate-400">加载实战场景...</p>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-xs text-[#ec5b13] hover:underline"
        >
          返回仪表盘
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f6] text-slate-900 font-sans h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[#ec5b13] cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <Hexagon size={28} fill="currentColor" className="text-[#ec5b13]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight cursor-pointer" onClick={() => onNavigate('dashboard')}>BA-Python</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 px-4 py-2 bg-[#ec5b13] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <User size={16} />
            个人中心
          </button>
          <img
            alt="User profile"
            className="w-10 h-10 rounded-full border border-slate-300 object-cover"
            src={user?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Tutorial Content */}
        <aside className="w-1/3 min-w-[320px] max-w-lg border-r border-slate-200 bg-white flex flex-col">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap size={16} />
              {lesson.course_title || '课程实战'}
            </div>
            <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
            
            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-[#ec5b13]" />
                业务场景 (Business Story)
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {lesson.business_background}
              </p>
            </section>

            {lesson.data_dictionary?.length > 0 && (
              <section className="mb-8">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Database size={18} className="text-[#ec5b13]" />
                  数据字典 (Data Dictionary)
                </h3>
                <div className="space-y-2">
                  {lesson.data_dictionary.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <code className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-red-600 font-bold">{item.field_name}</code>
                      <span className="text-xs text-slate-500">{item.description}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Lightbulb size={18} className="text-[#ec5b13]" />
                挑战任务 (Task)
              </h3>
              <div className="prose prose-sm text-slate-600" dangerouslySetInnerHTML={{ __html: lesson.content }} />
              <ul className="mt-4 space-y-2">
                {lesson.hints?.map((hint: string, i: number) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2 italic">
                    <span className="text-[#ec5b13] shrink-0">提示:</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">任务完成进度</span>
              <span className="text-xs font-bold text-[#ec5b13]">45%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ec5b13] h-full" style={{ width: '45%' }}></div>
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
                <button onClick={handleRun} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition-colors">
                  <Play size={14} fill="currentColor" />
                  运行
                </button>
                <button 
                   onClick={handleSubmit} 
                   disabled={isSubmitting}
                   className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  提交挑战
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300 leading-relaxed">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-slate-300 outline-none resize-none font-mono focus:ring-0"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Right: Result Tabs */}
          <div className="h-1/3 min-h-[250px] flex flex-col bg-white border-t border-slate-200">
            <div className="flex border-b border-slate-200 px-4">
              <button className="px-4 py-2 text-xs font-bold border-b-2 border-[#ec5b13] text-[#ec5b13] flex items-center gap-2">
                <Terminal size={16} />
                输出
              </button>
              <button className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-2">
                <Table size={16} />
                数据预览
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-50 font-mono text-xs text-slate-700 leading-relaxed">
              {output.map((line, index) => (
                <div key={index} className="mt-1">
                  {line.startsWith('[系统]') ? (
                    <span className="text-blue-500 font-bold">{line}</span>
                  ) : line.startsWith('>>>') ? (
                    <span className="text-[#ec5b13]">{line}</span>
                  ) : line}
                </div>
              ))}
              <div className="text-slate-400 animate-pulse mt-2">&gt; 准备就绪...</div>
            </div>
          </div>
        </div>
      </main>

      {/* Float Bottom Bar */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><Cloud size={12} /> 云端同步中...</span>
          <span className="flex items-center gap-1"><Cpu size={12} /> 容器快照: ba-container-v2</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="bg-green-500 p-1 rounded-full shrink-0">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">恭喜！挑战成功</p>
            <p className="text-[10px] text-slate-400">本节修炼点数 +15 | 商业敏感度 +5</p>
          </div>
        </div>
      )}
    </div>
  );
};
