import React, { useState } from 'react';
import { BarChart, Lock, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, displayName: string) => Promise<void>;
  onSkip: () => void;
  loading: boolean;
}

// 登录/注册视图
const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignUp, onSkip, loading }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await onSignUp(email, password, displayName || '学员');
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4c81] via-[#1a5c96] to-[#0a365c] flex items-center justify-center p-6">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
            <BarChart size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">BA-Python</h1>
          <p className="text-white/60 mt-2 text-sm">Python 商业分析实战学习平台</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">
            {isSignUp ? '创建账号' : '欢迎回来'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">显示名称</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="例：王经理"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">密码</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                />
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-[#0f4c81] rounded-lg font-bold text-sm hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  处理中...
                </>
              ) : isSignUp ? '注册' : '登录'}
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-4 text-xs text-white/40">或者</span>
              </div>
            </div>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full py-2.5 border border-white/20 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 transition-all"
            >
              {isSignUp ? '已有账号？点击登录' : '没有账号？立即注册'}
            </button>

            <button
              onClick={onSkip}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              跳过登录，体验演示版 →
            </button>
          </div>
        </div>

        {/* 底部品牌 */}
        <p className="text-center text-white/30 text-xs mt-6">
          © 2024 BA-Python · 商业分析实战训练平台
        </p>
      </div>
    </div>
  );
};

export default LoginView;
