import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  GraduationCap,
  FileText,
  Database,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Code,
  CheckCircle,
  Play,
  Terminal,
  Table,
  BarChart2,
  Cloud,
  Cpu,
  Hexagon,
} from 'lucide-react';
import type { Lesson, User as UserType } from '../types';

interface WorkspaceViewProps {
  onNavigate: () => void;
  lesson: Lesson | null;
  user: UserType | null;
  onSubmitCode?: (lessonId: string, code: string, output: string, isPassed: boolean) => Promise<void>;
}

// 工作台视图
const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  onNavigate,
  lesson,
  user,
  onSubmitCode,
}) => {
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'dataframe' | 'chart'>('console');

  // 加载初始代码
  useEffect(() => {
    if (lesson?.starter_code) {
      setCode(lesson.starter_code);
    }
  }, [lesson]);

  // 初始化控制台输出
  useEffect(() => {
    setConsoleOutput([
      '[14:30:21] SUCCESS: Environment ready. Pyodide 0.23 loaded.',
      `[14:30:22] INFO: DataFrame 'df_crm' loaded (5,420 rows).`,
    ]);
  }, []);

  // 模拟运行代码
  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] INFO: Running code...`]);

    // 模拟运行延时
    await new Promise(resolve => setTimeout(resolve, 1500));

    setConsoleOutput(prev => [
      ...prev,
      `>>> 清洗后的数据行数: 5214`,
      `[${new Date().toLocaleTimeString()}] SUCCESS: Code executed successfully.`,
    ]);
    setIsRunning(false);
  }, []);

  // 提交代码挑战
  const handleSubmitChallenge = useCallback(async () => {
    if (!lesson || !onSubmitCode) return;

    setIsRunning(true);
    const outputStr = consoleOutput.join('\n');

    try {
      await onSubmitCode(lesson.id, code, outputStr, true);
      setConsoleOutput(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✅ 挑战通过！代码已成功提交。`,
      ]);
    } catch {
      setConsoleOutput(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ 提交失败，请重试。`,
      ]);
    }
    setIsRunning(false);
  }, [lesson, code, consoleOutput, onSubmitCode]);

  // 使用静态数据
  const displayLesson = lesson || {
    title: 'CRM 脏数据清洗',
    business_background: '公司的 CRM（客户关系管理）系统最近导入了一批原始数据，但由于采集渠道不同，存在大量的重复记录、缺失值以及异常的消费金额。\n\n作为商业分析师，你的任务是使用 Python 的 Pandas 库对这批数据进行"大扫除"，确保后续的 RFM 模型分析能够基于准确的数据进行。',
    data_dictionary: [
      { field_name: 'customer_id', description: '唯一客户 ID', data_type: 'String' },
      { field_name: 'spend', description: '累计消费金额', data_type: 'Float' },
      { field_name: 'last_visit', description: '最后访问日期', data_type: 'DateTime' },
    ],
    hints: [
      '使用 df.dropna() 处理缺失值。',
      '使用 df.drop_duplicates() 移除重复行。',
      "过滤负数金额：df[df['spend'] > 0]。",
    ],
    starter_code: '',
  };

  return (
    <div className="bg-[#f8f6f6] text-slate-900 font-sans h-screen flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[#ec5b13] cursor-pointer" onClick={onNavigate}>
            <Hexagon size={28} fill="currentColor" className="text-[#ec5b13]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight cursor-pointer" onClick={onNavigate}>BA-Python</h2>
          <nav className="ml-8 hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">课程控制台</a>
            <a href="#" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">项目列表</a>
            <a href="#" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">学习路线</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ec5b13] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
            <User size={16} />
            {user?.display_name || '个人中心'}
          </button>
          <img
            alt="User profile"
            className="w-10 h-10 rounded-full border border-slate-300 object-cover"
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
          />
        </div>
      </header>

      {/* 主工作区 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧面板：教程内容 */}
        <aside className="w-1/3 min-w-[320px] max-w-lg border-r border-slate-200 bg-white flex flex-col">
          <div className="p-6 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap size={16} />
              数据预处理模块
            </div>
            <h1 className="text-2xl font-bold mb-4">Stage 2: {displayLesson.title}</h1>

            {/* 业务背景 */}
            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-[#ec5b13]" />
                业务背景
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {displayLesson.business_background}
              </p>
            </section>

            {/* 数据字典 */}
            <section className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Database size={18} className="text-[#ec5b13]" />
                数据字典 (DataFrame: df_crm)
              </h3>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-200">
                      <th className="text-left pb-2 font-medium">字段名</th>
                      <th className="text-left pb-2 font-medium">含义</th>
                      <th className="text-left pb-2 font-medium">预期格式</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {(displayLesson.data_dictionary as Array<{field_name: string; description: string; data_type: string}>).map((field, i) => (
                      <tr key={i}>
                        <td className="py-2 font-mono text-[#ec5b13]">{field.field_name}</td>
                        <td className="py-2">{field.description}</td>
                        <td className="py-2 italic">{field.data_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Python 提示 */}
            <section>
              <div className="border border-[#ec5b13]/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="w-full flex items-center justify-between p-3 bg-[#ec5b13]/5 text-[#ec5b13] text-sm font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb size={18} />
                    Python 提示 (Python Hint)
                  </span>
                  {showHints ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showHints && (
                  <div className="p-3 bg-white text-xs text-slate-600 space-y-2 border-t border-[#ec5b13]/20">
                    {(displayLesson.hints as string[]).map((hint, i) => (
                      <p key={i}>
                        {i + 1}. <span dangerouslySetInnerHTML={{
                          __html: hint.replace(
                            /`([^`]+)`|(\S+\([^)]*\))/g,
                            '<code class="bg-slate-100 px-1 rounded font-mono">$1$2</code>'
                          )
                        }} />
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">学习进度</span>
              <span className="text-xs font-bold text-[#ec5b13]">65%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ec5b13] h-full transition-all duration-300" style={{ width: '65%' }} />
            </div>
          </div>
        </aside>

        {/* 右侧面板：编辑器 + 结果 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 编辑器区域 */}
          <div className="flex-1 min-h-[40%] flex flex-col bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Code size={16} className="text-yellow-500" />
                  main.py
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  <Play size={14} fill="currentColor" />
                  {isRunning ? '运行中...' : '运行代码'}
                </button>
                <button
                  onClick={handleSubmitChallenge}
                  disabled={isRunning}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  提交挑战
                </button>
              </div>
            </div>
            {/* 代码编辑器 */}
            <div className="flex-1 relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full p-4 pl-14 font-mono text-sm bg-transparent text-slate-300 leading-relaxed resize-none focus:outline-none"
                style={{ tabSize: 4 }}
              />
              {/* 行号 */}
              <div className="absolute left-4 top-4 text-slate-600 font-mono text-sm select-none leading-relaxed pointer-events-none">
                {code.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部结果标签页 */}
          <div className="h-1/3 min-h-[250px] flex flex-col bg-white border-t border-slate-200">
            <div className="flex border-b border-slate-200 px-4">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'console' ? 'border-[#ec5b13] text-[#ec5b13]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Terminal size={16} />
                控制台 (Console)
              </button>
              <button
                onClick={() => setActiveTab('dataframe')}
                className={`px-4 py-2 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'dataframe' ? 'border-[#ec5b13] text-[#ec5b13]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Table size={16} />
                数据视图 (DataFrame)
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-4 py-2 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'chart' ? 'border-[#ec5b13] text-[#ec5b13]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <BarChart2 size={16} />
                可视化 (Chart)
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-50 font-mono text-xs">
              {activeTab === 'console' && (
                <>
                  {consoleOutput.map((line, i) => (
                    <div key={i} className={`${line.includes('SUCCESS') || line.includes('✅') ? 'text-green-600' : line.includes('INFO') ? 'text-blue-500' : line.includes('❌') ? 'text-red-500' : 'text-slate-800'} ${line.startsWith('>>>') ? 'mt-2' : ''}`}>
                      {line.includes('SUCCESS') || line.includes('INFO') || line.includes('✅') || line.includes('❌') ? (
                        <span>
                          {line.split(':').map((part, j) =>
                            j === 0 ? (
                              <span key={j} className="text-slate-500">{part}:<span className="font-bold">{}</span></span>
                            ) : j === 1 ? (
                              <span key={j} className="font-bold">{part}:</span>
                            ) : (
                              <span key={j}>{part}{j < line.split(':').length - 1 ? ':' : ''}</span>
                            )
                          )}
                        </span>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                  {!isRunning && (
                    <div className="text-slate-800 mt-1">&gt;&gt;&gt; <span className="animate-pulse">_</span></div>
                  )}
                </>
              )}
              {activeTab === 'dataframe' && (
                <div className="text-slate-500 text-center py-8">
                  运行代码后将在此显示 DataFrame 预览
                </div>
              )}
              {activeTab === 'chart' && (
                <div className="text-slate-500 text-center py-8">
                  运行可视化代码后将在此显示图表
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 底部状态栏 */}
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
    </div>
  );
};

export default WorkspaceView;
