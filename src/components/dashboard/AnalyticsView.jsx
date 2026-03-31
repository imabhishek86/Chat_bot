import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const AnalyticsView = ({ assignments }) => {
  const analyticsData = useMemo(() => {
    // 1. Completion Percentage
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 2. Weekly Trends (Last 4 weeks)
    const weeks = {};
    const now = new Date();
    
    // Initialize last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - (i * 7));
      const weekLabel = `Week ${4-i}`;
      weeks[weekLabel] = 0;
    }

    assignments.filter(a => a.status === 'completed').forEach(a => {
      const completedDate = new Date(a.updatedAt || a.createdAt);
      const diffDays = Math.floor((now - completedDate) / (1000 * 60 * 60 * 24));
      if (diffDays <= 28) {
        const weekNum = 4 - Math.floor(diffDays / 7);
        const label = `Week ${weekNum}`;
        if (weeks[label] !== undefined) weeks[label]++;
      }
    });

    const weeklyTrends = Object.keys(weeks).map(label => ({
      name: label,
      completed: weeks[label]
    }));

    // 3. Priority Distribution
    const priorities = {
      High: assignments.filter(a => a.priority?.toLowerCase() === 'high').length,
      Medium: assignments.filter(a => a.priority?.toLowerCase() === 'medium' || !a.priority).length,
      Low: assignments.filter(a => a.priority?.toLowerCase() === 'low').length,
    };

    const priorityData = Object.keys(priorities).map(key => ({
      name: key,
      value: priorities[key]
    }));

    return { completionRate, weeklyTrends, priorityData, total, completed };
  }, [assignments]);

  const COLORS = ['#f43f5e', '#8b5cf6', '#10b981'];

  return (
    <div className="animate-slide-up space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-[2.5rem]">
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Completion Rate</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{analyticsData.completionRate}%</span>
            <span className="text-xs font-bold text-emerald-400">Total Progress</span>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-[2.5rem]">
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Efficiency</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">
              {analyticsData.completed}/{analyticsData.total}
            </span>
            <span className="text-xs font-bold text-violet-400">Tasks Sync</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Chart */}
        <div className="glass-panel p-8 rounded-[2.5rem] min-h-[400px]">
          <h3 className="text-sm font-black text-white/80 uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
            Weekly Completion Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.weeklyTrends}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111', 
                    border: '1px solid #333', 
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorComp)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Balance */}
        <div className="glass-panel p-8 rounded-[2.5rem] min-h-[400px]">
          <h3 className="text-sm font-black text-white/80 uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            Task Complexity Mix
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {analyticsData.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: '#111', 
                    border: '1px solid #333', 
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
