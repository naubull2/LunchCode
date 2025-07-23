import React from 'react';
import CalendarHeatmap, { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { getUserProgress } from '../data/problemsData';
import { useTheme } from '../utils/ThemeContext';

const SubmissionHeatmap: React.FC = () => {
  const { theme } = useTheme();
  const progress = getUserProgress();

  const today = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

  const submissionData = Object.values(progress.submissions)
    .flat()
    .reduce((acc, submission) => {
      const date = new Date(submission.timestamp).toISOString().slice(0, 10);
      const existingEntry = acc.find(d => d.date === date);
      if (existingEntry) {
        existingEntry.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as { date: string; count: number }[]);

  return (
    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Submission Activity
      </h2>
      <div className={theme === 'dark' ? 'dark-heatmap' : ''}>
        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={submissionData}
          classForValue={(value: ReactCalendarHeatmapValue<string> | undefined) => {
            if (!value || value.count === 0) {
              return 'color-empty';
            }
            const count = Math.min(value.count as number, 4);
            return `color-github-${count}`;
          }}
          tooltipDataAttrs={(value: ReactCalendarHeatmapValue<string> | undefined): TooltipDataAttrs => {
            if (!value || !value.date) {
              return { 'data-tip': 'No submissions' } as TooltipDataAttrs;
            }
            return {
              'data-tip': `${new Date(value.date).toDateString()}: ${value.count} submission(s)`,
            } as TooltipDataAttrs;
          }}
        />
      </div>
      <style>{`
        .react-calendar-heatmap .color-empty {
          fill: ${theme === 'dark' ? '#2d333b' : '#ebedf0'};
        }
        .react-calendar-heatmap .color-github-1 {
          fill: #9be9a8;
        }
        .react-calendar-heatmap .color-github-2 {
          fill: #40c463;
        }
        .react-calendar-heatmap .color-github-3 {
          fill: #30a14e;
        }
        .react-calendar-heatmap .color-github-4 {
          fill: #216e39;
        }
        .dark-heatmap .react-calendar-heatmap .color-github-1 {
          fill: #0e4429;
        }
        .dark-heatmap .react-calendar-heatmap .color-github-2 {
          fill: #006d32;
        }
        .dark-heatmap .react-calendar-heatmap .color-github-3 {
          fill: #26a641;
        }
        .dark-heatmap .react-calendar-heatmap .color-github-4 {
          fill: #39d353;
        }
      `}</style>
    </div>
  );
};

export default SubmissionHeatmap;
