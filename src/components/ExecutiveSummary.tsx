'use client';

import { AnalyticsData, ChatData } from '@/types/chat';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Minus, Users, Timer, MessageCircle, Zap, Download } from 'lucide-react';

interface ExecutiveSummaryProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
}

interface HealthScore {
  score: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface KeyMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  context: string;
}

interface ActionableInsight {
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export default function ExecutiveSummary({ analyticsData, chatData }: ExecutiveSummaryProps) {
  
  // Calculate team health score (0-100)
  const calculateHealthScore = (): HealthScore => {
    let score = 100;
    const issues: string[] = [];
    
    // Response time factor (30% weight)
    const avgResponseHours = analyticsData.responseTimeAnalysis.averageResponseTimeMinutes / 60;
    if (avgResponseHours > 24) {
      score -= 30;
      issues.push('slow responses');
    } else if (avgResponseHours > 8) {
      score -= 15;
    } else if (avgResponseHours > 2) {
      score -= 5;
    }
    
    // Participation balance (25% weight)
    const topParticipant = analyticsData.messagesByParticipant[0];
    if (topParticipant) {
      const dominancePercentage = (topParticipant.count / analyticsData.filteredMessageCount) * 100;
      if (dominancePercentage > 80) {
        score -= 25;
        issues.push('communication imbalance');
      } else if (dominancePercentage > 70) {
        score -= 15;
      } else if (dominancePercentage > 60) {
        score -= 8;
      }
    }
    
    // Activity level (20% weight)
    const avgMessagesPerDay = analyticsData.messagesByDay.length > 0 
      ? analyticsData.filteredMessageCount / analyticsData.messagesByDay.length 
      : 0;
    if (avgMessagesPerDay < 5) {
      score -= 20;
      issues.push('low activity');
    } else if (avgMessagesPerDay < 15) {
      score -= 10;
    }
    
    // Conversation starters balance (15% weight)
    const topStarter = analyticsData.conversationStarters[0];
    if (topStarter && topStarter.percentage > 80) {
      score -= 15;
      issues.push('initiative concentration');
    } else if (topStarter && topStarter.percentage > 70) {
      score -= 8;
    }
    
    // Engagement level (10% weight)
    const emojiPerMessage = analyticsData.filteredMessageCount > 0 
      ? analyticsData.emojiAnalysis.totalEmojis / analyticsData.filteredMessageCount 
      : 0;
    if (emojiPerMessage < 0.05) {
      score -= 10;
      issues.push('low engagement');
    }
    
    score = Math.max(0, Math.min(100, score));
    
    // Determine status
    let status: HealthScore['status'];
    let label: string;
    let icon: React.ComponentType<{ className?: string }>;
    let color: string;
    let bgColor: string;
    
    if (score >= 85) {
      status = 'excellent';
      label = 'Excellent';
      icon = CheckCircle;
      color = 'text-green-600';
      bgColor = 'bg-green-50';
    } else if (score >= 70) {
      status = 'good';
      label = 'Good';
      icon = CheckCircle;
      color = 'text-blue-600';
      bgColor = 'bg-blue-50';
    } else if (score >= 50) {
      status = 'attention';
      label = 'Needs Attention';
      icon = AlertTriangle;
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
    } else {
      status = 'critical';
      label = 'Critical';
      icon = XCircle;
      color = 'text-red-600';
      bgColor = 'bg-red-50';
    }
    
    return { score, status, label, icon, color, bgColor };
  };

  // Generate key metrics
  const getKeyMetrics = (): KeyMetric[] => {
    const avgResponseHours = analyticsData.responseTimeAnalysis.averageResponseTimeMinutes / 60;
    const avgMessagesPerDay = analyticsData.messagesByDay.length > 0 
      ? analyticsData.filteredMessageCount / analyticsData.messagesByDay.length 
      : 0;
    
    const topParticipant = analyticsData.messagesByParticipant[0];
    const participationBalance = topParticipant 
      ? (topParticipant.count / analyticsData.filteredMessageCount) * 100 
      : 0;
    
    return [
      {
        label: 'Response Speed',
        value: avgResponseHours < 1 
          ? `${Math.round(analyticsData.responseTimeAnalysis.averageResponseTimeMinutes)}m`
          : `${avgResponseHours.toFixed(1)}h`,
        trend: avgResponseHours < 2 ? 'up' : avgResponseHours > 8 ? 'down' : 'stable',
        status: avgResponseHours < 2 ? 'good' : avgResponseHours > 8 ? 'critical' : 'warning',
        context: avgResponseHours < 1 ? 'Excellent' : avgResponseHours < 2 ? 'Good' : avgResponseHours < 8 ? 'Acceptable' : 'Slow'
      },
      {
        label: 'Daily Activity',
        value: `${Math.round(avgMessagesPerDay)} msgs/day`,
        trend: avgMessagesPerDay > 30 ? 'up' : avgMessagesPerDay < 10 ? 'down' : 'stable',
        status: avgMessagesPerDay > 20 ? 'good' : avgMessagesPerDay < 10 ? 'critical' : 'warning',
        context: avgMessagesPerDay > 50 ? 'Very Active' : avgMessagesPerDay > 20 ? 'Active' : avgMessagesPerDay > 10 ? 'Moderate' : 'Low'
      },
      {
        label: 'Team Balance',
        value: `${Math.round(100 - participationBalance)}% balanced`,
        trend: participationBalance < 60 ? 'up' : participationBalance > 80 ? 'down' : 'stable',
        status: participationBalance < 60 ? 'good' : participationBalance > 80 ? 'critical' : 'warning',
        context: participationBalance < 60 ? 'Well Balanced' : participationBalance < 70 ? 'Slightly Unbalanced' : 'Dominated'
      }
    ];
  };

  // Generate actionable insights
  const getActionableInsights = (): ActionableInsight[] => {
    const insights: ActionableInsight[] = [];
    const avgResponseHours = analyticsData.responseTimeAnalysis.averageResponseTimeMinutes / 60;
    const topParticipant = analyticsData.messagesByParticipant[0];
    const participationBalance = topParticipant 
      ? (topParticipant.count / analyticsData.filteredMessageCount) * 100 
      : 0;
    
    // Response time insight
    if (avgResponseHours > 8) {
      insights.push({
        title: 'Improve Response Times',
        description: `Average response time is ${avgResponseHours.toFixed(1)} hours`,
        action: 'Set team response SLA targets',
        priority: 'high',
        icon: '⚡'
      });
    }
    
    // Participation balance
    if (participationBalance > 70) {
      insights.push({
        title: 'Balance Team Participation',
        description: `${topParticipant?.name} dominates ${Math.round(participationBalance)}% of conversations`,
        action: 'Encourage quieter team members to participate',
        priority: 'high',
        icon: '⚖️'
      });
    }
    
    // Low activity
    const avgMessagesPerDay = analyticsData.messagesByDay.length > 0 
      ? analyticsData.filteredMessageCount / analyticsData.messagesByDay.length 
      : 0;
    if (avgMessagesPerDay < 10) {
      insights.push({
        title: 'Increase Team Engagement',
        description: `Only ${Math.round(avgMessagesPerDay)} messages per day`,
        action: 'Schedule regular check-ins or team building',
        priority: 'medium',
        icon: '📈'
      });
    }
    
    // Peak time optimization
    const peakHour = analyticsData.mostActiveHour;
    if (peakHour >= 22 || peakHour <= 6) {
      insights.push({
        title: 'Optimize Communication Hours',
        description: 'Peak activity is during off-hours',
        action: 'Consider async communication tools',
        priority: 'medium',
        icon: '🕐'
      });
    }
    
    // Positive insights
    if (avgResponseHours < 1) {
      insights.push({
        title: 'Excellent Responsiveness',
        description: 'Team responds within an hour',
        action: 'Maintain current communication practices',
        priority: 'low',
        icon: '🏆'
      });
    }
    
    return insights.slice(0, 3); // Show max 3 insights
  };

  const healthScore = calculateHealthScore();
  const keyMetrics = getKeyMetrics();
  const actionableInsights = getActionableInsights();
  const HealthIcon = healthScore.icon;

  const exportSummary = () => {
    const summary = {
      teamHealthScore: {
        score: healthScore.score,
        status: healthScore.label
      },
      keyMetrics: keyMetrics.map(m => ({
        label: m.label,
        value: m.value,
        context: m.context
      })),
      actionItems: actionableInsights.map(i => ({
        title: i.title,
        description: i.description,
        action: i.action,
        priority: i.priority
      })),
      teamOverview: {
        members: chatData.participants.length,
        messages: analyticsData.filteredMessageCount,
        avgResponse: `${Math.round(analyticsData.responseTimeAnalysis.averageResponseTimeMinutes / 60)}h`,
        topInitiator: analyticsData.conversationStarters.length > 0 ? analyticsData.conversationStarters[0].name : 'N/A'
      },
      dateRange: `${chatData.dateRange.start.toLocaleDateString()} - ${chatData.dateRange.end.toLocaleDateString()}`,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(summary, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-communication-summary-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
          <p className="text-gray-600">Key insights for decision makers</p>
        </div>
        <button
          onClick={exportSummary}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Team Health Score */}
      <div className={`${healthScore.bgColor} rounded-2xl p-6 border-2 ${healthScore.color.replace('text-', 'border-').replace('-600', '-200')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`${healthScore.color.replace('text-', 'bg-').replace('-600', '-100')} p-4 rounded-2xl`}>
              <HealthIcon className={`h-8 w-8 ${healthScore.color}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Team Health Score</h3>
              <p className={`text-lg font-semibold ${healthScore.color}`}>{healthScore.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">{healthScore.score}</div>
            <div className="text-sm text-gray-600">out of 100</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">{metric.label}</h4>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                  {metric.context}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Team Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Team Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-50 p-3 rounded-lg mb-2">
              <Users className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{chatData.participants.length}</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
          <div className="text-center">
            <div className="bg-green-50 p-3 rounded-lg mb-2">
              <MessageCircle className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.filteredMessageCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
          <div className="text-center">
            <div className="bg-purple-50 p-3 rounded-lg mb-2">
              <Timer className="h-6 w-6 text-purple-600 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(analyticsData.responseTimeAnalysis.averageResponseTimeMinutes / 60)}h</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="bg-orange-50 p-3 rounded-lg mb-2">
              <Zap className="h-6 w-6 text-orange-600 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.conversationStarters.length > 0 ? analyticsData.conversationStarters[0].name.split(' ')[0] : 'N/A'}</div>
            <div className="text-sm text-gray-600">Top Initiator</div>
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      {actionableInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Action Items</h3>
          <div className="space-y-3">
            {actionableInsights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-l-4 ${
                  insight.priority === 'high' 
                    ? 'bg-red-50 border-red-400' 
                    : insight.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl" role="img">{insight.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-sm font-medium text-gray-800 mt-2">→ {insight.action}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : insight.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {insight.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}