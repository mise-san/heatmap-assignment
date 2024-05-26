import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: 'app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  MAX_VALUE = 5;
  COLORS: { [ n: number ] : string } = { 0: '#EEEEEE', 1: '#CCE392', 2: '#90c776', 3: '#519844', 4: '#2a5225' }
  IS_SUNDAY_FIRST_DAY_OF_WEEK: boolean = false;

  now: DateTime = DateTime.now();
  yearAgoStartOfWeek: DateTime = DateTime.now();
  weeks: DateTime[] = [];
  dailyValues: DailyValue[] = [];

  get colors(): string[] {
    let colorArray = [];
    for (let c in this.COLORS) {
      colorArray.push(this.COLORS[c])
    }
    return colorArray;
  }

  get mondays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 1);
  }

  get tuesdays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 2);
  }

  get wednesdays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 3);
  }

  get thursdays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 4);
  }

  get fridays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 5);
  }

  get saturdays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 6);
  }

  get sundays(): DailyValue[] {
    return this.dailyValues.filter(v => v.day.weekday === 7);
  }

  ngOnInit(): void {
    this.updateWeeks();
    this.calculateDailyValues();
  }

  calculateDailyValues(): void {
    this.now = DateTime.now();

    // Check if Sunday is first day of week in current locale
    this.IS_SUNDAY_FIRST_DAY_OF_WEEK = this.now.startOf('week').weekday === 7;

    // Use the start of week to get even first week to heatmap tiles
    this.yearAgoStartOfWeek = this.now.minus({ years: 1 }).startOf('week').startOf('day');

    // Get the amount of days to calculate values for by getting diff between today and starting day, + 1 is today
    const diffInDays = Math.floor(this.now.startOf('day').diff(this.yearAgoStartOfWeek, 'day').days) + 1;

    for (let i = 0; i < diffInDays; i++) {
      const day = this.yearAgoStartOfWeek.plus({ days: i });

      this.dailyValues.push(new DailyValue(day, this.getRandomColor()));
    }
  }

  updateWeeks(): void {
    let weeks = [];
    for (let i = 0; i < this.yearAgoStartOfWeek.weeksInWeekYear + 1; ++i) {
      weeks.push(this.yearAgoStartOfWeek.plus({ weeks: i }) ?? '');
    }

    this.weeks = weeks;
  }

  // Generate random color code weighted down to lower values to get more realistic looking heatmap
  getRandomColor(): string {
    return this.COLORS[Math.floor(Math.min(Math.random() * this.MAX_VALUE, Math.random() * this.MAX_VALUE))];
  }

  // Show month label only on the first week for each month
  showMonthLabel(date: DateTime): boolean {
    return date.day < 8;
  }
}

export class DailyValue {
  constructor(public day: DateTime, public color: string) {
  }
}
