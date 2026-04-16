import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const AnalyticsView = ({ assignments }) => {
  const analyticsData = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const missed = assignments.filter(a => a.status === 'missed').length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const missedRate = total > 0 ? Math.round((missed / total) * 100) : 0;

    // Weekly Trends
    const weeks = {};
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - (i * 7));
      const weekLabel = `W${4-i}`;
      weeks[weekLabel] = 0;
    }

    assignments.filter(a => a.status === 'completed').forEach(a => {
      const completedDate = new Date(a.completedAt || a.updatedAt || a.createdAt);
      const diffDays = Math.floor((now - completedDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 28) {
        const weekNum = 4 - Math.floor(diffDays / 7);
        const label = `W${weekNum}`;
        if (weeks[label] !== undefined) weeks[label]++;
      }
    });

    const weeklyTrends = Object.keys(weeks).map(label => ({
      name: label,
      completed: weeks[label]
    }));

    // Status Mix
    const statusData = [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Missed', value: missed, color: '#f43f5e' },
      { name: 'Pending', value: pending, color: '#8b5cf6' }
    ].filter(d => d.value > 0);

    return { completionRate, missedRate, weeklyTrends, statusData, total, completed, missed };
  }, [assignments]);

  return (
    <div className="animate-slide-up space-y-12 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-12 gap-8">
        <div>
          <h2 className="text-5xl font-black text-text-primary tracking-tighter mb-4 italic">Performance Ledger.</h2>
          <p className="text-text-secondary/60 text-sm font-medium tracking-wide max-w-md">Your academic momentum quantified. Tracking the balance between successful objectives and missed targets.</p>
        </div>
        <div className="flex gap-12">
           <div className="text-right">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] block mb-1">Success</span>
              <span className="text-4xl font-black text-text-primary tabular-nums">{analyticsData.completionRate}%</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] block mb-1">Deficit</span>
              <span className="text-4xl font-black text-text-primary tabular-nums">{analyticsData.missedRate}%</span>
           </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-10 rounded-[3rem] border-white/5 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1">
               <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
             </svg>
          </div>
          <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-8">Total Command</h4>
          <span className="text-6xl font-black text-text-primary block mb-2">{analyticsData.total}</span>
          <p className="text-[11px] font-bold text-text-secondary/40 italic">Global assignment throughput</p>
        </div>

        <div className="glass-panel p-10 rounded-[3rem] border-emerald-500/10 bg-emerald-500/[0.02]">
          <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-8">Conquered</h4>
          <span className="text-6xl font-black text-emerald-500 block mb-2">{analyticsData.completed}</span>
          <p className="text-[11px] font-bold text-text-secondary/40 italic">Objectives successfully neutralized</p>
        </div>

        <div className="glass-panel p-10 rounded-[3rem] border-rose-500/10 bg-rose-500/[0.02]">
          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-8">Missed</h4>
          <span className="text-6xl font-black text-rose-500 block mb-2">{analyticsData.missed}</span>
          <p className="text-[11px] font-bold text-text-secondary/40 italic">Targets lost to deadline friction</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 glass-panel p-10 rounded-[3.5rem] border-white/5">
             <div className="flex justify-between items-center mb-12">
               <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.3em]">Momentum Chart</h3>
               <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-[9px] font-black uppercase tracking-widest border border-violet-500/20">4 Week Range</span>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.weeklyTrends}>
                        <defs>
                            <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }}
                            itemStyle={{ color: '#8b5cf6' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="completed" 
                            stroke="#8b5cf6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorComp)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-10 rounded-[3.5rem] border-white/5 flex flex-col items-center justify-center">
             <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.3em] mb-12 w-full text-center">Status Distribution</h3>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={analyticsData.statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={10}
                            dataKey="value"
                        >
                            {analyticsData.statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={8} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex gap-6 mt-8">
                {analyticsData.statusData.map(d => (
                   <div key={d.name} className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: d.color }}>{d.name}</span>
                      <span className="text-xl font-black text-text-primary">{d.value}</span>
                   </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
