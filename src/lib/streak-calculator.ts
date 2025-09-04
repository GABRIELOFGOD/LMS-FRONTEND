// Utility functions for calculating real user streaks based on activity data
// This will be used when the backend implements proper activity tracking

export interface ActivityDay {
  date: string; // ISO date string (e.g., "2025-09-04")
  hasActivity: boolean; // Whether user had learning activity on this day
  activities?: string[]; // Optional: specific activities (lessons, quizzes, etc.)
}

/**
 * Calculate current streak based on daily activity data
 * @param activityDays Array of activity data sorted by date (newest first)
 * @returns Current consecutive days of activity (resets to 0 when streak breaks)
 */
export function calculateCurrentStreak(activityDays: ActivityDay[]): number {
  if (!activityDays || activityDays.length === 0) {
    return 0;
  }

  // Sort by date descending (newest first) to count backwards from today
  const sortedDays = [...activityDays].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format

  // Start counting from today backwards
  for (const day of sortedDays) {
    const dayDate = new Date(day.date).toISOString().split('T')[0];
    
    // Calculate days difference from today
    const daysDiff = Math.floor(
      (new Date(today).getTime() - new Date(dayDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // If this day is in the future, skip it
    if (daysDiff < 0) continue;

    // If we've reached beyond consecutive days, break
    if (daysDiff > currentStreak) break;

    // If this day has activity and is part of the consecutive sequence
    if (day.hasActivity && daysDiff === currentStreak) {
      currentStreak++;
    } else {
      // Streak is broken
      break;
    }
  }

  return currentStreak;
}

/**
 * Calculate longest streak from activity history
 * @param activityDays Array of activity data
 * @returns Longest consecutive streak ever achieved
 */
export function calculateLongestStreak(activityDays: ActivityDay[]): number {
  if (!activityDays || activityDays.length === 0) {
    return 0;
  }

  // Sort by date ascending (oldest first)
  const sortedDays = [...activityDays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let longestStreak = 0;
  let currentStreak = 0;

  for (const day of sortedDays) {
    if (day.hasActivity) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0; // Reset streak when no activity
    }
  }

  return longestStreak;
}

/**
 * Generate mock activity data for testing streak calculations
 * This simulates what the backend should eventually provide
 */
export function generateMockActivityData(): ActivityDay[] {
  const days: ActivityDay[] = [];
  const today = new Date();
  
  // Generate last 30 days of mock data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate activity pattern (more likely to have activity on weekdays)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const hasActivity = Math.random() > (isWeekend ? 0.7 : 0.3);
    
    days.push({
      date: date.toISOString().split('T')[0],
      hasActivity,
      activities: hasActivity ? ['lesson_completed', 'quiz_taken'] : []
    });
  }
  
  return days;
}

/**
 * Calculate streak stats for dashboard display
 * @param activityDays Activity data from backend
 * @returns Object with current and longest streak
 */
export function calculateStreakStats(activityDays: ActivityDay[] = []) {
  return {
    currentStreak: calculateCurrentStreak(activityDays),
    longestStreak: calculateLongestStreak(activityDays)
  };
}

// Example usage:
// const mockData = generateMockActivityData();
// const { currentStreak, longestStreak } = calculateStreakStats(mockData);
// console.log(`Current: ${currentStreak}, Longest: ${longestStreak}`);
