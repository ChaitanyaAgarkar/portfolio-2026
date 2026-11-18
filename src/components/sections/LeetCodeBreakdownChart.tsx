import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useUIStore } from '@/stores/uiStore';

interface BreakdownDatum {
  name: string;
  solved: number;
  total: number;
  color: string;
}

interface LeetCodeBreakdownChartProps {
  data: BreakdownDatum[];
}

export default function LeetCodeBreakdownChart({ data }: LeetCodeBreakdownChartProps) {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';
  const tickColor = isDark ? '#A1A1B5' : '#555555';

  return (
    <div className="h-[200px] w-full min-w-[220px]">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <XAxis
            dataKey="name"
            stroke={tickColor}
            tick={{ fill: tickColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.12)' }}
            tickLine={false}
          />
          <YAxis
            stroke={tickColor}
            tick={{ fill: tickColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(32, 96, 255, 0.06)' }}
            contentStyle={{
              backgroundColor: isDark ? '#171A24' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(17, 17, 17, 0.14)',
              borderRadius: '8px',
              color: isDark ? '#F4F4F6' : '#111111',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              boxShadow: isDark
                ? '0 10px 24px rgba(0, 0, 0, 0.55)'
                : '0 8px 20px rgba(17, 17, 17, 0.08)',
            }}
            formatter={(value, _name, props) => {
              const entry = props.payload as BreakdownDatum | undefined;
              return [`${value} / ${entry?.total ?? ''}`, 'Solved'];
            }}
          />
          <Bar dataKey="solved" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
