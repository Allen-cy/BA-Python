import React, { useState, useEffect } from 'react';
import {
  Play, CheckCircle, Terminal, Table, BarChart2, Cloud, Cpu, Hexagon, User,
  GraduationCap, FileText, Database, Lightbulb, Code, Sparkles, Loader2, X, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Editor from '@monaco-editor/react';
import { usePython } from '../hooks/usePython';
import { useAITutor } from '../hooks/useAITutor';

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
  const [rightPanelActiveTab, setRightPanelActiveTab] = useState<'terminal' | 'ai' | 'preview'>('terminal');
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false); // New state for AI tutor panel
  const [leftPanelActiveTab, setLeftPanelActiveTab] = useState<'theory' | 'practice'>('theory'); // New state for left panel tabs

  const { 
    runCode, 
    validateCode, 
    getFileData, 
    loading: pyLoading, 
    output: pyOutput, 
    error: pyError, 
    setOutput: setPyOutput 
  } = usePython();
  const { askTutor, loading: aiLoading, feedback: aiFeedback, setFeedback: setAiFeedback } = useAITutor();

  useEffect(() => {
    if (lesson) {
      setCode(lesson.starter_code || '');
      setPyOutput(["[系统] 环境准备就绪。Python 3.11 (Pyodide) 已加载。", "[系统] 商业数据集 crm_raw_data.csv 已就绪。"]);
      loadPreviewData();
    }
  }, [lesson, setPyOutput]);

  const loadPreviewData = async () => {
    setPreviewLoading(true);
    const data = await getFileData('crm_raw_data.csv');
    if (data && !data.error) {
      setPreviewData(data);
    }
    setPreviewLoading(false);
  };

  const handleRun = async () => {
    await runCode(code);
    setRightPanelActiveTab('terminal');
  };

  const handleAskAI = async () => {
    setRightPanelActiveTab('ai');
    await askTutor(lesson, code, pyError);
  };

  const handleSubmit = async () => {
    if (!lesson) return;
    setIsSubmitting(true);
    setRightPanelActiveTab('terminal');
    
    try {
      // 执行系统级评测
      const result = await validateCode(code, lesson.validation_code);
      const isPassed = result.success && result.isPassed;
      
      await onSubmitCode(lesson.id, code, result.logs.join('\n'), isPassed);
      
      if (isPassed) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec5b13', '#0f4c81', '#22c55e']
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        // 如果没通过，在控制台给个醒目的提示
        setPyOutput(prev => [...prev, "\n[系统提示] 代码运行成功，但未达成业务目标。请检查逻辑或求助 AI 助教。"]);
        if (!result.success) {
           // 如果是语法错误
           // handleAskAI();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-white flex-col gap-4">
        <div className="w-8 h-8 border-4 border-[#ec5b13]/20 border-t-[#ec5b13] rounded-full animate-spin" />
        <p className="text-slate-400">加载实战场景...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f6] text-slate-900 font-sans h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[#ec5b13] cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <Hexagon size={28} fill="currentColor" />
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
        <aside className="w-1/3 min-w-[320px] max-w-lg border-r border-slate-200 bg-white flex flex-col shadow-xl z-20">
          {/* Left Panel Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/30">
            <button 
              onClick={() => setLeftPanelActiveTab('theory')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${leftPanelActiveTab === 'theory' ? 'text-[#ec5b13] border-[#ec5b13]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              <GraduationCap size={16} />
              基础知识 (Theory)
            </button>
            <button 
              onClick={() => setLeftPanelActiveTab('practice')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${leftPanelActiveTab === 'practice' ? 'text-[#ec5b13] border-[#ec5b13]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              <FileText size={16} />
              案例练习 (Practice)
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {leftPanelActiveTab === 'theory' ? (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 px-1">
                  <div className="w-4 h-[2px] bg-[#ec5b13]"></div>
                  Learning Base
                </div>
                <h1 className="text-2xl font-black mb-6 tracking-tight">{lesson.title} - 知识点</h1>
                
                <div className="prose prose-sm prose-slate max-w-none">
                  {lesson.theory_content ? (
                     <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: lesson.theory_content }} />
                  ) : (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm">
                      本节点暂无理论讲解。直接进入“案例练习”开始实操吧！
                    </div>
                  )}
                </div>
                
                {lesson.video_url && (
                  <div className="mt-8 p-4 bg-slate-900 rounded-xl flex items-center justify-between text-white shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ec5b13] rounded-full flex items-center justify-center">
                        <Play size={20} fill="white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">视频精讲</div>
                        <div className="text-[10px] text-slate-400">点击查看导师点评</div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold transition-colors">立即观看</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 px-1">
                  <div className="w-4 h-[2px] bg-[#ec5b13]"></div>
                  Business Case
                </div>
                <h1 className="text-2xl font-black mb-6 tracking-tight">实战挑战</h1>
                
                <section className="mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Cloud size={14} className="text-[#ec5b13]" />
                    业务场景
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm leading-relaxed text-slate-600">
                    {lesson.business_background}
                  </div>
                </section>

                {lesson.data_dictionary?.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Database size={14} className="text-[#ec5b13]" />
                      数据字典
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {lesson.data_dictionary.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50">
                          <code className="text-[10px] text-red-600 font-black">{item.field_name}</code>
                          <span className="text-[10px] text-slate-400">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Lightbulb size={14} className="text-[#ec5b13]" />
                    任务目标
                  </h3>
                  <div className="text-sm text-slate-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  <div className="mt-6 flex flex-col gap-2">
                    {lesson.hints?.map((hint: string, i: number) => (
                      <div key={i} className="group flex items-start gap-2 text-[11px] text-slate-400 hover:text-slate-500 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ec5b13] mt-1.5 group-hover:scale-125 transition-transform"></div>
                        {hint}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">任务完成进度</span>
              <span className="text-xs font-bold text-[#ec5b13]">{user?.progress || '25%'}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ec5b13] h-full" style={{ width: user?.progress || '25%' }}></div>
            </div>
          </div>
        </aside>

        {/* Right Panels: Editor & Result */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Right: Editor */}
          <div className="flex-1 min-h-[40%] flex flex-col bg-[#1e1e1e] overflow-hidden relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Code size={16} className="text-yellow-500" />
                  main.py
                </span>
                {pyLoading && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 animate-pulse">
                    <Loader2 size={12} className="animate-spin" />
                    Python 引擎运行中...
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRun} 
                  disabled={pyLoading}
                  className="flex items-center gap-1 px-3 py-1 bg-[#ec5b13] text-white rounded-md text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {!pyLoading && <Play size={14} fill="currentColor" />}
                  {pyLoading ? '运行中...' : '运行结果 (F5)'}
                </button>
                <button 
                   onClick={handleSubmit} 
                   disabled={isSubmitting || pyLoading}
                   className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-900/20"
                >
                  <CheckCircle size={14} />
                  提交挑战
                </button>
              </div>
            </div>
            <div className="flex-1 editor-container overflow-hidden pt-2">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10 },
                  lineNumbers: 'on',
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3
                }}
              />
            </div>
          </div>

          {/* Bottom Right: Result Tabs */}
          <div className="h-1/3 min-h-[300px] flex flex-col bg-white border-t border-slate-200 relative">
            <div className="flex border-b border-slate-200 px-4 bg-slate-50/50">
              <button 
                onClick={() => setRightPanelActiveTab('terminal')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${rightPanelActiveTab === 'terminal' ? 'border-[#ec5b13] text-[#ec5b13]' : 'border-transparent text-slate-400'}`}
              >
                <Terminal size={16} />
                执行控制台 {pyError && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </button>
              <button 
                onClick={() => setRightPanelActiveTab('preview')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${rightPanelActiveTab === 'preview' ? 'border-[#ec5b13] text-[#ec5b13]' : 'border-transparent text-slate-400'}`}
              >
                <Table size={16} />
                数据预览 (Table)
              </button>
              <button 
                onClick={() => setRightPanelActiveTab('ai')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${rightPanelActiveTab === 'ai' ? 'border-[#ec5b13] text-[#ec5b13]' : 'border-transparent text-slate-400'}`}
              >
                <Sparkles size={16} />
                AI 助教建议
              </button>
              
              <div className="ml-auto flex items-center">
                <button 
                  onClick={handleAskAI}
                  className="px-3 py-1 bg-orange-50 text-[#ec5b13] text-[10px] font-black rounded-full border border-orange-100 hover:bg-orange-100 transition-colors flex items-center gap-1"
                >
                  <Sparkles size={12} fill="currentColor" />
                  向 AI 老师求助
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-white custom-scrollbar">
              {rightPanelActiveTab === 'terminal' && (
                <div className="p-4 font-mono text-xs leading-relaxed">
                  {pyOutput.length === 0 && !pyError && (
                    <div className="text-slate-300 italic">等待代码运行...</div>
                  )}
                  {pyOutput.map((line, index) => (
                    <div key={index} className="mt-1 text-slate-600">
                      {line.startsWith('[系统]') ? (
                        <span className="text-blue-500 font-bold">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                  {pyError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 whitespace-pre-wrap animate-in fade-in zoom-in-95 duration-200">
                      <div className="font-bold flex items-center gap-2 mb-1">
                         <X size={14} className="bg-red-500 text-white rounded-full p-0.5" /> 运行错误 (Runtime Error)
                      </div>
                      {pyError}
                      <button 
                        onClick={handleAskAI}
                        className="mt-2 block text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700"
                      >
                        让 AI 解释这个错误
                      </button>
                    </div>
                  )}
                </div>
              )}

              {rightPanelActiveTab === 'preview' && (
                <div className="p-0 h-full overflow-auto">
                  {previewLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Loader2 size={24} className="animate-spin text-[#ec5b13]" />
                      <span className="text-xs">加载数据集预览...</span>
                    </div>
                  ) : previewData.length > 0 ? (
                    <table className="w-full text-[11px] border-collapse text-left">
                      <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="px-3 py-2 border-b border-slate-200 font-bold text-slate-600 uppercase">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="px-3 py-2 text-slate-500 max-w-[150px] truncate">
                                {typeof val === 'number' ? val.toLocaleString() : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                      <Table size={40} className="mb-2 opacity-10" />
                      <p className="text-sm italic">无可用数据预览</p>
                    </div>
                  )}
                </div>
              )}

              {rightPanelActiveTab === 'ai' && (
                <div className="p-6 h-full flex flex-col">
                  {aiLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 size={32} className="animate-spin text-[#ec5b13]" />
                      <p className="text-sm font-medium">AI 老师正在分析您的思路...</p>
                    </div>
                  ) : aiFeedback ? (
                    <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed bg-orange-50/30 p-5 rounded-2xl border border-orange-100/50 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-4 text-[#ec5b13]">
                        <div className="w-8 h-8 bg-[#ec5b13] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                          <Sparkles size={18} fill="currentColor" />
                        </div>
                        <span className="font-bold text-base">AI 老师建议 (AI Feedback)</span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiFeedback}</div>
                      <button 
                        onClick={() => setAiFeedback(null)}
                        className="mt-6 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                      >
                         <Loader2 size={12} /> 重新分析我的代码
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-center px-10">
                      <Sparkles size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium text-slate-400">代码写累了吗？</p>
                      <p className="text-xs mt-1">点击右侧的“向 AI 老师求助”，它将指引您完成挑战</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Float Bottom Bar */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1"><Cloud size={12} className="text-blue-400" /> Vercel Cloud Sync</span>
          <span className="flex items-center gap-1"><Cpu size={12} className="text-green-500" /> Runtime: Python 3.11 WASM</span>
          <span className="flex items-center gap-1 font-bold text-[#ec5b13]/60"><Sparkles size={12} /> LLM: Gemini 1.5 Pro</span>
          <span className="ml-4 flex items-center gap-1"><Database size={12} /> Local Storage: IndexedDB</span>
        </div>
      </footer >

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
