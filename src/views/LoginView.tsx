import React, { useState } from 'react';
import { Hexagon, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, displayName: string) => Promise<void>;
  onSkip: () => void;
  loading?: boolean;
}

export default function LoginView({ onLogin, onSignUp, onSkip, loading }: LoginViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await onLogin(email, password);
    } else {
      await onSignUp(email, password, displayName);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[420px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-[#ec5b13] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200"
          >
            <Hexagon size={32} fill="currentColor" />
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">BA-Python 修炼场</h1>
          <p className="text-slate-500 text-sm mt-1">解锁数据分析师的自动化武器</p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-8"
        >
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`text-sm font-bold pb-2 transition-all ${isLogin ? 'text-[#ec5b13] border-b-2 border-[#ec5b13]' : 'text-slate-400'}`}
            >
              登录账号
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`text-sm font-bold pb-2 transition-all ${!isLogin ? 'text-[#ec5b13] border-b-2 border-[#ec5b13]' : 'text-slate-400'}`}
            >
              注册新用户
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-500 ml-1">显示名称</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      required={!isLogin}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="如何称呼您？"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20 focus:border-[#ec5b13] transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">邮箱地址</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20 focus:border-[#ec5b13] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">登录密码</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20 focus:border-[#ec5b13] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#ec5b13] text-white font-bold py-3 rounded-xl mt-6 hover:bg-[#d04a0a] transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? '处理中...' : (isLogin ? '立即进入' : '创建账号')}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={onSkip}
              className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              暂时不登录，先看看演示
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-400 mt-8 leading-relaxed">
          注册即表示您同意我们的《服务协议》和《隐私政策》<br />
          © 2026 BA-Python Learning Platform
        </p>
      </div>
    </div>
  );
}
